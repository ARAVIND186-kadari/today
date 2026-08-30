import React from 'react';
import { X, Trash2, Sliders, CheckCircle2, Info } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

export default function NodeConfigPanel() {
  const { selectedNode, updateNodeData, deleteNode, setSelectedNode } = useWorkflowStore();

  if (!selectedNode) {
    return (
      <div className="w-80 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center text-slate-500 h-full">
        <Sliders className="w-8 h-8 mb-2 opacity-30" />
        <p className="text-xs font-medium">No Node Selected</p>
        <p className="text-[11px] text-slate-600 mt-1">
          Click any node on the canvas to configure its agent properties and parameters.
        </p>
      </div>
    );
  }

  const { id, type, data = {} } = selectedNode;
  const config = data.config || {};

  const handleConfigChange = (key, value) => {
    updateNodeData(id, {
      config: {
        ...config,
        [key]: value,
      },
    });
  };

  const handleMetaChange = (field, value) => {
    updateNodeData(id, { [field]: value });
  };

  return (
    <div className="w-80 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col h-full overflow-y-auto shrink-0 shadow-2xl backdrop-blur">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Node Inspector</h3>
        </div>
        <button
          onClick={() => setSelectedNode(null)}
          className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 space-y-4 flex-1">
        {/* Node ID & Type */}
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] space-y-1">
          <div className="flex justify-between text-slate-400">
            <span>Node ID:</span>
            <span className="font-mono text-cyan-400">{id}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Type / Provider:</span>
            <span className="font-mono text-slate-200 capitalize">{data.provider || type}</span>
          </div>
        </div>

        {/* Label */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-300">Node Label</label>
          <input
            type="text"
            value={data.label || ''}
            onChange={(e) => handleMetaChange('label', e.target.value)}
            className="w-full px-3 py-2 bg-slate-850 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-300">Description</label>
          <textarea
            rows={2}
            value={data.description || ''}
            onChange={(e) => handleMetaChange('description', e.target.value)}
            className="w-full px-3 py-2 bg-slate-850 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>

        {/* Dynamic Provider Configs */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Agent Parameters</h4>

          {/* GMAIL CONFIG */}
          {data.provider === 'gmail' && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">Recipient (To)</label>
                <input
                  type="text"
                  value={config.to || ''}
                  onChange={(e) => handleConfigChange('to', e.target.value)}
                  placeholder="e.g. operator@company.com"
                  className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">Email Subject</label>
                <input
                  type="text"
                  value={config.subject || ''}
                  onChange={(e) => handleConfigChange('subject', e.target.value)}
                  placeholder="Automated Alert"
                  className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">Body Template</label>
                <textarea
                  rows={3}
                  value={config.body || config.bodyTemplate || ''}
                  onChange={(e) => handleConfigChange('body', e.target.value)}
                  placeholder="Payload: {{node_1.output}}"
                  className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700/80 rounded-lg text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </>
          )}

          {/* SLACK CONFIG */}
          {data.provider === 'slack' && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">Slack Channel</label>
                <input
                  type="text"
                  value={config.channel || ''}
                  onChange={(e) => handleConfigChange('channel', e.target.value)}
                  placeholder="#operations"
                  className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">Message Text</label>
                <textarea
                  rows={3}
                  value={config.message || ''}
                  onChange={(e) => handleConfigChange('message', e.target.value)}
                  placeholder="Alert: {{node_2.output.summary}}"
                  className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700/80 rounded-lg text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </>
          )}

          {/* DISCORD CONFIG */}
          {data.provider === 'discord' && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">Channel / Hook</label>
                <input
                  type="text"
                  value={config.channel || ''}
                  onChange={(e) => handleConfigChange('channel', e.target.value)}
                  placeholder="general"
                  className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">Message</label>
                <textarea
                  rows={3}
                  value={config.message || ''}
                  onChange={(e) => handleConfigChange('message', e.target.value)}
                  placeholder="📢 {{input.event}}"
                  className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700/80 rounded-lg text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </>
          )}

          {/* GOOGLE SHEETS CONFIG */}
          {data.provider === 'google-sheets' && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">Spreadsheet ID</label>
                <input
                  type="text"
                  value={config.spreadsheetId || ''}
                  onChange={(e) => handleConfigChange('spreadsheetId', e.target.value)}
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">Target Range</label>
                <input
                  type="text"
                  value={config.range || ''}
                  onChange={(e) => handleConfigChange('range', e.target.value)}
                  placeholder="Sheet1!A:E"
                  className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </>
          )}

          {/* AI NODE CONFIG */}
          {(type === 'ai' || data.provider === 'gemini' || data.provider === 'openrouter') && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">System Instruction / Prompt</label>
                <textarea
                  rows={4}
                  value={config.systemPrompt || config.prompt || ''}
                  onChange={(e) => handleConfigChange('systemPrompt', e.target.value)}
                  placeholder="Extract key entities and classify action items."
                  className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">Temperature (0.0 - 1.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={config.temperature ?? 0.2}
                  onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </>
          )}

          {/* DATA TRANSFORM CONFIG */}
          {data.actionType === 'transform_data' && (
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300">JSON Mapping Structure</label>
              <textarea
                rows={4}
                value={config.mapping || ''}
                onChange={(e) => handleConfigChange('mapping', e.target.value)}
                placeholder='{ "id": "{{input.id}}" }'
                className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700/80 rounded-lg text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>
          )}

          {/* HTTP DISPATCHER CONFIG */}
          {data.actionType === 'http_request' && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">Webhook URL</label>
                <input
                  type="text"
                  value={config.url || ''}
                  onChange={(e) => handleConfigChange('url', e.target.value)}
                  placeholder="https://api.domain.com/endpoint"
                  className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">HTTP Method</label>
                <select
                  value={config.method || 'POST'}
                  onChange={(e) => handleConfigChange('method', e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                  <option value="PUT">PUT</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer / Delete */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={() => deleteNode(id)}
          className="w-full py-2 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Node</span>
        </button>
      </div>
    </div>
  );
}
