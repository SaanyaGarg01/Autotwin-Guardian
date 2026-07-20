import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MaintenanceItem, CounterfactualScenario } from '../types';
import { COUNTERFACTUAL_SCENARIOS } from '../data/mockData';
import {
  Wrench,
  Calendar,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  X,
  Plus,
  SlidersHorizontal,
  ShieldCheck,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MaintenancePage: React.FC = () => {
  const {
    maintenanceList,
    scheduleMaintenance,
    markMaintenanceCompleted,
    dismissMaintenance
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Modal State for Schedule Service
  const [selectedItemForService, setSelectedItemForService] = useState<MaintenanceItem | null>(null);
  const [serviceDate, setServiceDate] = useState<string>('');
  const [serviceTime, setServiceTime] = useState<string>('10:00 AM');
  const [serviceCenter, setServiceCenter] = useState<string>('Tata Motors Authorized EV Service Hub');
  const [serviceNotes, setServiceNotes] = useState<string>('');

  // Counterfactual What-If Tool State
  const [scenarios, setScenarios] = useState<CounterfactualScenario[]>(COUNTERFACTUAL_SCENARIOS);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scenario-1');
  const [isComparing, setIsComparing] = useState<boolean>(true);

  const categories = ['All', 'Upcoming', 'AI-Predicted', 'Completed', 'Overdue'];

  const filteredMaintenance = maintenanceList.filter(item => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  const handleOpenScheduleModal = (item: MaintenanceItem) => {
    setSelectedItemForService(item);
    setServiceDate(item.predictedDate || new Date().toISOString().split('T')[0]);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForService) return;

    scheduleMaintenance({
      title: selectedItemForService.title,
      component: selectedItemForService.component,
      scheduledDate: serviceDate,
      scheduledTime: serviceTime,
      serviceCenter: serviceCenter,
      notes: serviceNotes,
      estimatedCost: selectedItemForService.estimatedCost,
      vehicleDowntime: selectedItemForService.vehicleDowntime,
      reason: selectedItemForService.reason
    });

    setSelectedItemForService(null);
    setServiceNotes('');
  };

  return (
    <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Header Banner */}
      <div className="bg-navy-900 p-5 rounded-2xl border border-navy-700 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-cyan-400" /> Predictive Maintenance & Counterfactual Tool
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            AI-forecasted service intervals, task scheduling, and counterfactual what-if decision matrix.
          </p>
        </div>
      </div>

      {/* SECTION 1: Counterfactual Decision What-If Tool */}
      <div className="bg-navy-900 rounded-2xl border border-cyan-500/30 p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/30">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Counterfactual What-If Decision Tool
                <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-300 font-mono rounded">
                  Trade-off Matrix
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Compare driver actions vs delayed maintenance scenarios to optimize cost & risk profile.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsComparing(!isComparing)}
            className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isComparing ? 'Hide Scenarios' : 'Compare Scenarios'}</span>
          </button>
        </div>

        {isComparing && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-800 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Scenario Action</th>
                    <th className="px-4 py-3">Risk Score</th>
                    <th className="px-4 py-3">Failure Prob</th>
                    <th className="px-4 py-3">Est. Cost</th>
                    <th className="px-4 py-3">RUL Impact</th>
                    <th className="px-4 py-3">Safety Level</th>
                    <th className="px-4 py-3 text-right">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-700 text-slate-200">
                  {scenarios.map(sc => (
                    <tr
                      key={sc.id}
                      className={`hover:bg-navy-800/60 transition ${
                        sc.isRecommended ? 'bg-cyan-500/10 font-medium' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-bold text-white">
                        <div className="flex items-center space-x-2">
                          {sc.isRecommended && <Sparkles className="w-4 h-4 text-cyan-400" />}
                          <span>{sc.title}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">{sc.description}</div>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold">
                        <span className={sc.riskScore > 50 ? 'text-critical' : 'text-emerald-400'}>
                          {sc.riskScore}%
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold">
                        <span className={sc.failureProbability > 40 ? 'text-amber-400' : 'text-emerald-400'}>
                          {sc.failureProbability}%
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-white">
                        ₹{sc.estimatedCost.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 font-mono text-cyan-300 font-bold">{sc.additionalLife}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            sc.safetyLevel === 'Optimal' || sc.safetyLevel === 'High'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-critical/10 text-critical border border-critical/30'
                          }`}
                        >
                          {sc.safetyLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {sc.isRecommended ? (
                          <span className="px-3 py-1 bg-emerald-500 text-navy-950 font-extrabold text-[11px] rounded-full shadow-glow-green">
                            Best Strategy
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500">Alternative</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Maintenance Schedule & Cards */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center justify-between bg-navy-900 p-4 rounded-xl border border-navy-700">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-navy-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Showing {filteredMaintenance.length} maintenance records
          </span>
        </div>

        {/* Maintenance Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaintenance.map(item => (
            <div
              key={item.id}
              className={`p-5 bg-navy-850 rounded-2xl border transition space-y-4 flex flex-col justify-between ${
                item.category === 'Overdue'
                  ? 'border-critical/60'
                  : item.category === 'AI-Predicted'
                  ? 'border-amber-500/40'
                  : 'border-navy-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-cyan-400">{item.component}</span>
                    <h4 className="text-base font-bold text-white leading-tight">{item.title}</h4>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                      item.priority === 'Urgent' || item.priority === 'High'
                        ? 'bg-critical/10 text-critical border-critical/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 bg-navy-900 rounded-lg text-slate-300">
                    <span className="text-slate-400 text-[10px] block">Predicted Date</span>
                    {item.predictedDate}
                  </div>
                  <div className="p-2 bg-navy-900 rounded-lg text-slate-300">
                    <span className="text-slate-400 text-[10px] block">Remaining RUL</span>
                    <span className="text-cyan-400 font-bold">{item.remainingUsefulLife}</span>
                  </div>
                  <div className="p-2 bg-navy-900 rounded-lg text-slate-300">
                    <span className="text-slate-400 text-[10px] block">Est. Cost</span>
                    ₹{item.estimatedCost.toLocaleString('en-IN')}
                  </div>
                  <div className="p-2 bg-navy-900 rounded-lg text-slate-300">
                    <span className="text-slate-400 text-[10px] block">Downtime</span>
                    {item.vehicleDowntime}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium bg-navy-900/60 p-2.5 rounded-lg">
                  {item.reason}
                </p>

                {item.scheduledDate && (
                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs text-emerald-300">
                    <div className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Scheduled Service Confirmed
                    </div>
                    <div className="text-[11px] mt-0.5">
                      {item.scheduledDate} at {item.scheduledTime || '10:00 AM'} • {item.serviceCenter}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center space-x-2">
                {item.category !== 'Completed' && (
                  <>
                    <button
                      onClick={() => handleOpenScheduleModal(item)}
                      className="flex-1 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition text-center"
                    >
                      Schedule Service
                    </button>
                    <button
                      onClick={() => markMaintenanceCompleted(item.id)}
                      className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition"
                    >
                      Complete
                    </button>
                  </>
                )}
                <button
                  onClick={() => dismissMaintenance(item.id)}
                  className="px-3 py-2 bg-navy-800 hover:bg-navy-700 text-slate-400 rounded-xl text-xs font-bold transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Service Modal */}
      <AnimatePresence>
        {selectedItemForService && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-navy-900 border border-navy-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl space-y-4 p-6"
            >
              <div className="flex justify-between items-center border-b border-navy-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" /> Schedule Maintenance Service
                </h3>
                <button onClick={() => setSelectedItemForService(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSchedule} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Service Task</label>
                  <input
                    type="text"
                    value={selectedItemForService.title}
                    readOnly
                    className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Service Date</label>
                    <input
                      type="date"
                      value={serviceDate}
                      onChange={e => setServiceDate(e.target.value)}
                      className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-white focus:border-cyan-400 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Preferred Time</label>
                    <select
                      value={serviceTime}
                      onChange={e => setServiceTime(e.target.value)}
                      className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-white focus:border-cyan-400 outline-none"
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Authorized Service Center</label>
                  <input
                    type="text"
                    value={serviceCenter}
                    onChange={e => setServiceCenter(e.target.value)}
                    className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-white focus:border-cyan-400 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Special Service Notes</label>
                  <textarea
                    value={serviceNotes}
                    onChange={e => setServiceNotes(e.target.value)}
                    rows={3}
                    placeholder="e.g. Inspect coolant fluid levels & check battery pack seal..."
                    className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div className="pt-2 flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-navy-950 font-bold rounded-xl text-xs uppercase tracking-wider transition hover:brightness-110"
                  >
                    Confirm Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedItemForService(null)}
                    className="px-4 py-3 bg-navy-800 text-slate-300 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
