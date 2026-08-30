import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  GitFork,
  Sparkles,
  Plus,
  Play,
  Copy,
  Trash2,
  Search,
  SlidersHorizontal,
  ExternalLink,
  Tag,
  AlertCircle,
  Clock,
} from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';
import AppShell from '../../components/AppShell';
import api from '../../services/api';

export default function WorkflowsListPage() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [executingId, setExecutingId] = useState(null);
  const router = useRouter();

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await api.get('/workflows', { params });
      setWorkflows(res.data.data?.workflows || []);
    } catch (e) {
      console.error('Failed to fetch workflows:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadWorkflows();
  };

  const handleCreateManual = async () => {
    try {
      const res = await api.post('/workflows', {
        name: 'New Custom Workflow',
        description: 'Visual workflow created on React Flow canvas',
        status: 'draft',
        nodes: [
          {
            id: 'node_1',
            type: 'trigger',
            position: { x: 280, y: 50 },
            data: { label: 'Webhook Trigger', provider: 'system', actionType: 'manual', config: {} },
          },
          {
            id: 'node_2',
            type: 'ai',
            position: { x: 280, y: 190 },
            data: { label: 'AI Agent Step', provider: 'gemini', actionType: 'ai_generate', config: { systemPrompt: 'Analyze data' } },
          },
        ],
        edges: [{ id: 'e1_2', source: 'node_1', target: 'node_2', animated: true }],
      });
      router.push(`/workflows/${res.data.data._id}`);
    } catch (e) {
      alert('Failed to create workflow: ' + e.message);
    }
  };

  const handleDuplicate = async (id, e) => {
    e.stopPropagation();
    try {
      await api.post(`/workflows/${id}/duplicate`);
      loadWorkflows();
    } catch (err) {
      alert('Failed to duplicate: ' + err.message);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this workflow?')) return;
    try {
      await api.delete(`/workflows/${id}`);
      loadWorkflows();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleExecute = async (id, e) => {
    e.stopPropagation();
    try {
      setExecutingId(id);
      const res = await api.post(`/workflows/${id}/execute`, {
        inputs: { triggerSource: 'operator_manual_click', timestamp: new Date().toISOString() },
      });
      router.push(`/executions/${res.data.data._id}`);
    } catch (err) {
      alert('Execution failed: ' + err.message);
      setExecutingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <AppShell>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Automated Workflows</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Design, test, and trigger visual agentic orchestration pipelines
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateManual}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Blank Canvas</span>
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

        {/* Filter / Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workflows by title or tag..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-850 border border-slate-700/60 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-850 border border-slate-700/60 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>

        {/* Grid of Workflows */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 text-xs flex flex-col items-center">
            <div className="w-6 h-6 border-2 border-cyan-500/40 border-t-cyan-500 rounded-full animate-spin mb-3" />
            <span>Loading workflows...</span>
          </div>
        ) : workflows.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
            <GitFork className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">No Workflows Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven&apos;t created any workflows yet. Use the AI Prompt Builder or Blank Canvas to start.
            </p>
            <div className="mt-5">
              <Link
                href="/workflows/builder"
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate with AI</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {workflows.map((wf) => (
              <div
                key={wf._id}
                onClick={() => router.push(`/workflows/${wf._id}`)}
                className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer shadow-lg group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase font-mono">
                      v{wf.version || 1} &bull; {wf.status || 'draft'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {wf.nodes?.length || 0} nodes
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {wf.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {wf.description || 'No description provided.'}
                  </p>

                  {/* Tags */}
                  {wf.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {wf.tags.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions bottom bar */}
                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={(e) => handleExecute(wf._id, e)}
                    disabled={executingId === wf._id}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{executingId === wf._id ? 'Starting...' : 'Execute'}</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => handleDuplicate(wf._id, e)}
                      title="Duplicate"
                      className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(wf._id, e)}
                      title="Delete"
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
