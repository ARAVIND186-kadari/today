const axios = require('axios');
const config = require('../config/env');

// System prompt to guide LLMs to return strict JSON React Flow graph structure
const SYSTEM_PROMPT = `
You are an expert AI Workflow Architect for Agentflow_AI.
Given a natural language user description of an automated process, you generate a complete visual workflow graph compatible with React Flow.
You must return valid JSON ONLY, without markdown code fences, matching this schema:
{
  "name": "Concise Workflow Title",
  "description": "Brief description of what this workflow does",
  "tags": ["tag1", "tag2"],
  "triggerConfig": {
    "type": "webhook | schedule | manual | email_trigger",
    "schedule": "0 9 * * *",
    "event": "customer.created"
  },
  "nodes": [
    {
      "id": "node_1",
      "type": "trigger | action | ai | integration",
      "position": { "x": 250, "y": 50 },
      "data": {
        "label": "Human Readable Label",
        "description": "Short explanation",
        "provider": "system | gmail | slack | discord | google-sheets | gemini | openrouter",
        "actionType": "send_email | post_message | append_row | ai_generate | transform_data | http_request",
        "config": {
          "field1": "value1"
        }
      }
    }
  ],
  "edges": [
    {
      "id": "e_1_2",
      "source": "node_1",
      "target": "node_2",
      "animated": true
    }
  ]
}
Each node must have incremented positions (e.g. y = 50, 180, 310, 440, ... with x around 250).
`;

// Deterministic rule engine fallback
const generateDeterministicWorkflow = (prompt) => {
  const p = prompt.toLowerCase();
  const nodes = [];
  const edges = [];
  let name = 'Automated Agentic Workflow';
  let description = `Generated workflow based on prompt: "${prompt}"`;
  let tags = ['automation', 'agentic'];

  let yPos = 50;
  const addNode = (id, type, label, description, provider, actionType, config = {}) => {
    nodes.push({
      id,
      type,
      position: { x: 280, y: yPos },
      data: {
        label,
        description,
        provider,
        actionType,
        config,
      },
    });
    yPos += 140;
  };

  // Node 1: Trigger
  if (p.includes('schedule') || p.includes('daily') || p.includes('every hour') || p.includes('cron')) {
    name = 'Scheduled Event Automation';
    tags.push('scheduled');
    addNode('node_1', 'trigger', 'Cron Schedule Trigger', 'Fires on configured interval', 'system', 'schedule_trigger', {
      cron: p.includes('daily') ? '0 9 * * *' : '*/15 * * * *',
    });
  } else if (p.includes('email') && (p.includes('receive') || p.includes('incoming') || p.includes('when email'))) {
    name = 'Gmail Inbox Listener Workflow';
    tags.push('email', 'gmail');
    addNode('node_1', 'trigger', 'Gmail Inbox Trigger', 'Listens for incoming messages', 'gmail', 'read_email', {
      query: 'is:unread',
    });
  } else {
    name = 'Event Webhook Automation';
    tags.push('webhook');
    addNode('node_1', 'trigger', 'Webhook / Manual Trigger', 'Initiates execution when payload arrives', 'system', 'manual', {
      eventType: 'custom_trigger',
    });
  }

  // Node 2: AI Analysis / Processing
  if (p.includes('summarize') || p.includes('classify') || p.includes('extract') || p.includes('analyze') || p.includes('sentiment') || p.includes('ai')) {
    addNode('node_2', 'ai', 'AI Intelligence Agent', 'Analyzes incoming payload and generates structured content', 'gemini', 'ai_generate', {
      systemPrompt: 'Extract key business details, sentiment, and required action items.',
      temperature: 0.2,
    });
  } else {
    addNode('node_2', 'action', 'Data Transformation Agent', 'Normalizes and filters input attributes', 'system', 'transform_data', {
      format: 'json',
      mapping: '{ "id": "{{input.id}}", "summary": "{{input.summary}}" }',
    });
  }
  edges.push({ id: 'e1_2', source: 'node_1', target: 'node_2', animated: true });

  let lastNodeId = 'node_2';
  let nodeCount = 3;

  // Node 3 / 4: Integrations (Slack, Discord, Sheets, Gmail)
  if (p.includes('slack')) {
    const nid = `node_${nodeCount++}`;
    addNode(nid, 'integration', 'Slack Channel Dispatcher', 'Posts formatted notification into #operations channel', 'slack', 'post_message', {
      channel: '#operations',
      message: '🚨 Automated Alert: {{node_2.output.summary}}',
    });
    edges.push({ id: `e_${lastNodeId}_${nid}`, source: lastNodeId, target: nid, animated: true });
    lastNodeId = nid;
    tags.push('slack');
  }

  if (p.includes('discord')) {
    const nid = `node_${nodeCount++}`;
    addNode(nid, 'integration', 'Discord Alert Bot', 'Sends rich embed notification to Discord server', 'discord', 'post_message', {
      channel: 'announcements',
      message: '📢 Notification: {{node_2.output.summary}}',
    });
    edges.push({ id: `e_${lastNodeId}_${nid}`, source: lastNodeId, target: nid, animated: true });
    lastNodeId = nid;
    tags.push('discord');
  }

  if (p.includes('sheet') || p.includes('spreadsheet') || p.includes('excel') || p.includes('record')) {
    const nid = `node_${nodeCount++}`;
    addNode(nid, 'integration', 'Google Sheets Logger', 'Appends structured event row to master audit spreadsheet', 'google-sheets', 'append_row', {
      spreadsheetId: 'ops_audit_log_v1',
      range: 'Sheet1!A:E',
    });
    edges.push({ id: `e_${lastNodeId}_${nid}`, source: lastNodeId, target: nid, animated: true });
    lastNodeId = nid;
    tags.push('google-sheets');
  }

  if (p.includes('send email') || p.includes('mail') || p.includes('gmail') || nodes.length <= 2) {
    const nid = `node_${nodeCount++}`;
    addNode(nid, 'integration', 'Gmail Dispatcher', 'Sends email report to operations team', 'gmail', 'send_email', {
      to: 'team@company.com',
      subject: 'Automated Operations Notification',
      bodyTemplate: 'Hello,\n\nThe automation workflow has completed successfully.\nDetails: {{node_2.output.summary}}\n\nRegards,\nAgentflow_AI',
    });
    edges.push({ id: `e_${lastNodeId}_${nid}`, source: lastNodeId, target: nid, animated: true });
    lastNodeId = nid;
    tags.push('gmail');
  }

  return {
    name,
    description,
    tags: Array.from(new Set(tags)),
    triggerConfig: { type: nodes[0].data.actionType === 'schedule_trigger' ? 'schedule' : 'manual' },
    nodes,
    edges,
  };
};

const generateWorkflowFromPrompt = async (prompt) => {
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    throw new Error('Prompt cannot be empty');
  }

  // 1. Try OpenRouter if configured
  if (config.openrouterApiKey) {
    try {
      console.log('[AI Service] Attempting workflow generation with OpenRouter...');
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `Generate an automated workflow graph for this prompt: "${prompt}"` },
          ],
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            Authorization: `Bearer ${config.openrouterApiKey}`,
            'HTTP-Referer': config.clientUrl,
            'X-Title': 'Agentflow_AI',
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      const content = response.data.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (parsed.nodes && parsed.edges) {
          console.log('[AI Service] Successfully generated workflow with OpenRouter.');
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[AI Service] OpenRouter generation failed, falling back to Gemini / Deterministic:', err.message);
    }
  }

  // 2. Try Google Gemini SDK if configured
  if (config.geminiApiKey) {
    try {
      console.log('[AI Service] Attempting workflow generation with Google Gemini SDK...');
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(config.geminiApiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nUser Request: ${prompt}`);
      const text = result.response.text();
      const parsed = JSON.parse(text);
      if (parsed.nodes && parsed.edges) {
        console.log('[AI Service] Successfully generated workflow with Google Gemini.');
        return parsed;
      }
    } catch (err) {
      console.warn('[AI Service] Google Gemini generation failed, falling back to Deterministic:', err.message);
    }
  }

  // 3. Fall back to Deterministic rule-based builder
  console.log('[AI Service] Using deterministic rule-based builder for workflow generation.');
  return generateDeterministicWorkflow(prompt);
};

module.exports = {
  generateWorkflowFromPrompt,
  generateDeterministicWorkflow,
};
