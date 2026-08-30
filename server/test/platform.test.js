const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const authService = require('../src/services/authService');
const workflowService = require('../src/services/workflowService');
const aiService = require('../src/services/aiService');
const executionService = require('../src/services/executionService');
const integrationService = require('../src/services/integrationService');
const notificationService = require('../src/services/notificationService');
const plannerAgent = require('../src/agents/plannerAgent');
const validationAgent = require('../src/agents/validationAgent');
const recoveryAgent = require('../src/agents/recoveryAgent');
const orchestrator = require('../src/agents/orchestrator');

let mongod;

describe('Agentflow_AI Platform End-to-End Test Suite', () => {
  before(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  });

  let testUser;
  let testToken;
  let testWorkflow;

  describe('1. Authentication & Security', () => {
    test('Registers a new operator and hashes password', async () => {
      const result = await authService.registerUser({
        name: 'Test Operator',
        email: 'operator@agentflow.ai',
        password: 'SecurePassword123!',
        role: 'operator',
      });

      assert.ok(result.token, 'Should return JWT token');
      assert.strictEqual(result.user.email, 'operator@agentflow.ai');
      assert.strictEqual(result.user.role, 'operator');
      testUser = result.user;
      testToken = result.token;
    });

    test('Authenticates registered operator and returns session token', async () => {
      const result = await authService.loginUser({
        email: 'operator@agentflow.ai',
        password: 'SecurePassword123!',
      });

      assert.ok(result.token);
      assert.strictEqual(result.user.id.toString(), testUser.id.toString());
    });

    test('Rejects invalid credentials', async () => {
      await assert.rejects(async () => {
        await authService.loginUser({
          email: 'operator@agentflow.ai',
          password: 'WrongPassword!',
        });
      }, /Invalid email or password/);
    });
  });

  describe('2. AI Workflow Generation', () => {
    test('Synthesizes connected graph with deterministic fallback engine', async () => {
      const prompt = 'When customer inquiry email is received, summarize with AI and send alert to Slack';
      const generated = await aiService.generateWorkflowFromPrompt(prompt);

      assert.ok(generated.name);
      assert.ok(Array.isArray(generated.nodes) && generated.nodes.length >= 3);
      assert.ok(Array.isArray(generated.edges) && generated.edges.length >= 2);
      
      const hasTrigger = generated.nodes.some(n => n.type === 'trigger');
      const hasAI = generated.nodes.some(n => n.type === 'ai');
      const hasSlack = generated.nodes.some(n => n.data?.provider === 'slack');

      assert.ok(hasTrigger, 'Should have trigger node');
      assert.ok(hasAI, 'Should have AI reasoning node');
      assert.ok(hasSlack, 'Should have Slack integration node');
    });
  });

  describe('3. Workflow Management & CRUD', () => {
    test('Creates a new workflow', async () => {
      testWorkflow = await workflowService.createWorkflow(testUser.id, {
        name: 'Customer Support Pipeline',
        description: 'Auto-reply and logging',
        nodes: [
          {
            id: 'node_1',
            type: 'trigger',
            position: { x: 250, y: 50 },
            data: { label: 'Webhook Trigger', provider: 'system', actionType: 'manual' },
          },
          {
            id: 'node_2',
            type: 'ai',
            position: { x: 250, y: 190 },
            data: { label: 'AI Summarizer', provider: 'gemini', actionType: 'ai_generate' },
          },
          {
            id: 'node_3',
            type: 'integration',
            position: { x: 250, y: 330 },
            data: {
              label: 'Gmail Dispatcher',
              provider: 'gmail',
              actionType: 'send_email',
              config: { to: 'support@test.com', subject: 'Customer Inquiry' },
            },
          },
        ],
        edges: [
          { id: 'e1-2', source: 'node_1', target: 'node_2' },
          { id: 'e2-3', source: 'node_2', target: 'node_3' },
        ],
        tags: ['support', 'ai'],
      });

      assert.ok(testWorkflow._id);
      assert.strictEqual(testWorkflow.name, 'Customer Support Pipeline');
      assert.strictEqual(testWorkflow.nodes.length, 3);
    });

    test('Duplicates an existing workflow', async () => {
      const cloned = await workflowService.duplicateWorkflow(testWorkflow._id, testUser.id);
      assert.strictEqual(cloned.name, 'Customer Support Pipeline (Copy)');
      assert.strictEqual(cloned.nodes.length, 3);
    });

    test('Fetches aggregated dashboard metrics', async () => {
      const metrics = await workflowService.getDashboardMetrics(testUser.id);
      assert.strictEqual(metrics.totalWorkflows, 2);
      assert.strictEqual(typeof metrics.successRate, 'number');
    });
  });

  describe('4. Multi-Agent Orchestration & Execution', () => {
    test('Planner Agent produces topological order and confidence score', async () => {
      const plan = await plannerAgent.plan(testWorkflow);
      assert.strictEqual(plan.success, true);
      assert.strictEqual(plan.totalSteps, 3);
      assert.strictEqual(plan.plan[0].id, 'node_1');
      assert.strictEqual(plan.plan[1].id, 'node_2');
      assert.strictEqual(plan.plan[2].id, 'node_3');
      assert.ok(plan.confidenceScore >= 0.8);
    });

    test('Validation Agent verifies node outputs', async () => {
      const valid = await validationAgent.validate(
        { id: 'node_3', data: { provider: 'gmail', actionType: 'send_email' } },
        { messageId: 'msg_12345', to: 'support@test.com', status: 'sent' }
      );
      assert.strictEqual(valid.isValid, true);

      const invalid = await validationAgent.validate(
        { id: 'node_3', data: { provider: 'gmail', actionType: 'send_email' } },
        null
      );
      assert.strictEqual(invalid.isValid, false);
      assert.strictEqual(invalid.errorType, 'MISSING_FIELDS');
    });

    test('Recovery Agent classifies errors and assigns backoff', () => {
      const rateLimitErr = new Error('Rate limit exceeded: 429 Too Many Requests');
      const eval1 = recoveryAgent.evaluate(rateLimitErr, 0);
      assert.strictEqual(eval1.decision, 'retry_with_backoff');
      assert.strictEqual(eval1.category, 'RATE_LIMIT');

      const authErr = new Error('401 Unauthorized token expired');
      const eval2 = recoveryAgent.evaluate(authErr, 0);
      assert.strictEqual(eval2.decision, 'escalate');
      assert.strictEqual(eval2.category, 'AUTH_EXPIRED');
    });

    test('Runs complete end-to-end execution through 5-agent pipeline', async () => {
      const execution = await executionService.createAndStartExecution(
        testWorkflow._id,
        testUser.id,
        { customerName: 'Alice', inquiry: 'Need assistance with API integration' }
      );

      assert.ok(execution._id);

      // Wait for queue worker to finish processing
      let completed;
      for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 100));
        completed = await executionService.getExecutionById(execution._id);
        if (completed.status === 'COMPLETED' || completed.status === 'FAILED') {
          break;
        }
      }

      assert.strictEqual(completed.status, 'COMPLETED');
      assert.ok(completed.duration >= 0);
      assert.ok(completed.outputs.node_1);
      assert.ok(completed.outputs.node_2);
      assert.ok(completed.outputs.node_3);

      const timeline = await executionService.getExecutionTimeline(execution._id);
      assert.ok(timeline.length >= 5, 'Timeline should contain agent logs');
      
      const agentsInvolved = new Set(timeline.map(l => l.agent));
      assert.ok(agentsInvolved.has('planner'), 'Planner agent logged');
      assert.ok(agentsInvolved.has('execution'), 'Execution agent logged');
      assert.ok(agentsInvolved.has('validation'), 'Validation agent logged');
      assert.ok(agentsInvolved.has('monitoring'), 'Monitoring agent logged');
    });
  });

  describe('5. Third-Party Integrations & AES-256 Encryption Vault', () => {
    test('Encrypts and decrypts OAuth tokens securely at rest', async () => {
      const rawSecret = 'oauth_access_token_secret_123456789';
      const { encrypted, iv, authTag } = integrationService.encryptToken(rawSecret);
      assert.notStrictEqual(encrypted, rawSecret);

      const decrypted = integrationService.decryptToken(encrypted, iv, authTag);
      assert.strictEqual(decrypted, rawSecret);
    });

    test('Saves encrypted integration credentials and retrieves status', async () => {
      await integrationService.saveIntegrationCredentials(testUser.id, 'slack', {
        accessToken: 'xoxb-test-slack-token',
        refreshToken: 'xoxr-test-refresh-token',
        accountName: 'Company Workspace',
        accountEmail: 'bot@slack.com',
        scopes: ['chat:write', 'channels:read'],
      });

      const userIntegrations = await integrationService.getUserIntegrations(testUser.id);
      const slack = userIntegrations.find(i => i.provider === 'slack');
      assert.strictEqual(slack.isConnected, true);
      assert.strictEqual(slack.accountName, 'Company Workspace');
      // Verify raw token is never leaked in user integrations list
      assert.strictEqual(slack.accessToken, undefined);

      const credentials = await integrationService.getIntegrationCredentials(testUser.id, 'slack');
      assert.strictEqual(credentials.accessToken, 'xoxb-test-slack-token');
    });
  });

  describe('6. Real-Time Notification Layer', () => {
    test('Creates and manages in-app notifications', async () => {
      const notif = await notificationService.createNotification({
        owner: testUser.id,
        workflowId: testWorkflow._id,
        type: 'success',
        title: 'Workflow Execution Completed',
        message: 'All 3 steps finished successfully.',
      });

      assert.ok(notif._id);
      assert.strictEqual(notif.isRead, false);

      const list = await notificationService.getUserNotifications(testUser.id);
      assert.ok(list.length >= 1);

      await notificationService.markAsRead(notif._id, testUser.id);
      const updatedList = await notificationService.getUserNotifications(testUser.id);
      const readNotif = updatedList.find(n => n._id.toString() === notif._id.toString());
      assert.strictEqual(readNotif.isRead, true);
    });
  });
});
