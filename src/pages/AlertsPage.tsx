import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BellRing,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Filter,
  ShieldAlert,
  Info
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert, openXAI } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filters = ['All', 'Critical', 'Warning', 'Information', 'Resolved'];

  const filteredAlerts = alerts.filter(a => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Resolved') return a.status === 'Resolved';
    return a.severity === activeFilter;
  });

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Header Banner */}
      <div className="bg-navy-900 p-5 rounded-2xl border border-navy-700 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BellRing className="w-6 h-6 text-amber-400" /> Active Vehicle Telemetry Alerts
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time threshold breaches, AI anomaly detections, and component degradation warnings.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between bg-navy-900 p-4 rounded-xl border border-navy-700">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase text-slate-400">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Filter Severity:</span>
        </div>
        <div className="flex space-x-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeFilter === filter
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-navy-850 text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-4">
        {filteredAlerts.map(alert => (
          <div
            key={alert.id}
            className={`p-5 bg-navy-850 rounded-2xl border transition space-y-3 ${
              alert.severity === 'Critical'
                ? 'border-critical/60'
                : alert.severity === 'Warning'
                ? 'border-amber-500/40'
                : 'border-navy-700'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    alert.severity === 'Critical'
                      ? 'bg-critical/10 text-critical'
                      : alert.severity === 'Warning'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-cyan-500/10 text-cyan-400'
                  }`}
                >
                  {alert.severity === 'Critical' ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : alert.severity === 'Warning' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Info className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-base font-bold text-white">{alert.title}</h4>
                    <span className="text-xs font-mono text-slate-400">({alert.component})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{alert.timestamp}</div>
                </div>
              </div>

              <span
                className={`px-3 py-1 text-xs font-bold rounded-full border ${
                  alert.status === 'Resolved'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : alert.status === 'Acknowledged'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {alert.status}
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-medium bg-navy-900/50 p-3 rounded-xl">
              {alert.description}
            </p>

            <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-xs text-slate-200">
              <span className="text-cyan-400 font-bold block mb-0.5">Recommended Action:</span>
              {alert.recommendedAction}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-navy-700/60">
              <div className="flex space-x-2">
                {alert.status === 'Unacknowledged' && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-3.5 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 rounded-lg text-xs font-bold transition"
                  >
                    Acknowledge
                  </button>
                )}
                {alert.status !== 'Resolved' && (
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Resolved</span>
                  </button>
                )}
              </div>

              {alert.explanation && (
                <button
                  onClick={() => openXAI(alert.explanation!)}
                  className="px-3 py-1.5 bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold transition flex items-center space-x-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>View Explainable AI Details</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
