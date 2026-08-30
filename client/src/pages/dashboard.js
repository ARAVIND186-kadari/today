import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  GitFork,
  PlayCircle,
  Activity,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
} from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import AppShell from '../components/AppShell';
import MetricGrid from '../components/MetricGrid';
import api from '../services/api';
import { getSocket } from '../services/socket';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({});
  const [workflows, setWorkflows] = useState([]);
  const [recentExecutions, setRecentExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedLogs, setFeedLogs] = useState([]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, wfRes] = await Promise.all([
        api.get('/workflows/dashboard'),
        api.get('/workflows?limit=5'),
      ]);

      setMetrics(dashRes.data.data || {});
      setRecentExecutions(dashRes.data.data?.recentExecutions || []);
      setWorkflows(wfRes.data.data?.workflows || []);
    } catch (e) {
      console.error('Failed to load dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Socket live stream for executions and agent logs
    const socket = getSocket();
    if (socket) {
      const handleExecutionUpdate = (data) => {
        setFeedLogs((prev) => [
          {
            id: `feed_${Date.now()}_${Math.random()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            message: `Execution ${data.executionId ? data.executionId.substring(0, 8) : 'event'}: ${data.eventName || 'status update'}`,
            level: data.level || 'info',
          },
          ...prev.slice(0, 15),
        ]);
        // Refresh metrics periodically on events
        api.get('/workflows/dashboard').then((res) => {
          setMetrics(res.data.data || {});
          setRecentExecutions(res.data.data?.recentExecutions || []);
        });
      };

      socket.on('execution_update', handleExecutionUpdate);
      return () => {
        socket.off('execution_update', handleExecutionUpdate);
      };
    }
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">COMPLETED</span>;
      case 'RUNNING':
        return <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold animate-pulse">RUNNING</span>;
      case 'FAILED':
        return <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">FAILED</span>;
      case 'PAUSED':
        return <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">PAUSED</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold">{status}</span>;
    }
  };

  return (
    <ProtectedRoute>
      <AppShell>
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Operator Command Center</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Live multi-agent automation orchestration metrics and real-time feeds
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardData}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              href="/workflows/builder"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Prompt Builder</span>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <MetricGrid metrics={metrics} />

        {/* Two-column layout: Active Workflows + Live AI Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Executions (2 cols) */}
          <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <PlayCircle className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Recent Executions</h3>
              </div>
              <Link
                href="/executions"
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>View All Runs</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentExecutions.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No execution history yet. Launch a workflow run to monitor agent telemetry.
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {recentExecutions.map((exec) => (
                  <div key={exec._id} className="py-3.5 flex items-center justify-between hover:bg-slate-850/40 px-2 rounded-xl transition-colors">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                        <Activity className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-200 truncate">
                          {exec.workflowId?.name || 'Automated Workflow Run'}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{new Date(exec.startTime).toLocaleString()}</span>
                          <span>&bull;</span>
                          <span>{exec.duration ? `${(exec.duration / 1000).toFixed(2)}s` : '< 1s'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      {getStatusBadge(exec.status)}
                      <Link
                        href={`/executions/${exec._id}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition-colors"
                      >
                        Timeline &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Agent Telemetry Feed (1 col) */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Live Agent Telemetry</h3>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  Socket.IO Active
                </span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {feedLogs.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-500 text-center">
                    Awaiting next agent execution event...
                  </div>
                ) : (
                  feedLogs.map((f) => (
                    <div
                      key={f.id}
                      className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono text-slate-300"
                    >
                      <span className="text-slate-500 text-[10px]">[{f.time}]</span> {f.message}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <Link
                href="/workflows"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <GitFork className="w-3.5 h-3.5 text-cyan-400" />
                <span>Manage All Workflows</span>
              </Link>
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
