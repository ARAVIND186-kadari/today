import React from 'react';
import { GitFork, PlayCircle, CheckCircle2, Zap, Clock, ShieldCheck } from 'lucide-react';

export default function MetricGrid({ metrics = {} }) {
  const cards = [
    {
      title: 'Total Workflows',
      value: metrics.totalWorkflows ?? 0,
      sub: `${metrics.activeWorkflows ?? 0} currently active`,
      icon: GitFork,
      color: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
    },
    {
      title: 'Total Executions',
      value: metrics.totalExecutions ?? 0,
      sub: `${metrics.completedExecutions ?? 0} completed runs`,
      icon: PlayCircle,
      color: 'from-indigo-500/20 to-purple-500/20',
      border: 'border-indigo-500/30',
      iconColor: 'text-indigo-400',
    },
    {
      title: 'Agent Success Rate',
      value: `${metrics.successRate ?? 100}%`,
      sub: metrics.failedExecutions ? `${metrics.failedExecutions} escalated` : '100% reliability',
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Avg Run Duration',
      value: `${metrics.avgDurationMs ? (metrics.avgDurationMs / 1000).toFixed(2) : '0.00'}s`,
      sub: 'Multi-agent cycle time',
      icon: Clock,
      color: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/30',
      iconColor: 'text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`p-5 rounded-2xl bg-gradient-to-br ${c.color} bg-slate-900/60 border ${c.border} backdrop-blur shadow-lg flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{c.title}</span>
              <div className={`p-2 rounded-xl bg-slate-950/60 ${c.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-white tracking-tight">{c.value}</div>
              <div className="text-xs text-slate-400 mt-1">{c.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
