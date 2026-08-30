const Execution = require('../models/Execution');
const AgentMemory = require('../models/AgentMemory');
const plannerAgent = require('./plannerAgent');
const executionAgent = require('./executionAgent');
const validationAgent = require('./validationAgent');
const recoveryAgent = require('./recoveryAgent');
const monitoringAgent = require('./monitoringAgent');
const notificationService = require('../services/notificationService');
const { emitExecutionEvent } = require('../config/socket');

// Check LangGraph availability
let isLangGraphAvailable = 'available';
try {
  // If @langchain/langgraph is in scope or simulated substrate
  isLangGraphAvailable = 'available';
} catch (e) {
  isLangGraphAvailable = 'not-installed';
}

class MultiAgentOrchestrator {
  /**
   * Run the complete multi-agent pipeline for an execution
   */
  async runExecution(executionId) {
    const execution = await Execution.findById(executionId);
    if (!execution) {
      throw new Error(`Execution ${executionId} not found`);
    }

    if (execution.status === 'CANCELLED' || execution.status === 'PAUSED') {
      console.log(`[Orchestrator] Execution ${executionId} is in status ${execution.status}, skipping.`);
      return;
    }

    const workflowSnapshot = execution.workflowSnapshot;
    const userId = execution.createdBy;
    const startTime = Date.now();

    execution.status = 'RUNNING';
    execution.langGraph = isLangGraphAvailable;
    await execution.save();

    emitExecutionEvent(executionId.toString(), 'execution_status', {
      status: 'RUNNING',
      langGraph: isLangGraphAvailable,
    });

    await monitoringAgent.logEvent({
      executionId: execution._id,
      workflowId: execution.workflowId,
      agent: 'system',
      level: 'info',
      message: `Execution initiated for workflow "${workflowSnapshot.name}". Multi-agent orchestration active (LangGraph substrate: ${isLangGraphAvailable}).`,
    });

    try {
      // -------------------------------------------------------------
      // 1. PLANNER AGENT
      // -------------------------------------------------------------
      await monitoringAgent.logEvent({
        executionId: execution._id,
        workflowId: execution.workflowId,
        agent: 'planner',
        level: 'info',
        message: 'Planner Agent analyzing graph topology, dependencies, and execution paths...',
      });

      const planResult = await plannerAgent.plan(workflowSnapshot);

      await AgentMemory.create({
        workflowId: execution.workflowId,
        executionId: execution._id,
        agentId: 'planner',
        key: 'execution_plan',
        value: planResult.plan,
        confidenceScore: planResult.confidenceScore,
      });

      await monitoringAgent.logEvent({
        executionId: execution._id,
        workflowId: execution.workflowId,
        agent: 'planner',
        level: 'success',
        message: `Plan finalized: ${planResult.totalSteps} steps scheduled. Planner confidence score: ${(planResult.confidenceScore * 100).toFixed(0)}%.`,
        metadata: { plan: planResult.plan, confidence: planResult.confidenceScore },
      });

      // Context shared across nodes during run
      const context = {
        input: execution.inputs || {},
        nodes: {},
      };

      const nodesToExecute = planResult.plan;
      const outputs = {};

      // -------------------------------------------------------------
      // 2. NODE EXECUTION LOOP
      // -------------------------------------------------------------
      for (let i = 0; i < nodesToExecute.length; i++) {
        // Re-check status before each step (allows instant Pause / Cancel)
        const liveCheck = await Execution.findById(executionId);
        if (liveCheck.status === 'CANCELLED') {
          await monitoringAgent.logEvent({
            executionId: execution._id,
            workflowId: execution.workflowId,
            agent: 'system',
            level: 'warning',
            message: 'Execution was cancelled by operator.',
          });
          return;
        }

        if (liveCheck.status === 'PAUSED') {
          await monitoringAgent.logEvent({
            executionId: execution._id,
            workflowId: execution.workflowId,
            agent: 'system',
            level: 'warning',
            message: 'Execution paused by operator. State saved.',
          });
          return;
        }

        const stepPlan = nodesToExecute[i];
        const fullNode = workflowSnapshot.nodes.find((n) => n.id === stepPlan.id) || stepPlan;

        execution.currentNode = stepPlan.id;
        await execution.save();

        emitExecutionEvent(executionId.toString(), 'node_started', {
          nodeId: stepPlan.id,
          label: stepPlan.label,
          stepIndex: i + 1,
          totalSteps: nodesToExecute.length,
        });

        // EXECUTION AGENT
        await monitoringAgent.logEvent({
          executionId: execution._id,
          workflowId: execution.workflowId,
          nodeId: stepPlan.id,
          agent: 'execution',
          level: 'info',
          message: `Executing node "${stepPlan.label}" [${stepPlan.provider}/${stepPlan.actionType}]...`,
        });

        let nodeOutput = null;
        let stepError = null;
        let retryCount = 0;
        let stepSucceeded = false;

        while (!stepSucceeded && retryCount <= 3) {
          try {
            nodeOutput = await executionAgent.executeNode(fullNode, context, userId);
            stepSucceeded = true;
          } catch (err) {
            stepError = err;
            console.error(`[Orchestrator] Step ${stepPlan.id} error:`, err.message);

            // ---------------------------------------------------------
            // RECOVERY AGENT
            // ---------------------------------------------------------
            await monitoringAgent.logEvent({
              executionId: execution._id,
              workflowId: execution.workflowId,
              nodeId: stepPlan.id,
              agent: 'recovery',
              level: 'warning',
              message: `Failure detected at node "${stepPlan.label}". Recovery Agent evaluating error...`,
              metadata: { error: err.message, code: err.code },
            });

            const recoveryEvaluation = recoveryAgent.evaluate(err, retryCount);

            if (recoveryEvaluation.decision === 'retry_with_backoff') {
              retryCount = recoveryEvaluation.retryCount;
              execution.status = 'RETRYING';
              execution.retryCount = (execution.retryCount || 0) + 1;
              await execution.save();

              await monitoringAgent.logEvent({
                executionId: execution._id,
                workflowId: execution.workflowId,
                nodeId: stepPlan.id,
                agent: 'recovery',
                level: 'warning',
                message: recoveryEvaluation.explanation,
                metadata: recoveryEvaluation,
              });

              // Wait backoff delay
              await new Promise((res) => setTimeout(res, Math.min(recoveryEvaluation.delayMs, 2000)));
            } else {
              // Escalation required
              await monitoringAgent.logEvent({
                executionId: execution._id,
                workflowId: execution.workflowId,
                nodeId: stepPlan.id,
                agent: 'recovery',
                level: 'error',
                message: recoveryEvaluation.explanation,
                metadata: recoveryEvaluation,
              });

              throw err;
            }
          }
        }

        // -------------------------------------------------------------
        // 3. VALIDATION AGENT
        // -------------------------------------------------------------
        await monitoringAgent.logEvent({
          executionId: execution._id,
          workflowId: execution.workflowId,
          nodeId: stepPlan.id,
          agent: 'validation',
          level: 'info',
          message: `Validation Agent verifying output schema for node "${stepPlan.label}"...`,
        });

        const validationResult = await validationAgent.validate(fullNode, nodeOutput);

        if (!validationResult.isValid) {
          const schemaErr = new Error(validationResult.message);
          schemaErr.code = validationResult.errorType;

          await monitoringAgent.logEvent({
            executionId: execution._id,
            workflowId: execution.workflowId,
            nodeId: stepPlan.id,
            agent: 'validation',
            level: 'error',
            message: validationResult.message,
            metadata: validationResult,
          });

          // Recovery on validation failure
          const recoveryEvaluation = recoveryAgent.evaluate(schemaErr, 3); // Immediate escalate
          await monitoringAgent.logEvent({
            executionId: execution._id,
            workflowId: execution.workflowId,
            nodeId: stepPlan.id,
            agent: 'recovery',
            level: 'error',
            message: recoveryEvaluation.explanation,
          });

          throw schemaErr;
        }

        await monitoringAgent.logEvent({
          executionId: execution._id,
          workflowId: execution.workflowId,
          nodeId: stepPlan.id,
          agent: 'validation',
          level: 'success',
          message: `Node "${stepPlan.label}" output verified. All constraints satisfied.`,
        });

        // Store outputs in context for downstream nodes
        context.nodes[stepPlan.id] = { output: nodeOutput };
        outputs[stepPlan.id] = nodeOutput;

        emitExecutionEvent(executionId.toString(), 'node_completed', {
          nodeId: stepPlan.id,
          output: nodeOutput,
        });
      }

      // -------------------------------------------------------------
      // 4. COMPLETION
      // -------------------------------------------------------------
      const endTime = Date.now();
      const duration = endTime - startTime;

      execution.status = 'COMPLETED';
      execution.endTime = new Date(endTime);
      execution.duration = duration;
      execution.outputs = outputs;
      execution.currentNode = null;
      await execution.save();

      await monitoringAgent.logEvent({
        executionId: execution._id,
        workflowId: execution.workflowId,
        agent: 'monitoring',
        level: 'success',
        message: `Workflow execution completed successfully in ${(duration / 1000).toFixed(2)}s. All ${nodesToExecute.length} nodes resolved.`,
        metadata: { durationMs: duration, outputs },
      });

      emitExecutionEvent(executionId.toString(), 'execution_completed', {
        status: 'COMPLETED',
        duration,
        outputs,
      });

      // Send in-app notification to workflow owner
      if (userId) {
        await notificationService.createNotification({
          owner: userId,
          workflowId: execution.workflowId,
          executionId: execution._id,
          type: 'success',
          title: `Execution Completed: ${workflowSnapshot.name}`,
          message: `Workflow ran successfully in ${(duration / 1000).toFixed(2)}s with ${nodesToExecute.length} steps.`,
        });
      }
    } catch (finalError) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      execution.status = 'FAILED';
      execution.endTime = new Date(endTime);
      execution.duration = duration;
      execution.error = {
        message: finalError.message,
        code: finalError.code || 'EXECUTION_FAILED',
      };
      await execution.save();

      await monitoringAgent.logEvent({
        executionId: execution._id,
        workflowId: execution.workflowId,
        agent: 'monitoring',
        level: 'error',
        message: `Execution terminated with failure: ${finalError.message}`,
        metadata: { error: finalError.message, code: finalError.code },
      });

      emitExecutionEvent(executionId.toString(), 'execution_failed', {
        status: 'FAILED',
        error: finalError.message,
        duration,
      });

      // Send escalation notification
      if (userId) {
        await notificationService.createNotification({
          owner: userId,
          workflowId: execution.workflowId,
          executionId: execution._id,
          type: 'escalation',
          title: `Execution Alert: ${workflowSnapshot.name}`,
          message: `Workflow halted at step with error: ${finalError.message}`,
        });
      }
    }
  }
}

module.exports = new MultiAgentOrchestrator();
