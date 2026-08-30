const ExecutionLog = require('../models/ExecutionLog');
const { emitExecutionEvent } = require('../config/socket');

/**
 * Monitoring Agent
 * Captures granular runtime events from all agents, persists them to ExecutionLog,
 * and streams real-time telemetry updates to subscribed UI clients.
 */
class MonitoringAgent {
  constructor() {
    this.name = 'monitoring';
  }

  async logEvent({ executionId, workflowId, nodeId = null, agent, level = 'info', message, metadata = {} }) {
    try {
      const logEntry = new ExecutionLog({
        executionId,
        workflowId,
        nodeId,
        agent: agent || this.name,
        level,
        message,
        metadata,
        timestamp: new Date(),
      });

      await logEntry.save();

      // Broadcast event in real time via Socket.IO
      emitExecutionEvent(executionId.toString(), 'agent_log', {
        id: logEntry._id,
        executionId: logEntry.executionId,
        workflowId: logEntry.workflowId,
        nodeId: logEntry.nodeId,
        agent: logEntry.agent,
        level: logEntry.level,
        message: logEntry.message,
        metadata: logEntry.metadata,
        timestamp: logEntry.timestamp,
      });

      console.log(`[MonitoringAgent] [${agent.toUpperCase()}] [${level.toUpperCase()}] ${message}`);
      return logEntry;
    } catch (err) {
      console.error('[MonitoringAgent] Failed to record execution log:', err.message);
    }
  }
}

module.exports = new MonitoringAgent();
