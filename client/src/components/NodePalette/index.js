import React from 'react';
import {
  Zap,
  Sparkles,
  Mail,
  MessageSquare,
  FileSpreadsheet,
  Globe,
  Database,
  Clock,
  BellRing,
  GripVertical,
} from 'lucide-react';

const paletteItems = [
  {
    category: 'Triggers',
    items: [
      {
        type: 'trigger',
        label: 'Webhook / Manual',
        description: 'Initiates workflow on API payload or manual trigger',
        provider: 'system',
        actionType: 'manual',
        icon: Zap,
        iconColor: 'text-cyan-400',
        defaultConfig: { eventType: 'api_payload' },
      },
      {
        type: 'trigger',
        label: 'Cron Schedule',
        description: 'Fires automatically on cron schedule',
        provider: 'system',
        actionType: 'schedule_trigger',
        icon: Clock,
        iconColor: 'text-cyan-400',
        defaultConfig: { cron: '0 9 * * *' },
      },
      {
        type: 'trigger',
        label: 'Gmail Inbox Trigger',
        description: 'Listens for incoming emails',
        provider: 'gmail',
        actionType: 'read_email',
        icon: Mail,
        iconColor: 'text-rose-400',
        defaultConfig: { query: 'is:unread' },
      },
    ],
  },
  {
    category: 'AI Agents',
    items: [
      {
        type: 'ai',
        label: 'AI Reasoning Agent',
        description: 'Multi-step text generation, extraction & routing',
        provider: 'gemini',
        actionType: 'ai_generate',
        icon: Sparkles,
        iconColor: 'text-amber-400',
        defaultConfig: {
          systemPrompt: 'Extract actionable items and synthesize payload data.',
          temperature: 0.3,
        },
      },
      {
        type: 'ai',
        label: 'OpenRouter Llama-3',
        description: 'Advanced reasoning via OpenRouter cloud API',
        provider: 'openrouter',
        actionType: 'ai_generate',
        icon: Sparkles,
        iconColor: 'text-orange-400',
        defaultConfig: {
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          prompt: 'Synthesize data into structured JSON.',
        },
      },
    ],
  },
  {
    category: 'Integrations & Actions',
    items: [
      {
        type: 'integration',
        label: 'Slack Alert',
        description: 'Posts message to Slack channel',
        provider: 'slack',
        actionType: 'post_message',
        icon: MessageSquare,
        iconColor: 'text-emerald-400',
        defaultConfig: { channel: '#operations', message: 'Alert: {{node_1.output.summary}}' },
      },
      {
        type: 'integration',
        label: 'Gmail Dispatcher',
        description: 'Sends email report to recipient',
        provider: 'gmail',
        actionType: 'send_email',
        icon: Mail,
        iconColor: 'text-rose-400',
        defaultConfig: { to: 'team@company.com', subject: 'Automated Alert', body: 'Report payload: {{input}}' },
      },
      {
        type: 'integration',
        label: 'Google Sheets Logger',
        description: 'Appends data row to spreadsheet',
        provider: 'google-sheets',
        actionType: 'append_row',
        icon: FileSpreadsheet,
        iconColor: 'text-emerald-500',
        defaultConfig: { spreadsheetId: 'master_audit_log', range: 'Sheet1!A:E' },
      },
      {
        type: 'integration',
        label: 'Discord Alert Bot',
        description: 'Broadcasts message to Discord channel',
        provider: 'discord',
        actionType: 'post_message',
        icon: BellRing,
        iconColor: 'text-indigo-400',
        defaultConfig: { channel: 'general', message: 'Discord alert: {{input.event}}' },
      },
      {
        type: 'action',
        label: 'Data Transform',
        description: 'Maps, parses, and filters JSON data',
        provider: 'system',
        actionType: 'transform_data',
        icon: Database,
        iconColor: 'text-purple-400',
        defaultConfig: { mapping: '{\n  "id": "{{input.id}}",\n  "status": "PROCESSED"\n}' },
      },
      {
        type: 'action',
        label: 'HTTP Dispatcher',
        description: 'Dispatches custom REST webhook request',
        provider: 'system',
        actionType: 'http_request',
        icon: Globe,
        iconColor: 'text-cyan-400',
        defaultConfig: { url: 'https://api.external.com/v1/webhook', method: 'POST' },
      },
    ],
  },
];

export default function NodePalette() {
  const onDragStart = (event, nodeData) => {
    event.dataTransfer.setData('application/agentflow-node', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-72 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col h-full overflow-y-auto shrink-0 shadow-xl backdrop-blur">
      <div className="mb-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Node Palette</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Drag any node directly onto the canvas</p>
      </div>

      <div className="space-y-5">
        {paletteItems.map((cat, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
              {cat.category}
            </h4>
            <div className="space-y-1.5">
              {cat.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={itemIdx}
                    draggable
                    onDragStart={(e) => onDragStart(e, item)}
                    className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/50 transition-all cursor-grab active:cursor-grabbing flex items-center space-x-3 group shadow-sm"
                  >
                    <GripVertical className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 shrink-0" />
                    <div className={`p-1.5 rounded-lg bg-slate-900 ${item.iconColor} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-200 truncate">{item.label}</div>
                      <div className="text-[10px] text-slate-400 truncate">{item.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
