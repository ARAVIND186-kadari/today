import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Share2,
  Mail,
  MessageSquare,
  FileSpreadsheet,
  BellRing,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Key,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  PowerOff,
  Settings2,
} from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import AppShell from '../components/AppShell';
import api from '../services/api';

const providersInfo = [
  {
    provider: 'gmail',
    name: 'Gmail & Google Workspace',
    description: 'Send emails, listen for new inbox messages, and manage operational email threads.',
    icon: Mail,
    iconColor: 'text-rose-400',
    color: 'from-rose-500/10 to-red-500/5',
    border: 'border-rose-500/30',
  },
  {
    provider: 'slack',
    name: 'Slack Workspaces',
    description: 'Post automated notifications, query channel lists, and trigger agent interactions in Slack.',
    icon: MessageSquare,
    iconColor: 'text-emerald-400',
    color: 'from-emerald-500/10 to-teal-500/5',
    border: 'border-emerald-500/30',
  },
  {
    provider: 'google-sheets',
    name: 'Google Sheets',
    description: 'Append automated run logs, sync lead records, and query tabular data in real time.',
    icon: FileSpreadsheet,
    iconColor: 'text-emerald-500',
    color: 'from-teal-500/10 to-emerald-500/5',
    border: 'border-teal-500/30',
  },
  {
    provider: 'discord',
    name: 'Discord Bot & Webhooks',
    description: 'Send automated alerts to Discord channels and broadcast agent execution updates.',
    icon: BellRing,
    iconColor: 'text-indigo-400',
    color: 'from-indigo-500/10 to-blue-500/5',
    border: 'border-indigo-500/30',
  },
  {
    provider: 'openrouter',
    name: 'OpenRouter AI Models',
    description: 'Cloud LLM intelligence provider with support for Llama 3.3, Claude, and GPT-4o.',
    icon: Sparkles,
    iconColor: 'text-amber-400',
    color: 'from-amber-500/10 to-orange-500/5',
    border: 'border-amber-500/30',
  },
  {
    provider: 'gemini',
    name: 'Google Gemini Pro & Flash',
    description: 'High-speed structured output generation, extraction, and automated reasoning.',
    icon: Sparkles,
    iconColor: 'text-cyan-400',
    color: 'from-cyan-500/10 to-blue-500/5',
    border: 'border-cyan-500/30',
  },
];

export default function IntegrationsPage() {
  const router = useRouter();
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProvider, setModalProvider] = useState(null);
  const [manualToken, setManualToken] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [extraInput, setExtraInput] = useState('');
  const [savingManual, setSavingManual] = useState(false);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/integrations');
      setIntegrations(res.data.data || []);
    } catch (e) {
      console.error('Failed to load integrations:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  const handleStartOAuth = (provider) => {
    // In production or demo, trigger OAuth or simulated connection
    window.location.href = `/api/integrations/oauth/${provider}/start`;
  };

  const handleDisconnect = async (provider) => {
    if (!confirm(`Disconnect ${provider} integration?`)) return;
    try {
      await api.delete(`/integrations/${provider}`);
      loadIntegrations();
    } catch (e) {
      alert('Failed to disconnect: ' + e.message);
    }
  };

  const handleSaveManual = async (e) => {
    e.preventDefault();
    if (!modalProvider) return;
    setSavingManual(true);
    try {
      await api.post('/integrations', {
        provider: modalProvider,
        accessToken: manualToken || `token_${modalProvider}_${Date.now()}`,
        accountEmail: accountEmail || `operator@${modalProvider}.org`,
        extraConfig: extraInput ? { webhookUrl: extraInput } : {},
      });
      setModalProvider(null);
      setManualToken('');
      setAccountEmail('');
      setExtraInput('');
      loadIntegrations();
    } catch (e) {
      alert('Save failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setSavingManual(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppShell>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3 h-3" />
              <span>AES-256 Encrypted Credential Vault</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Third-Party Integrations</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Securely connect Gmail, Slack, Google Sheets, Discord, and AI providers
            </p>
          </div>

          <button
            onClick={loadIntegrations}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Check Health</span>
          </button>
        </div>

        {/* Security Alert Banner */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/30 flex items-center gap-3">
          <Key className="w-5 h-5 text-cyan-400 shrink-0" />
          <p className="text-xs text-slate-300">
            All OAuth tokens and API secrets are encrypted at rest using an AES-256-GCM application key. Missing or expired credentials trigger explicit <code className="text-cyan-400 font-mono">AUTH_EXPIRED</code> handling in the Recovery Agent.
          </p>
        </div>

        {/* Provider Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {providersInfo.map((p) => {
            const Icon = p.icon;
            const existing = integrations.find((i) => i.provider === p.provider);
            const isConnected = existing?.isConnected;

            return (
              <div
                key={p.provider}
                className={`p-6 rounded-3xl bg-gradient-to-br ${p.color} bg-slate-900/80 border ${p.border} shadow-xl backdrop-blur flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-2xl bg-slate-950/70 ${p.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {isConnected ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold font-mono">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Connected</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold font-mono">
                        Disconnected
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-100">{p.name}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{p.description}</p>

                  {isConnected && existing?.accountEmail && (
                    <div className="mt-3 p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-300 truncate">
                      {existing.accountEmail}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {isConnected ? (
                    <>
                      <button
                        onClick={() => handleDisconnect(p.provider)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <PowerOff className="w-3.5 h-3.5" />
                        <span>Disconnect</span>
                      </button>

                      <button
                        onClick={() => setModalProvider(p.provider)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                      >
                        Settings
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleStartOAuth(p.provider)}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition-all"
                      >
                        <span>Connect OAuth</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setModalProvider(p.provider)}
                        title="Manual Setup"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        <Settings2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for manual credential configuration */}
        {modalProvider && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Configure {modalProvider.toUpperCase()} Credentials
                </h3>
                <button
                  onClick={() => setModalProvider(null)}
                  className="text-slate-400 hover:text-white text-xs font-mono"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveManual} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Account Email / Identifier</label>
                  <input
                    type="text"
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                    placeholder="e.g. operator@company.com"
                    className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">API Key / Access Token</label>
                  <input
                    type="password"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    placeholder="Enter access token or leave blank for sandbox mock"
                    className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {modalProvider === 'discord' && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Discord Webhook URL (Optional)</label>
                    <input
                      type="text"
                      value={extraInput}
                      onChange={(e) => setExtraInput(e.target.value)}
                      placeholder="https://discord.com/api/webhooks/..."
                      className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalProvider(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingManual}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold text-xs"
                  >
                    {savingManual ? 'Saving...' : 'Save & Encrypt'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
