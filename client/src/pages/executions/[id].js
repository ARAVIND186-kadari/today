import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  ArrowLeft,
  Play,
  Pause,
  XCircle,
  RefreshCw,
  Clock,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Terminal,
  Activity,
  Sparkles,
} from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';
import AppShell from '../../components/AppShell';
import api from '../../services/api';
import { getSocket } from '../../services/socket';

export default function ExecutionTimelinePage() {
  const router = useRouter();
  const { id } = router.query;

  const [execution, setExecution] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async (execId) => {
    try {
      setLoading(true);
      const [execRes, timeRes] = await Promise.all([
        api.get(`/executions/${execId}`),
        api.get(`/executions/${execId}/timeline`),
      ]);
      setExecution(execRes.data.data);
      setLogs(timeRes.data.data || []);
    } catch (e) {
      console.error('Failed to load execution timeline:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData(id);

      const socket = getSocket();
      if (socket) {
        socket.emit('join_execution', id);

        const handleAgentLog = (logEntry) => {
          setLogs((prev) => [...prev, logEntry]);
        };

        const handleStatus = (data) => {
          setExecution((prev) => prev ? { ...prev, status: data.status, ...data } : null);
        };

        const handleCompleted = (data) => {
          setExecution((prev) => prev ? { ...prev, status: data.status, duration: data.duration, outputs: data.outputs } : null);
        };

        const handleFailed = (data) => {
          setExecution((prev) => prev ? { ...prev, status: 'FAILED', error: { message: data.error } } : null);
        };

        socket.on('agent_log', handleAgentLog);
        socket.on('execution_status', handleStatus);
        socket.on('execution_completed', handleCompleted);
        socket.on('execution_failed', handleFailed);

        return () => {
          socket.emit('leave_execution', id);
          socket.off('agent_log', handleAgentLog);
          socket.off('execution_status', handleStatus);
          socket.off('execution_completed', handleCompleted);
          socket.off('execution_failed', handleFailed);
        };
      }
    }
  }, [id]);

  const handlePause = async () => {
    try {
      setActionLoading(true);
      await api.post(`/executions/${id}/pause`);
      loadData(id);
    } catch (e) {
      alert('Pause failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async () => {
    try {
      setActionLoading(true);
      await api.post(`/executions/${id}/resume`);
      loadData(id);
    } catch (e) {
      alert('Resume failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Cancel this running execution?')) return;
    try {
      setActionLoading(true);
      await api.post(`/executions/${id}/cancel`);
      loadData(id);
    } catch (e) {
      alert('Cancel failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setActionLoading(false);
    }
  };

  const getAgentBadge = (agent) => {
    switch (agent) {
      case 'planner':
        return <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold uppercase font-mono">Planner Agent</span>;
      case 'execution':
        return <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-bold uppercase font-mono">Execution Agent</span>;
      case 'validation':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase font-mono">Validation Agent</span>;
      case 'recovery':
        return <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase font-mono">Recovery Agent</span>;
      case 'monitoring':
        return <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase font-mono">Monitoring Agent</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold uppercase font-mono">System</span>;
    }
  };

  const getLevelDot = (level) => {
    switch (level) {
      case 'success': return 'bg-emerald-400';
      case 'warning': return 'bg-amber-400';
      case 'error': return 'bg-rose-400';
      default: return 'bg-cyan-400';
    }
  };

  return (
    <ProtectedRoute>
      <AppShell>
        {/* Top bar with back and controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <Link
              href="/executions"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  {execution?.workflowSnapshot?.name || 'Execution Run'}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono">
                  ID: {id?.substring(0, 10)}...
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-Agent Live Execution Timeline &bull; LangGraph Substrate
              </p>
            </div>
          </div>

          {/* Action buttons (Pause, Resume, Cancel) */}
          <div className="flex items-center space-x-2">
            {execution?.status === 'RUNNING' && (
              <button
                onClick={handlePause}
                disabled={actionLoading}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
            )}

            {execution?.status === 'PAUSED' && (
              <button
                onClick={handleResume}
                disabled={actionLoading}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Resume</span>
              </button>
            )}

            {(execution?.status === 'RUNNING' || execution?.status === 'PAUSED' || execution?.status === 'RETRYING') && (
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}

            <button
              onClick={() => id && loadData(id)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Execution Summary Metadata Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Run Status</span>
            <div className="text-sm font-bold text-slate-100 mt-1 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${getLevelDot(execution?.status === 'COMPLETED' ? 'success' : execution?.status === 'FAILED' ? 'error' : 'info')}`} />
              <span>{execution?.status || 'PENDING'}</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Duration</span>
            <div className="text-sm font-bold text-slate-100 mt-1 font-mono">
              {execution?.duration ? `${(execution.duration / 1000).toFixed(2)}s` : 'In Progress...'}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Recovery Retries</span>
            <div className="text-sm font-bold text-slate-100 mt-1 font-mono">
              {execution?.retryCount ?? 0} retries
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">LangGraph Core</span>
            <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{execution?.langGraph || 'available'}</span>
            </div>
          </div>
        </div>

        {/* Live Multi-Agent Execution Timeline */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Multi-Agent Timeline Stream ({logs.length} Events)
              </h2>
            </div>
            {execution?.status === 'RUNNING' && (
              <span className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Live Socket.IO Stream
              </span>
            )}
          </div>

          {logs.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs flex flex-col items-center">
              <Activity className="w-8 h-8 opacity-30 mb-2" />
              <span>Awaiting agent execution dispatch...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log, idx) => (
                <div
                  key={log._id || log.id || idx}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700/80 transition-all font-mono text-xs space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getLevelDot(log.level)}`} />
                      {getAgentBadge(log.agent)}
                      {log.nodeId && (
                        <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {log.nodeId}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Now'}
                    </span>
                  </div>

                  <p className="text-slate-200 text-xs leading-relaxed font-sans">{log.message}</p>

                  {/* Metadata / Output Inspector if present */}
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <div className="mt-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 overflow-x-auto">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1 font-semibold">
                        Agent Payload Inspector:
                      </span>
                      <pre className="text-cyan-300 font-mono text-[10px]">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
