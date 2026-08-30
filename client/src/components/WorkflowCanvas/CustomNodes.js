import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Zap,
  Sparkles,
  Mail,
  MessageSquare,
  FileSpreadsheet,
  Cpu,
  Globe,
  Database,
  ArrowRightCircle,
  BellRing,
} from 'lucide-react';

const getProviderIcon = (provider, actionType) => {
  switch (provider) {
    case 'gmail':
      return <Mail className="w-4 h-4 text-rose-400" />;
    case 'slack':
      return <MessageSquare className="w-4 h-4 text-emerald-400" />;
    case 'discord':
      return <BellRing className="w-4 h-4 text-indigo-400" />;
    case 'google-sheets':
      return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
    case 'gemini':
    case 'openrouter':
      return <Sparkles className="w-4 h-4 text-amber-400" />;
    default:
      if (actionType === 'http_request') return <Globe className="w-4 h-4 text-cyan-400" />;
      if (actionType === 'transform_data') return <Database className="w-4 h-4 text-purple-400" />;
      return <Zap className="w-4 h-4 text-cyan-400" />;
  }
};

export const TriggerNode = memo(({ data, selected }) => {
  return (
    <div
      className={`px-4 py-3 rounded-xl min-w-[220px] bg-slate-900 border-2 transition-all shadow-xl ${
        selected ? 'border-cyan-400 ring-2 ring-cyan-500/30' : 'border-cyan-500/40 hover:border-cyan-400/80'
      }`}
    >
      <div className="flex items-center space-x-2.5 mb-1.5">
        <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
          {getProviderIcon(data.provider, data.actionType)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-100 truncate">{data.label || 'Trigger'}</div>
          <div className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider">Trigger Node</div>
        </div>
      </div>
      {data.description && (
        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{data.description}</p>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-cyan-400 !w-3 !h-3 !border-2 !border-slate-900"
      />
    </div>
  );
});

export const ActionNode = memo(({ data, selected }) => {
  return (
    <div
      className={`px-4 py-3 rounded-xl min-w-[220px] bg-slate-900 border-2 transition-all shadow-xl ${
        selected ? 'border-purple-400 ring-2 ring-purple-500/30' : 'border-purple-500/40 hover:border-purple-400/80'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-purple-400 !w-3 !h-3 !border-2 !border-slate-900"
      />
      <div className="flex items-center space-x-2.5 mb-1.5">
        <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
          {getProviderIcon(data.provider, data.actionType)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-100 truncate">{data.label || 'Action'}</div>
          <div className="text-[10px] text-purple-400 font-mono uppercase tracking-wider">Data Transform</div>
        </div>
      </div>
      {data.description && (
        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{data.description}</p>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-purple-400 !w-3 !h-3 !border-2 !border-slate-900"
      />
    </div>
  );
});

export const AiNode = memo(({ data, selected }) => {
  return (
    <div
      className={`px-4 py-3 rounded-xl min-w-[220px] bg-slate-900 border-2 transition-all shadow-xl ${
        selected ? 'border-amber-400 ring-2 ring-amber-500/30' : 'border-amber-500/40 hover:border-amber-400/80'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-amber-400 !w-3 !h-3 !border-2 !border-slate-900"
      />
      <div className="flex items-center space-x-2.5 mb-1.5">
        <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-100 truncate">{data.label || 'AI Agent'}</div>
          <div className="text-[10px] text-amber-400 font-mono uppercase tracking-wider">
            {data.provider === 'openrouter' ? 'OpenRouter LLM' : 'Gemini 1.5 Flash'}
          </div>
        </div>
      </div>
      {data.description && (
        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{data.description}</p>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-amber-400 !w-3 !h-3 !border-2 !border-slate-900"
      />
    </div>
  );
});

export const IntegrationNode = memo(({ data, selected }) => {
  return (
    <div
      className={`px-4 py-3 rounded-xl min-w-[220px] bg-slate-900 border-2 transition-all shadow-xl ${
        selected ? 'border-emerald-400 ring-2 ring-emerald-500/30' : 'border-emerald-500/40 hover:border-emerald-400/80'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-emerald-400 !w-3 !h-3 !border-2 !border-slate-900"
      />
      <div className="flex items-center space-x-2.5 mb-1.5">
        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          {getProviderIcon(data.provider, data.actionType)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-100 truncate">{data.label || 'Integration'}</div>
          <div className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">
            {data.provider || 'Integration'} Action
          </div>
        </div>
      </div>
      {data.description && (
        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{data.description}</p>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-emerald-400 !w-3 !h-3 !border-2 !border-slate-900"
      />
    </div>
  );
});

export const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  ai: AiNode,
  integration: IntegrationNode,
};
