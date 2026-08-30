import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Play,
  Copy,
  Trash2,
  Check,
  Sparkles,
  GitFork,
  AlertCircle,
} from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';
import AppShell from '../../components/AppShell';
import WorkflowCanvas from '../../components/WorkflowCanvas';
import NodePalette from '../../components/NodePalette';
import NodeConfigPanel from '../../components/NodeConfigPanel';
import { useWorkflowStore } from '../../store/workflowStore';
import api from '../../services/api';

export default function WorkflowEditorPage() {
  const router = useRouter();
  const { id } = router.query;

  const {
    workflow,
    nodes,
    edges,
    isDirty,
    setWorkflow,
    resetDirty,
  } = useWorkflowStore();

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [workflowTitle, setWorkflowTitle] = useState('');
  const [workflowStatus, setWorkflowStatus] = useState('draft');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      loadWorkflow(id);
    }
  }, [id]);

  const loadWorkflow = async (wfId) => {
    try {
      setLoading(true);
      const res = await api.get(`/workflows/${wfId}`);
      const data = res.data.data;
      setWorkflow(data);
      setWorkflowTitle(data.name);
      setWorkflowStatus(data.status || 'draft');
    } catch (e) {
      console.error('Failed to load workflow:', e);
      alert('Error loading workflow: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      const res = await api.put(`/workflows/${id}`, {
        name: workflowTitle,
        status: workflowStatus,
        nodes,
        edges,
      });
      setWorkflow(res.data.data);
      resetDirty();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      alert('Save failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleExecute = async () => {
    if (!id) return;
    setIsExecuting(true);
    try {
      // Save before executing if dirty
      if (isDirty) {
        await api.put(`/workflows/${id}`, {
          name: workflowTitle,
          status: workflowStatus,
          nodes,
          edges,
        });
        resetDirty();
      }

      const res = await api.post(`/workflows/${id}/execute`, {
        inputs: {
          triggerTime: new Date().toISOString(),
          invokedBy: 'Operator Interactive Studio',
        },
      });

      router.push(`/executions/${res.data.data._id}`);
    } catch (e) {
      alert('Execution failed: ' + (e.response?.data?.message || e.message));
      setIsExecuting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AppShell>
          <div className="text-center py-24 text-slate-500 text-xs flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-cyan-500/40 border-t-cyan-500 rounded-full animate-spin mb-3" />
            <span>Loading workflow studio...</span>
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppShell>
        {/* Editor Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <Link
              href="/workflows"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex flex-col">
              <input
                type="text"
                value={workflowTitle}
                onChange={(e) => setWorkflowTitle(e.target.value)}
                className="bg-transparent text-base font-bold text-white tracking-tight border-b border-transparent hover:border-slate-700 focus:border-cyan-500 focus:outline-none transition-colors px-1"
              />
              <div className="flex items-center space-x-2 text-[11px] text-slate-400 px-1">
                <span>Version {workflow?.version || 1}</span>
                <span>&bull;</span>
                <span className="capitalize">{workflowStatus}</span>
                {isDirty && <span className="text-amber-400 font-semibold">&bull; Unsaved edits</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={workflowStatus}
              onChange={(e) => setWorkflowStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-850 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                saveSuccess
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-200'
              }`}
            >
              {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Graph'}</span>
            </button>

            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isExecuting ? 'Starting Run...' : 'Execute Now'}</span>
            </button>
          </div>
        </div>

        {/* 3-Column Studio Workspace: Left Palette, Center Canvas, Right Node Inspector */}
        <div className="flex gap-4 h-[calc(100vh-13.5rem)] min-h-[600px]">
          {/* Left: Node Palette */}
          <NodePalette />

          {/* Center: React Flow Canvas */}
          <div className="flex-1 h-full">
            <WorkflowCanvas readOnly={false} />
          </div>

          {/* Right: Node Configuration Inspector */}
          <NodeConfigPanel />
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
