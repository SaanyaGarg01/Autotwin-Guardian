import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  CheckCircle2,
  Bell,
  Thermometer,
  Gauge,
  Sliders,
  ShieldAlert
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useApp();
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all vehicle twin telemetry, maintenance logs, and local settings?')) {
      resetAllData();
      setFormData(settings);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Header Banner */}
      <div className="bg-navy-900 p-5 rounded-2xl border border-navy-700 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-cyan-400" /> Platform & Telemetry Settings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure vehicle parameters, units, live polling intervals, and alert thresholds.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Identity */}
        <div className="bg-navy-900 p-6 rounded-2xl border border-navy-700 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" /> Vehicle Digital Twin Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Vehicle Name</label>
              <input
                type="text"
                value={formData.vehicleName}
                onChange={e => setFormData({ ...formData, vehicleName: e.target.value })}
                className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Vehicle Identifier ID</label>
              <input
                type="text"
                value={formData.vehicleId}
                onChange={e => setFormData({ ...formData, vehicleId: e.target.value })}
                className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Telemetry Display Units */}
        <div className="bg-navy-900 p-6 rounded-2xl border border-navy-700 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Gauge className="w-4 h-4 text-emerald-400" /> Telemetry & Units Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Speed Unit</label>
              <select
                value={formData.speedUnit}
                onChange={e => setFormData({ ...formData, speedUnit: e.target.value as any })}
                className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
              >
                <option value="km/h">Kilometers per hour (km/h)</option>
                <option value="mph">Miles per hour (mph)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Temperature Unit</label>
              <select
                value={formData.tempUnit}
                onChange={e => setFormData({ ...formData, tempUnit: e.target.value as any })}
                className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
              >
                <option value="°C">Celsius (°C)</option>
                <option value="°F">Fahrenheit (°F)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Simulation Refresh Rate</label>
              <select
                value={formData.updateFrequencySec}
                onChange={e => setFormData({ ...formData, updateFrequencySec: Number(e.target.value) })}
                className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 outline-none"
              >
                <option value={1}>1 Second (Ultra High Frequency)</option>
                <option value={3}>3 Seconds (Default Standard)</option>
                <option value={5}>5 Seconds (Low Bandwidth)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Thresholds & Notifications */}
        <div className="bg-navy-900 p-6 rounded-2xl border border-navy-700 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> Thresholds & Notifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Critical Alert Health Threshold ({formData.criticalAlertThreshold}%)
              </label>
              <input
                type="range"
                min={50}
                max={90}
                value={formData.criticalAlertThreshold}
                onChange={e => setFormData({ ...formData, criticalAlertThreshold: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Triggers critical warning when subsystem health drops below this percentage.
              </span>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <input
                type="checkbox"
                id="notificationsEnabled"
                checked={formData.notificationsEnabled}
                onChange={e => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
              <label htmlFor="notificationsEnabled" className="text-xs text-slate-200 cursor-pointer font-medium">
                Enable In-App Real-Time Push Alerts
              </label>
            </div>
          </div>
        </div>

        {/* Save & Reset Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-3">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-extrabold rounded-xl text-xs uppercase tracking-wider transition flex items-center space-x-2 shadow-glow-cyan"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>

            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Saved to LocalStorage
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-3 bg-critical/10 hover:bg-critical/20 text-critical border border-critical/30 rounded-xl text-xs font-bold transition flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Data</span>
          </button>
        </div>
      </form>
    </div>
  );
};
