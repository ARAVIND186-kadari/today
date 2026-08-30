import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PlayCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  PauseCircle,
  XCircle,
} from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';
import AppShell from '../../components/AppShell';
import api from '../../services/api';
import { getSocket } from '../../services/socket';

export default function ExecutionsListPage() {
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadExecutions = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 15 };
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await api.get('/executions', { params });
      setExecutions(res.data.data?.executions || []);
      setTotalPages(res.data.data?.totalPages || 1);
    } catch (e) {
      console.error('Failed to load executions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExecutions();

    const socket = getSocket();
    if (socket) {
      const handleUpdate = () => {
        loadExecutions();
      };
      socket.on('execution_update', handleUpdate);
      return () => {
        socket.off('execution_update', handleUpdate);
      };
    }
  }, [statusFilter, page]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>COMPLETED</span>
          </span>
        );
      case 'RUNNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold font-mono animate-pulse">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>RUNNING</span>
          </span>
        );
      case 'RETRYING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold font-mono">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>RETRYING</span>
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold font-mono">
            <PauseCircle className="w-3.5 h-3.5" />
            <span>PAUSED</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold font-mono">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>FAILED</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold font-mono">
            <XCircle className="w-3.5 h-3.5" />
            <span>CANCELLED</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold font-mono">
            {status}
          </span>
        );
    }
  };

  return (
    <ProtectedRoute>
      <AppShell>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Execution Audit Runs</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time audit log of all multi-agent automation runs with duration and recovery metrics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadExecutions}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Status Filter Bar */}
        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Filter Status:</span>
            {['all', 'COMPLETED', 'RUNNING', 'FAILED', 'PAUSED', 'CANCELLED'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                  statusFilter === s
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                {s === 'all' ? 'All Runs' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Table / List */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 text-xs flex flex-col items-center">
            <div className="w-6 h-6 border-2 border-cyan-500/40 border-t-cyan-500 rounded-full animate-spin mb-3" />
            <span>Streaming executions...</span>
          </div>
        ) : executions.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
            <PlayCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">No Executions Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Trigger a workflow from the Workflows page or AI Builder to inspect live agent runs.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-850/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Workflow Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Current Step</th>
                    <th className="px-6 py-4">Started At</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4 text-right">Audit Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {executions.map((exec) => (
                    <tr key={exec._id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-100">
                        <div className="flex items-center space-x-2">
                          <span>{exec.workflowId?.name || exec.workflowSnapshot?.name || 'Workflow Run'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(exec.status)}</td>
                      <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                        {exec.currentNode || 'All steps finished'}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(exec.startTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-300">
                        {exec.duration ? `${(exec.duration / 1000).toFixed(2)}s` : 'Processing...'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/executions/${exec._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <span>Live Timeline</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
