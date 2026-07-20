import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavPage } from '../../types';
import {
  LayoutDashboard,
  Cpu,
  Navigation,
  Activity,
  Wrench,
  BellRing,
  FileSpreadsheet,
  Settings,
  ShieldCheck
} from 'lucide-react';

interface NavItem {
  id: NavPage;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { currentNav, setCurrentNav, alerts } = useApp();

  const unreadCount = alerts.filter(a => a.status === 'Unacknowledged').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'digital-twin', label: 'Digital Twin', icon: Cpu },
    { id: 'journey-simulator', label: 'Journey Simulator', icon: Navigation },
    { id: 'diagnostics', label: 'Diagnostics', icon: Activity },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'alerts', label: 'Alerts', icon: BellRing, badge: unreadCount > 0 ? String(unreadCount) : undefined },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-navy-900/80 backdrop-blur-md border-r border-navy-700/80 flex flex-col justify-between select-none h-[calc(100vh-4rem)]">
      {/* Brand Header */}
      <div className="p-5 border-b border-navy-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-wider">AUTOTWIN</h1>
            <p className="text-[10px] font-semibold text-cyan-400 tracking-widest uppercase">Guardian AI</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="p-3 space-y-1.5 overflow-y-auto flex-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
          Core Operations
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentNav(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/30 font-semibold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-navy-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 transition ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 bg-critical text-white text-xs font-bold rounded-full font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Info */}
      <div className="p-4 border-t border-navy-800 bg-navy-950/40">
        <div className="p-3 bg-navy-850 rounded-xl border border-navy-700/60 text-xs">
          <div className="flex justify-between items-center text-slate-400 text-[11px] mb-1">
            <span>Twin Sync Engine</span>
            <span className="font-mono text-emerald-400 font-bold">v3.4.2</span>
          </div>
          <div className="w-full h-1.5 bg-navy-950 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-cyan-400 rounded-full animate-pulse" />
          </div>
          <div className="text-[10px] text-slate-500 mt-1.5 font-mono">
            ODBO-II Wireless Bridge Active
          </div>
        </div>
      </div>
    </aside>
  );
};
