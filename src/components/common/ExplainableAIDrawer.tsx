import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BrainCircuit, ShieldAlert, CheckCircle2, AlertTriangle, Cpu, DollarSign, Activity } from 'lucide-react';
import { ExplainableAIData } from '../../types';

interface Props {
  data: ExplainableAIData | null;
  onClose: () => void;
}

export const ExplainableAIDrawer: React.FC<Props> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-xl bg-navy-900 border-l border-navy-700 h-full flex flex-col shadow-2xl overflow-y-auto"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-navy-700 bg-navy-850 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                <BrainCircuit className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Explainable AI (XAI) Diagnostics
                </h3>
                <p className="text-xs text-slate-400">Deep Neural Feature Attribution & Causality Breakdown</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-6 flex-1">
            {/* Prediction Banner */}
            <div className="p-4 bg-navy-800/80 border border-amber-500/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> AI Predictive Output
                </span>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold rounded-full border border-cyan-500/30">
                  {data.confidenceScore}% Confidence
                </span>
              </div>
              <p className="text-base font-bold text-white">{data.prediction}</p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-navy-800 rounded-xl border border-navy-700 flex items-center space-x-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Estimated Cost</div>
                  <div className="text-base font-bold text-white">₹{data.estimatedCost.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="p-3.5 bg-navy-800 rounded-xl border border-navy-700 flex items-center space-x-3">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Urgency Level</div>
                  <div className="text-base font-bold text-amber-400">{data.urgency}</div>
                </div>
              </div>
            </div>

            {/* Main Contributing Factors */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Main Contributing Factors (SHAP Values)
              </h4>
              <div className="space-y-3 bg-navy-850 p-4 rounded-xl border border-navy-700">
                {data.mainContributingFactors.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-200">{item.factor}</span>
                      <span className="text-cyan-400 font-mono font-bold">{item.percentage}% Impact</span>
                    </div>
                    <div className="w-full h-2 bg-navy-950 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 italic">Impact: {item.impact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Supporting Sensor Readings */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                Supporting Telemetry Signals
              </h4>
              <div className="bg-navy-850 rounded-xl border border-navy-700 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-navy-800 text-slate-400 border-b border-navy-700">
                    <tr>
                      <th className="px-4 py-2.5">Sensor Signal</th>
                      <th className="px-4 py-2.5">Observed Value</th>
                      <th className="px-4 py-2.5">Nominal Expected</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-700/60 text-slate-300">
                    {data.supportingSensors.map((sensor, idx) => (
                      <tr key={idx} className="hover:bg-navy-800/50">
                        <td className="px-4 py-2.5 font-medium text-white">{sensor.name}</td>
                        <td className="px-4 py-2.5 font-mono text-amber-400 font-semibold">{sensor.value}</td>
                        <td className="px-4 py-2.5 font-mono text-slate-400">{sensor.expected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Root Cause Analysis */}
            <div className="p-4 bg-navy-850 rounded-xl border border-navy-700 space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Root Cause Analysis</h4>
              <p className="text-sm text-slate-200 leading-relaxed">{data.rootCause}</p>
            </div>

            {/* Recommended Action */}
            <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-xl space-y-2">
              <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> AI Prescriptive Action
              </h4>
              <p className="text-sm font-medium text-white">{data.recommendedAction}</p>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-navy-700 bg-navy-850">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-navy-700 hover:bg-navy-600 text-white font-medium rounded-xl transition"
            >
              Close Diagnostic Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
