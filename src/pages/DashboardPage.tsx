import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  Activity,
  BatteryCharging,
  Gauge,
  Thermometer,
  Disc,
  Zap,
  RotateCw,
  Droplets,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const {
    telemetry,
    telemetryHistory,
    isSimulating,
    toggleSimulation,
    components,
    openXAI,
    settings
  } = useApp();

  const isFahrenheit = settings.tempUnit === '°F';
  const isMph = settings.speedUnit === 'mph';

  const formatTemp = (degC: number) => {
    if (isFahrenheit) return `${Math.round((degC * 9) / 5 + 32)}°F`;
    return `${degC}°C`;
  };

  const formatSpeed = (kmh: number) => {
    if (isMph) return `${Math.round(kmh * 0.621371)} mph`;
    return `${kmh} km/h`;
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-900/70 backdrop-blur-md p-5 rounded-2xl border border-navy-700">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            Vehicle Health Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time digital twin telemetry telemetry engine • Refreshes every {settings.updateFrequencySec}s
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSimulation}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
              isSimulating
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 shadow-glow-cyan'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isSimulating ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Simulation</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Live Simulation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Telemetry Cards Grid (9 Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Overall Health Score */}
        <div className="p-4 bg-navy-850 rounded-xl border border-navy-700 hover:border-cyan-500/40 transition relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Overall Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white font-mono">{telemetry.overallHealth}%</span>
            <span className="text-xs font-semibold text-emerald-400">Optimal</span>
          </div>
          <div className="w-full h-1.5 bg-navy-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${telemetry.overallHealth}%` }} />
          </div>
        </div>

        {/* Battery Health */}
        <div className="p-4 bg-navy-850 rounded-xl border border-amber-500/30 hover:border-amber-500/60 transition relative">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Battery Health</span>
            <BatteryCharging className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-amber-400 font-mono">{telemetry.batteryHealth}%</span>
            <span className="text-xs font-semibold text-amber-400">Thermal Stress</span>
          </div>
          <div className="w-full h-1.5 bg-navy-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${telemetry.batteryHealth}%` }} />
          </div>
        </div>

        {/* Engine Temperature */}
        <div className="p-4 bg-navy-850 rounded-xl border border-navy-700 hover:border-cyan-500/40 transition">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Engine Temp</span>
            <Thermometer className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white font-mono">{formatTemp(telemetry.engineTemp)}</span>
            <span className="text-xs text-slate-400">Normal</span>
          </div>
          <div className="w-full h-1.5 bg-navy-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${(telemetry.engineTemp / 130) * 100}%` }} />
          </div>
        </div>

        {/* Tyre Pressure */}
        <div className="p-4 bg-navy-850 rounded-xl border border-navy-700 hover:border-cyan-500/40 transition">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Tyre Pressure</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white font-mono">{telemetry.tyrePressure} PSI</span>
            <span className="text-xs text-emerald-400">Optimal</span>
          </div>
          <div className="w-full h-1.5 bg-navy-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(telemetry.tyrePressure / 40) * 100}%` }} />
          </div>
        </div>

        {/* Brake Health */}
        <div className="p-4 bg-navy-850 rounded-xl border border-navy-700 hover:border-cyan-500/40 transition">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Brake Health</span>
            <Disc className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white font-mono">{telemetry.brakeHealth}%</span>
            <span className="text-xs text-slate-400">Good</span>
          </div>
          <div className="w-full h-1.5 bg-navy-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${telemetry.brakeHealth}%` }} />
          </div>
        </div>

        {/* Fuel / Battery Level */}
        <div className="p-4 bg-navy-850 rounded-xl border border-navy-700 hover:border-cyan-500/40 transition">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Battery Charge Level</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">{Math.round(telemetry.fuelBatteryLevel)}%</span>
            <span className="text-xs text-slate-400">~240 km</span>
          </div>
          <div className="w-full h-1.5 bg-navy-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${telemetry.fuelBatteryLevel}%` }} />
          </div>
        </div>

        {/* Speed */}
        <div className="p-4 bg-navy-850 rounded-xl border border-navy-700 hover:border-cyan-500/40 transition">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Current Speed</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-cyan-400 font-mono">{formatSpeed(telemetry.speed)}</span>
          </div>
          <div className="w-full h-1.5 bg-navy-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${(telemetry.speed / 160) * 100}%` }} />
          </div>
        </div>

        {/* RPM */}
        <div className="p-4 bg-navy-850 rounded-xl border border-navy-700 hover:border-cyan-500/40 transition">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Motor RPM</span>
            <RotateCw className="w-4 h-4 text-slate-300" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white font-mono">{telemetry.rpm}</span>
          </div>
          <div className="w-full h-1.5 bg-navy-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(telemetry.rpm / 6000) * 100}%` }} />
          </div>
        </div>

        {/* Coolant Temperature */}
        <div className="p-4 bg-navy-850 rounded-xl border border-navy-700 hover:border-cyan-500/40 transition">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Coolant Temp</span>
            <Droplets className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white font-mono">{formatTemp(telemetry.coolantTemp)}</span>
          </div>
          <div className="w-full h-1.5 bg-navy-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(telemetry.coolantTemp / 110) * 100}%` }} />
          </div>
        </div>

        {/* Battery Temperature */}
        <div className="p-4 bg-navy-850 rounded-xl border border-amber-500/30 hover:border-amber-500/60 transition">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Battery Temp</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-amber-400 font-mono">{formatTemp(telemetry.batteryTemp)}</span>
            <span className="text-[10px] text-amber-400 font-bold">Elevated</span>
          </div>
          <div className="w-full h-1.5 bg-navy-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(telemetry.batteryTemp / 70) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Telemetry Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Speed & RPM Live Chart */}
        <div className="p-5 bg-navy-850 rounded-2xl border border-navy-700 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Speed & RPM Telemetry
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Live Stream</span>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryHistory}>
                <defs>
                  <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1C2541" />
                <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#3A506B', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="speed" stroke="#00F0FF" strokeWidth={2} fillOpacity={1} fill="url(#speedGrad)" name="Speed (km/h)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Battery Temp, Vibration & Engine Temp Live Chart */}
        <div className="p-5 bg-navy-850 rounded-2xl border border-navy-700 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" /> Thermal & Vibration Signals
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Multi-Sensor</span>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1C2541" />
                <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#3A506B', borderRadius: '8px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="batteryTemp" stroke="#F59E0B" strokeWidth={2} dot={false} name="Battery Temp (°C)" />
                <Line type="monotone" dataKey="engineTemp" stroke="#EF4444" strokeWidth={2} dot={false} name="Engine Temp (°C)" />
                <Line type="monotone" dataKey="vibration" stroke="#10B981" strokeWidth={2} dot={false} name="Vibration (m/s²)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Component Health Table */}
      <div className="bg-navy-850 rounded-2xl border border-navy-700 overflow-hidden">
        <div className="p-5 bg-navy-900 border-b border-navy-700 flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-white">Component Health & Failure Probability</h3>
            <p className="text-xs text-slate-400">AI-computed remaining useful life & predictive risk analysis</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-800 text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-3.5">Component</th>
                <th className="px-6 py-3.5">Health</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Failure Prob</th>
                <th className="px-6 py-3.5">Remaining Useful Life</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/80 text-slate-200">
              {components.map(comp => (
                <tr key={comp.id} className="hover:bg-navy-800/50 transition">
                  <td className="px-6 py-4 font-bold text-white flex items-center space-x-2">
                    <span>{comp.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3 w-36">
                      <span className="font-mono font-bold text-xs">{comp.health}%</span>
                      <div className="w-full h-2 bg-navy-950 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            comp.health >= 80
                              ? 'bg-emerald-500'
                              : comp.health >= 65
                              ? 'bg-amber-500'
                              : 'bg-critical'
                          }`}
                          style={{ width: `${comp.health}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full border ${
                        comp.status === 'Healthy'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : comp.status === 'Warning'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-critical/10 text-critical border-critical/30'
                      }`}
                    >
                      {comp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-semibold">
                    <span className={comp.failureProbability > 20 ? 'text-amber-400' : 'text-slate-300'}>
                      {comp.failureProbability}%
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium">
                    {comp.remainingUsefulLife} {comp.rulUnit}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {comp.explanation ? (
                      <button
                        onClick={() => openXAI(comp.explanation!)}
                        className="px-3 py-1.5 bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ml-auto"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Why This Prediction</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 italic">Nominal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
