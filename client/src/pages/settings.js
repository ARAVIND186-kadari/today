import React, { useEffect, useState } from 'react';
import {
  User,
  Shield,
  Key,
  CheckCircle2,
  Lock,
  Cpu,
  Moon,
  Activity,
  Server,
  RefreshCw,
} from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import AppShell from '../components/AppShell';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [health, setHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);

  const checkHealth = async () => {
    try {
      setLoadingHealth(true);
      const res = await api.get('/health');
      setHealth(res.data);
    } catch (e) {
      setHealth({ status: 'unhealthy', error: e.message });
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <ProtectedRoute>
      <AppShell>
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Settings & Security</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operator profile configuration, cryptographic keys, and system diagnostics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Profile & Security Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Operator Profile Card */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <User className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Operator Profile</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400">Operator Name</label>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-semibold text-slate-200">
                    {user?.name || 'Operator'}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Registered Email</label>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-slate-200">
                    {user?.email || 'operator@company.com'}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Assigned Role</label>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-cyan-400 capitalize">
                    {user?.role || 'operator'}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Account ID</label>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-slate-400">
                    {user?.id || 'usr_2026_demo'}
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptographic Security Controls */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Security Controls & Vault</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center space-x-3">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-slate-200">Application Encryption Key</div>
                      <div className="text-[11px] text-slate-400 font-mono">AES-256-GCM Credential Vault</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold font-mono">
                    ACTIVE
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-semibold text-slate-200">Password Hashing Subsystem</div>
                      <div className="text-[11px] text-slate-400 font-mono">bcryptjs (Cost factor: 12)</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold font-mono">
                    ENFORCED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Backend System Diagnostics */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Server className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">System Health</h3>
                </div>
                <button
                  onClick={checkHealth}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingHealth ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Backend API Status:</span>
                  <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {health?.status || 'healthy'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">LangGraph Substrate:</span>
                  <span className="font-mono text-cyan-400 font-semibold">{health?.langGraph || 'available'}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Socket.IO Server:</span>
                  <span className="font-mono text-emerald-400 font-semibold">Online (Port 5000)</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Database Engine:</span>
                  <span className="font-mono text-slate-200 font-semibold">MongoDB / Memory Fallback</span>
                </div>
              </div>
            </div>

            {/* Theme / Appearance Info */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
                <Moon className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Console Appearance</h3>
              </div>
              <p className="text-xs text-slate-400">
                Operator console is styled in dark theme with high-contrast accent highlights optimized for operational workflow monitoring.
              </p>
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
