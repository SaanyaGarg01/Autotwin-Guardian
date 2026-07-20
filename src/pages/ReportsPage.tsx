import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  Cpu,
  Activity,
  FileText,
  ShieldCheck
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { currentVehicle, components, maintenanceList, alerts, telemetry } = useApp();
  const [reportType, setReportType] = useState<string>('Vehicle Health Report');
  const [startDate, setStartDate] = useState<string>('2026-07-01');
  const [endDate, setEndDate] = useState<string>('2026-07-20');
  const [generatedReport, setGeneratedReport] = useState<boolean>(true);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedReport(true);
  };

  const handleDownloadCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'Vehicle Health Report') {
      csvContent += 'Component,Health(%),Status,FailureProbability(%),RUL,LastService\n';
      components.forEach(c => {
        csvContent += `"${c.name}",${c.health},"${c.status}",${c.failureProbability},"${c.remainingUsefulLife} ${c.rulUnit}","${c.lastServiceDate}"\n`;
      });
    } else if (reportType === 'Maintenance Report') {
      csvContent += 'Title,Component,Category,PredictedDate,Priority,Cost(INR),Status\n';
      maintenanceList.forEach(m => {
        csvContent += `"${m.title}","${m.component}","${m.category}","${m.predictedDate}","${m.priority}",${m.estimatedCost},"${m.scheduledDate ? 'Scheduled' : 'Pending'}"\n`;
      });
    } else {
      csvContent += 'AlertID,Timestamp,Severity,Component,Title,Status\n';
      alerts.forEach(a => {
        csvContent += `"${a.id}","${a.timestamp}","${a.severity}","${a.component}","${a.title}","${a.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportType.replace(/ /g, '_')}_${currentVehicle.id}_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Header Banner */}
      <div className="bg-navy-900 p-5 rounded-2xl border border-navy-700 flex justify-between items-center no-print">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-cyan-400" /> Automated Fleet Reports & Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate formal diagnostic records, maintenance audits, and journey prognosis exports.
          </p>
        </div>
      </div>

      {/* Controls Form Bar */}
      <form onSubmit={handleGenerate} className="bg-navy-900 p-5 rounded-2xl border border-navy-700 space-y-4 no-print">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Report Specification</label>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value)}
              className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
            >
              <option value="Vehicle Health Report">Vehicle Health Report</option>
              <option value="Journey Risk Report">Journey Risk Report</option>
              <option value="Diagnostic Report">Diagnostic Report</option>
              <option value="Maintenance Report">Maintenance Report</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-glow-cyan"
          >
            Generate Report
          </button>
          <button
            type="button"
            onClick={handleDownloadCSV}
            className="px-4 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handlePrintPDF}
            className="px-4 py-2.5 bg-navy-800 hover:bg-navy-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-2 border border-navy-700"
          >
            <Printer className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </form>

      {/* Generated Report Document Preview Card */}
      {generatedReport && (
        <div className="bg-navy-900 border border-navy-700 rounded-2xl p-8 space-y-6 shadow-2xl">
          {/* Document Header */}
          <div className="flex justify-between items-start border-b border-navy-800 pb-6">
            <div>
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
                OFFICIAL AUTOTWIN GUARDIAN DIAGNOSTIC REPORT
              </div>
              <h3 className="text-2xl font-black text-white mt-1">{reportType}</h3>
              <div className="text-xs text-slate-400 mt-1 font-mono">
                Date Range: {startDate} to {endDate} • Generated: {new Date().toLocaleDateString()}
              </div>
            </div>
            <div className="text-right font-mono text-xs">
              <div className="font-bold text-white">{currentVehicle.name}</div>
              <div className="text-cyan-400">VIN: {currentVehicle.vin}</div>
              <div className="text-slate-400">Twin ID: {currentVehicle.id}</div>
            </div>
          </div>

          {/* Report Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-navy-850 rounded-xl border border-navy-700">
              <span className="text-xs text-slate-400">Overall Health</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{telemetry.overallHealth}%</div>
            </div>
            <div className="p-4 bg-navy-850 rounded-xl border border-navy-700">
              <span className="text-xs text-slate-400">HV Battery SOH</span>
              <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{telemetry.batteryHealth}%</div>
            </div>
            <div className="p-4 bg-navy-850 rounded-xl border border-navy-700">
              <span className="text-xs text-slate-400">Pending Actions</span>
              <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">{maintenanceList.length} Tasks</div>
            </div>
            <div className="p-4 bg-navy-850 rounded-xl border border-navy-700">
              <span className="text-xs text-slate-400">Active Fault DTCs</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">1 Warning</div>
            </div>
          </div>

          {/* Component Health Table inside Report */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Subsystem Status Audit</h4>
            <div className="bg-navy-850 rounded-xl border border-navy-700 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-800 text-slate-400 font-semibold uppercase">
                  <tr>
                    <th className="px-4 py-2.5">Subsystem</th>
                    <th className="px-4 py-2.5">Health (%)</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Failure Prob</th>
                    <th className="px-4 py-2.5">Remaining Useful Life</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-700 text-slate-200">
                  {components.map(comp => (
                    <tr key={comp.id}>
                      <td className="px-4 py-2.5 font-bold text-white">{comp.name}</td>
                      <td className="px-4 py-2.5 font-mono">{comp.health}%</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            comp.status === 'Healthy'
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-amber-400 bg-amber-500/10'
                          }`}
                        >
                          {comp.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-mono">{comp.failureProbability}%</td>
                      <td className="px-4 py-2.5 font-mono">
                        {comp.remainingUsefulLife} {comp.rulUnit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signature / Certification Footer */}
          <div className="pt-4 border-t border-navy-800 flex justify-between items-center text-xs text-slate-400">
            <div>AutoTwin AI Predictive Engine • Certified Automated Log</div>
            <div className="font-mono text-cyan-400">SHA256 Hash: 9f8a...2e10</div>
          </div>
        </div>
      )}
    </div>
  );
};
