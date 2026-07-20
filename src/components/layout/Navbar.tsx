import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Car, Bell, Radio, User, ChevronDown, CheckCircle2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentVehicle, vehicles, setCurrentVehicleId, alerts, setCurrentNav } = useApp();
  const [timeStr, setTimeStr] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadAlerts = alerts.filter(a => a.status === 'Unacknowledged');

  return (
    <header className="h-16 bg-navy-900/80 backdrop-blur-md border-b border-navy-700/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-lg">
      {/* Left section: Vehicle Selector & Connection Status */}
      <div className="flex items-center space-x-6">
        {/* Vehicle Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 bg-navy-800 hover:bg-navy-700/80 px-3.5 py-2 rounded-xl border border-navy-700 transition"
          >
            <div className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <Car className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs text-slate-400 leading-tight">Selected Vehicle</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                {currentVehicle.name} <span className="font-mono text-cyan-400">({currentVehicle.id})</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-navy-850 border border-navy-700 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-3 py-2 text-[11px] font-semibold uppercase text-slate-400 bg-navy-900 border-b border-navy-700">
                Switch Vehicle Twin
              </div>
              <div className="py-1">
                {vehicles.map(v => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setCurrentVehicleId(v.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-navy-700/60 transition ${
                      v.id === currentVehicle.id ? 'bg-cyan-500/10 text-cyan-400 border-l-4 border-cyan-400' : 'text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{v.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{v.id} • {v.model}</div>
                    </div>
                    {v.id === currentVehicle.id && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Connection Status Badge */}
        <div className="hidden md:flex items-center space-x-3 px-3 py-1.5 bg-navy-950/80 rounded-full border border-navy-700">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Connected</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-mono text-cyan-300">Prototype Mode — Simulated Vehicle Data</span>
          </div>
        </div>
      </div>

      {/* Right section: Clock, Notification, Profile */}
      <div className="flex items-center space-x-5">
        {/* Current Time Clock */}
        <div className="hidden lg:flex flex-col text-right font-mono">
          <span className="text-xs font-bold text-slate-200">{timeStr}</span>
          <span className="text-[10px] text-slate-400 uppercase">Live Telemetry Sync</span>
        </div>

        {/* Notifications Icon Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2.5 bg-navy-800 hover:bg-navy-700 text-slate-300 rounded-xl border border-navy-700 relative transition"
          >
            <Bell className="w-5 h-5" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-critical text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-navy-850 border border-navy-700 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 bg-navy-900 border-b border-navy-700 flex justify-between items-center">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Active Alerts ({unreadAlerts.length})</span>
                <button
                  onClick={() => {
                    setCurrentNav('alerts');
                    setNotificationsOpen(false);
                  }}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  View All Alerts
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-navy-700">
                {unreadAlerts.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">All systems optimal. No unread alerts.</div>
                ) : (
                  unreadAlerts.slice(0, 4).map(alert => (
                    <div key={alert.id} className="p-3 hover:bg-navy-800 transition">
                      <div className="flex items-center justify-between text-xs font-semibold text-white">
                        <span className={alert.severity === 'Critical' ? 'text-critical' : 'text-amber-400'}>
                          {alert.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{alert.timestamp.split(' ')[1]}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{alert.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Widget */}
        <div className="flex items-center space-x-3 pl-2 border-l border-navy-700">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-white font-bold">
            <User className="w-5 h-5" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-white">Dr. Aris Thorne</div>
            <div className="text-[10px] text-slate-400">Lead AI Twin Engineer</div>
          </div>
        </div>
      </div>
    </header>
  );
};
