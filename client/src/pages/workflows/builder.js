import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Sparkles,
  ArrowRight,
  Save,
  Play,
  RotateCcw,
  Bot,
  Lightbulb,
  CheckCircle2,
  Wand2,
} from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';
import AppShell from '../../components/AppShell';
import WorkflowCanvas from '../../components/WorkflowCanvas';
import { useWorkflowStore } from '../../store/workflowStore';
import api from '../../services/api';

const examplePrompts = [
  'When a high-priority customer invoice is received, summarize it with AI, send an email to the finance team, and alert #operations in Slack.',
  'Daily at 9 AM, scan Gmail for unread order updates, append rows to Google Sheets, and broadcast summary to Discord channel.',
  'Analyze incoming user feedback sentiment with AI, post urgent issues to Slack, and log the event in Google Sheets.',
  'Listen on webhook for user signups, transform payload into normalized JSON, and dispatch an HTTP notification.',
];

export default function WorkflowBuilderPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState(null);
  const [workflowTitle, setWorkflowTitle] = useState('');
  const [workflowDesc, setWorkflowDesc] = useState('');

  const { setWorkflow, nodes, edges } = useWorkflowStore();
  const router = useRouter();

  const handleGenerate = async (selectedPrompt) => {
    const textToUse = selectedPrompt || prompt;
    if (!textToUse || textToUse.trim() === '') return;

    setIsGenerating(true);
    try {
      const res = await api.post('/workflows/generate', { prompt: textToUse });
      const data = res.data.data;

      setGeneratedWorkflow(data);
      setWorkflowTitle(data.name || 'AI Synthesized Automation');
      setWorkflowDesc(data.description || textToUse);

      // Populate canvas store
      setWorkflow({
        name: data.name,
        description: data.description,
        nodes: data.nodes || [],
        edges: data.edges || [],
        tags: data.tags || ['ai-generated'],
      });
    } catch (e) {
      alert('Generation error: ' + (e.response?.data?.message || e.message));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAndOpen = async () => {
    if (nodes.length === 0) {
      alert('Generate or construct a workflow first before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await api.post('/workflows', {
        name: workflowTitle || 'AI Synthesized Automation',
        description: workflowDesc || prompt,
        status: 'active',
        nodes,
        edges,
        tags: generatedWorkflow?.tags || ['ai-generated'],
        triggerConfig: generatedWorkflow?.triggerConfig || { type: 'manual' },
      });

      router.push(`/workflows/${res.data.data._id}`);
    } catch (e) {
      alert('Save error: ' + e.message);
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppShell>
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Prompt-to-Graph Generation Engine</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Workflow Builder</h1>
          </div>

          {nodes.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleGenerate(prompt)}
                disabled={isGenerating}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>

              <button
                onClick={handleSaveAndOpen}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save & Open Canvas'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Prompt Input Panel */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Describe the Automation You Want to Build</span>
            </label>
            <span className="text-[11px] text-slate-400">
              OpenRouter &bull; Gemini SDK &bull; Rule Fallback
            </span>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., When an urgent lead email arrives, analyze company domain, post summary to #sales Slack, and append contact details to Google Sheets..."
              className="w-full p-4 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none shadow-inner"
            />
          </div>

          {/* Preset Prompts */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-400">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Prompt Templates:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(ex);
                    handleGenerate(ex);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/40 text-[11px] text-slate-300 text-left transition-all"
                >
                  &ldquo;{ex.substring(0, 55)}...&rdquo;
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleGenerate(prompt)}
              disabled={isGenerating || !prompt.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>Synthesizing Graph...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Workflow Graph</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Graph Preview Panel */}
        {nodes.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Generated Workflow Graph Preview ({nodes.length} Nodes, {edges.length} Edges)
                </h3>
              </div>
            </div>

            <div className="h-[520px]">
              <WorkflowCanvas readOnly={false} />
            </div>
          </div>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
