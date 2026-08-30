import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  GitFork,
  Sparkles,
  PlayCircle,
  Share2,
  Settings,
  HelpCircle,
  Cpu,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Workflows', href: '/workflows', icon: GitFork },
  { name: 'AI Builder', href: '/workflows/builder', icon: Sparkles, badge: 'AI' },
  { name: 'Executions', href: '/executions', icon: PlayCircle },
  { name: 'Integrations', href: '/integrations', icon: Share2 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const router = useRouter();

  const isActive = (href) => {
    if (href === '/workflows' && router.pathname.startsWith('/workflows') && router.pathname !== '/workflows/builder') {
      return true;
    }
    return router.pathname === href;
  };

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur flex flex-col justify-between p-4 shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Navigation Links */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Automation Hub
        </div>

        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                active
                  ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer System Box */}
      <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2 text-slate-300">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold">Agentic Core Chain</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Planner &bull; Execution &bull; Validation &bull; Recovery &bull; Monitoring
        </p>
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
          <span>MongoDB Memory: Active</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
      </div>
    </aside>
  );
}
