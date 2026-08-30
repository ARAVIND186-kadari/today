import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Bot,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  ArrowRight,
  GitFork,
  CheckCircle2,
  RefreshCw,
  Activity,
  Layers,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation */}
      <header className="h-20 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-lg sticky top-0 z-50 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Agentflow<span className="text-cyan-400">_AI</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-1.5"
          >
            <span>Launch Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 sm:px-12 pt-20 pb-28 flex flex-col items-center text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Multi-Agent Operations Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-[1.15]">
          Turn Natural Language Into <br />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            Executable Agentic Workflows
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Describe any enterprise automation in plain English. Watch our AI synthesize a visual graph on the React Flow canvas, then execute it with cooperating agents—complete with live streaming and auto-recovery.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 font-semibold text-sm transition-all"
          >
            Operator Sign In &rarr;
          </Link>
        </div>

        {/* Multi-Agent Orchestration Chain Showcase */}
        <div className="mt-20 w-full p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-2xl backdrop-blur">
          <div className="text-left mb-6">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Autonomous Cooperative Agent Architecture
            </h2>
            <p className="text-sm text-slate-300 font-medium mt-1">
              Every workflow executes through a strict 5-agent verification and monitoring pipeline:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              {
                agent: 'Planner Agent',
                desc: 'Topological sort, cycle detection & confidence scoring',
                color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30',
              },
              {
                agent: 'Execution Agent',
                desc: 'Dispatches actions to Gmail, Slack, Sheets & LLMs',
                color: 'text-purple-400 border-purple-500/30 bg-purple-950/30',
              },
              {
                agent: 'Validation Agent',
                desc: 'Enforces strict output schemas and data integrity',
                color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30',
              },
              {
                agent: 'Recovery Agent',
                desc: 'Classifies failure modes & executes backoff retries',
                color: 'text-amber-400 border-amber-500/30 bg-amber-950/30',
              },
              {
                agent: 'Monitoring Agent',
                desc: 'Streams real-time Socket.IO telemetry & audits',
                color: 'text-blue-400 border-blue-500/30 bg-blue-950/30',
              },
            ].map((a, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border ${a.color} text-left flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">0{i + 1}</span>
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                </div>
                <h3 className="text-xs font-bold text-slate-100">{a.agent}</h3>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-8 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>Agentflow_AI &bull; Built with Next.js, Express, React Flow & LangGraph</div>
        <div className="flex items-center space-x-6">
          <Link href="/login" className="hover:text-slate-300">Operator Login</Link>
          <Link href="/register" className="hover:text-slate-300">Registration</Link>
        </div>
      </footer>
    </div>
  );
}
