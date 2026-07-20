import React, { useState } from 'react';
import { DiagnosticResult } from '../types';
import {
  Activity,
  Play,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Filter,
  Cpu,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';

export const DiagnosticsPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [hasScanned, setHasScanned] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Healthy' | 'Warning' | 'Critical'>('All');

  const diagnosticResults: DiagnosticResult[] = [
    {
      id: 'diag-1',
      component: 'Battery System',
      status: 'Warning',
      errorCode: 'ATG-BAT-104',
      issue: 'Battery temperature higher than normal',
      severity: 'Medium',
      confidenceScore: 94,
      rootCause: 'Frequent fast charging and reduced cooling efficiency causing thermal throttling.',
      recommendedAction: 'Inspect battery cooling system within 7 days and execute cell rebalancing sequence.'
    },
    {
      id: 'diag-2',
      component: 'Thermal & Cooling',
      status: 'Warning',
      errorCode: 'ATG-COOL-201',
      issue: 'Coolant pump flow restriction detected',
      severity: 'Medium',
      confidenceScore: 89,
      rootCause: 'Partial impeller debris bypass restricting fluid flow to 2.1 L/min.',
      recommendedAction: 'Flush primary coolant loop and inspect flow control valve.'
    },
    {
      id: 'diag-3',
      component: 'Brake System',
      status: 'Healthy',
      errorCode: 'ATG-BRK-002',
      issue: 'Front pad thickness near minimum limit',
      severity: 'Low',
      confidenceScore: 91,
      rootCause: 'Standard friction erosion.',
      recommendedAction: 'Schedule pad replacement during next 5,000 km maintenance.'
    },
    {
      id: 'diag-4',
      component: 'Electric Motor',
      status: 'Healthy',
      errorCode: 'NOMINAL-00',
      issue: 'None. Inverter & stator operating optimal.',
      severity: 'None',
      confidenceScore: 99,
      rootCause: 'All electromagnetic phase current signatures within 0.2% tolerance.',
      recommendedAction: 'No action required.'
    },
    {
      id: 'diag-5',
      component: 'Tyres & Suspension',
      status: 'Healthy',
      errorCode: 'NOMINAL-00',
      issue: 'Optimal pressure and damper absorption.',
      severity: 'None',
      confidenceScore: 98,
      rootCause: 'All wheel pressure transducers nominal.',
      recommendedAction: 'Maintain 32.0 PSI pressure.'
    },
    {
      id: 'diag-6',
      component: 'Transmission & Gearbox',
      status: 'Healthy',
      errorCode: 'NOMINAL-00',
      issue: 'Gear engagement and fluid viscosity optimal.',
      severity: 'None',
      confidenceScore: 97,
      rootCause: 'Magnetic chip sensor clear.',
      recommendedAction: 'Routine check at 50,000 km.'
    },
    {
      id: 'diag-7',
      component: 'Engine / Auxiliary Generator',
      status: 'Healthy',
      errorCode: 'NOMINAL-00',
      issue: 'Engine temperature baseline 92°C.',
      severity: 'None',
      confidenceScore: 96,
      rootCause: 'Combustion manifold balance optimal.',
      recommendedAction: 'No immediate action required.'
    },
    {
      id: 'diag-8',
      component: 'OBD Telemetry Sensors',
      status: 'Healthy',
      errorCode: 'NOMINAL-00',
      issue: 'All 48 CAN-Bus sensor nodes responding.',
      severity: 'None',
      confidenceScore: 100,
      rootCause: 'Zero frame drop across OBD-II wireless gateway.',
      recommendedAction: 'Continuous background monitoring active.'
    }
  ];

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setHasScanned(true);
          return 100;
        }
        return prev + 5;
      });
    }, 120);
  };

  const filteredResults = diagnosticResults.filter(r => {
    if (activeFilter === 'All') return true;
    return r.status === activeFilter;
  });

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Header Banner */}
      <div className="bg-navy-900 p-5 rounded-2xl border border-navy-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" /> Deep Vehicle OBD Scan & Diagnostics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Execute full CAN-bus system scan to detect active fault codes (DTC) and neural anomaly patterns.
          </p>
        </div>
        <button
          onClick={handleStartScan}
          disabled={isScanning}
          className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-extrabold rounded-xl text-xs uppercase tracking-wider transition flex items-center space-x-2 shadow-glow-cyan"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isScanning ? 'Scanning System...' : 'Run Full Vehicle Scan'}</span>
        </button>
      </div>

      {/* Progress Loader Overlay when Scanning */}
      {isScanning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-navy-900 border border-cyan-500/40 p-8 rounded-2xl text-center space-y-4 shadow-2xl"
        >
          <div className="flex justify-between items-center max-w-lg mx-auto text-xs font-mono">
            <span className="text-cyan-400 font-bold">CAN-BUS DEEP SCAN IN PROGRESS</span>
            <span className="text-white font-bold">{scanProgress}%</span>
          </div>
          <div className="w-full max-w-lg h-3 bg-navy-950 rounded-full mx-auto overflow-hidden border border-navy-700">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 animate-pulse font-mono">
            Querying ECU modules: Battery, Inverter, Brakes, Thermal Loop, Transducers...
          </p>
        </motion.div>
      )}

      {/* Scan Results */}
      {hasScanned && !isScanning && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex items-center justify-between bg-navy-900 p-4 rounded-xl border border-navy-700">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase text-slate-400">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span>Filter Results:</span>
            </div>
            <div className="flex space-x-2">
              {(['All', 'Healthy', 'Warning', 'Critical'] as const).map(filter => (
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

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResults.map(item => (
              <div
                key={item.id}
                className={`p-5 bg-navy-850 rounded-2xl border transition space-y-3 ${
                  item.status === 'Critical'
                    ? 'border-critical/50'
                    : item.status === 'Warning'
                    ? 'border-amber-500/40'
                    : 'border-navy-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2.5">
                    {item.status === 'Healthy' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : item.status === 'Warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-critical" />
                    )}
                    <div>
                      <h4 className="text-base font-bold text-white">{item.component}</h4>
                      <span className="text-xs font-mono text-cyan-400 font-semibold">{item.errorCode}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                        item.status === 'Healthy'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : item.status === 'Warning'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-critical/10 text-critical border-critical/30'
                      }`}
                    >
                      {item.status}
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      Confidence: <span className="text-white font-bold">{item.confidenceScore}%</span>
                    </div>
                  </div>
                </div>

                {item.issue && (
                  <p className="text-xs text-slate-200 font-medium">
                    <span className="text-slate-400">Issue:</span> {item.issue}
                  </p>
                )}

                {item.rootCause && (
                  <div className="p-3 bg-navy-900 rounded-xl border border-navy-700 text-xs text-slate-300">
                    <span className="text-slate-400 font-semibold block mb-0.5">Root Cause:</span>
                    {item.rootCause}
                  </div>
                )}

                {item.recommendedAction && (
                  <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-xs text-slate-200">
                    <span className="text-cyan-400 font-bold block mb-0.5">Recommended Action:</span>
                    {item.recommendedAction}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
