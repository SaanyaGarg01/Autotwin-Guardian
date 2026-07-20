import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ComponentId, ComponentHealth } from '../types';
import {
  Cpu,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Wrench,
  Thermometer,
  Activity,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export const DigitalTwinPage: React.FC = () => {
  const { components, openXAI } = useApp();
  const [selectedId, setSelectedId] = useState<ComponentId>('battery');

  const selectedComp = components.find(c => c.id === selectedId) || components[0];

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="bg-navy-900/70 backdrop-blur-md p-5 rounded-2xl border border-navy-700 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-cyan-400" /> Digital Twin Interactive Inspector
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Click on any chassis subsystem to inspect real-time sensor streams and AI health projections.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-navy-850 px-3 py-1.5 rounded-xl border border-navy-700">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-cyan-300">Live Virtual Twin Model</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Chassis SVG Diagram Column (7 cols) */}
        <div className="lg:col-span-7 bg-navy-900/70 backdrop-blur-md rounded-2xl border border-navy-700 p-6 flex flex-col items-center justify-center relative min-h-[480px]">
          <div className="absolute top-4 left-4 text-xs font-mono text-slate-400 uppercase tracking-widest">
            Chassis Topography • Tap Node to Inspect
          </div>

          {/* Interactive SVG Vehicle Topography */}
          <div className="w-full max-w-lg relative py-8">
            <svg viewBox="0 0 500 750" className="w-full h-auto drop-shadow-2xl">
              <defs>
                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Vehicle Body Outline */}
              <path
                d="M 170,90 Q 250,50 330,90 L 370,180 Q 400,350 370,580 L 330,670 Q 250,710 170,670 L 130,580 Q 100,350 130,180 Z"
                fill="#0B132B"
                stroke="#1C2541"
                strokeWidth="4"
              />

              {/* Windshield & Glass Areas */}
              <path d="M 175,200 L 325,200 L 340,290 L 160,290 Z" fill="#121C3B" stroke="#273459" strokeWidth="2" />
              <path d="M 170,480 L 330,480 L 315,570 L 185,570 Z" fill="#121C3B" stroke="#273459" strokeWidth="2" />

              {/* Component Hotspots */}

              {/* 1. Front Tyres Hotspot */}
              <g
                onClick={() => setSelectedId('front-tyres')}
                className="cursor-pointer transition hover:opacity-80"
              >
                {/* Left Tyre */}
                <rect x="70" y="140" width="36" height="85" rx="10" fill="#1C2541" stroke={selectedId === 'front-tyres' ? '#00F0FF' : '#3A506B'} strokeWidth="3" />
                {/* Right Tyre */}
                <rect x="394" y="140" width="36" height="85" rx="10" fill="#1C2541" stroke={selectedId === 'front-tyres' ? '#00F0FF' : '#3A506B'} strokeWidth="3" />
                {/* Front Axle */}
                <line x1="106" y1="182.5" x2="394" y2="182.5" stroke="#3A506B" strokeWidth="3" strokeDasharray="4 4" />
                <circle cx="250" cy="182.5" r="14" fill="#0B132B" stroke={selectedId === 'front-tyres' ? '#00F0FF' : '#3A506B'} strokeWidth="2" />
                <text x="250" y="186" textAnchor="middle" fill="#00F0FF" fontSize="10" fontWeight="bold">TYRE</text>
              </g>

              {/* 2. Motor Hotspot */}
              <g
                onClick={() => setSelectedId('motor')}
                className="cursor-pointer transition hover:opacity-80"
              >
                <rect x="190" y="100" width="120" height="65" rx="12" fill={selectedId === 'motor' ? '#121C3B' : '#0B132B'} stroke={selectedId === 'motor' ? '#00F0FF' : '#10B981'} strokeWidth="3" filter={selectedId === 'motor' ? 'url(#glow-cyan)' : ''} />
                <text x="250" y="138" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">ELECTRIC MOTOR</text>
              </g>

              {/* 3. Cooling System Hotspot */}
              <g
                onClick={() => setSelectedId('cooling-system')}
                className="cursor-pointer transition hover:opacity-80"
              >
                <rect x="180" y="60" width="140" height="30" rx="6" fill={selectedId === 'cooling-system' ? '#121C3B' : '#0B132B'} stroke={selectedId === 'cooling-system' ? '#F59E0B' : '#F59E0B'} strokeWidth="2.5" />
                <text x="250" y="79" textAnchor="middle" fill="#F59E0B" fontSize="10" fontWeight="bold">COOLING SYSTEM</text>
              </g>

              {/* 4. Transmission Hotspot */}
              <g
                onClick={() => setSelectedId('transmission')}
                className="cursor-pointer transition hover:opacity-80"
              >
                <rect x="210" y="220" width="80" height="50" rx="8" fill="#0B132B" stroke={selectedId === 'transmission' ? '#00F0FF' : '#3A506B'} strokeWidth="2.5" />
                <text x="250" y="250" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontWeight="bold">GEARBOX</text>
              </g>

              {/* 5. HV Battery Pack Hotspot */}
              <g
                onClick={() => setSelectedId('battery')}
                className="cursor-pointer transition hover:opacity-80"
              >
                <rect x="170" y="300" width="160" height="170" rx="16" fill={selectedId === 'battery' ? '#121C3B' : '#0B132B'} stroke={selectedId === 'battery' ? '#F59E0B' : '#F59E0B'} strokeWidth="3.5" filter={selectedId === 'battery' ? 'url(#glow-amber)' : ''} />
                {/* Battery cells grid representation */}
                <rect x="185" y="315" width="60" height="60" rx="4" fill="#1C2541" opacity="0.8" />
                <rect x="255" y="315" width="60" height="60" rx="4" fill="#1C2541" opacity="0.8" />
                <rect x="185" y="385" width="60" height="60" rx="4" fill="#1C2541" opacity="0.8" />
                <rect x="255" y="385" width="60" height="60" rx="4" fill="#1C2541" opacity="0.8" />
                <text x="250" y="390" textAnchor="middle" fill="#F59E0B" fontSize="13" fontWeight="extrabold">HV BATTERY PACK</text>
                <text x="250" y="410" textAnchor="middle" fill="#F59E0B" fontSize="10" fontStyle="italic">(62% Health)</text>
              </g>

              {/* 6. Brakes Hotspot */}
              <g
                onClick={() => setSelectedId('brakes')}
                className="cursor-pointer transition hover:opacity-80"
              >
                <circle cx="110" cy="182.5" r="18" fill="#121C3B" stroke={selectedId === 'brakes' ? '#00F0FF' : '#10B981'} strokeWidth="2.5" />
                <circle cx="390" cy="182.5" r="18" fill="#121C3B" stroke={selectedId === 'brakes' ? '#00F0FF' : '#10B981'} strokeWidth="2.5" />
                <circle cx="110" cy="532.5" r="18" fill="#121C3B" stroke={selectedId === 'brakes' ? '#00F0FF' : '#10B981'} strokeWidth="2.5" />
                <circle cx="390" cy="532.5" r="18" fill="#121C3B" stroke={selectedId === 'brakes' ? '#00F0FF' : '#10B981'} strokeWidth="2.5" />
                <text x="250" y="495" textAnchor="middle" fill="#00F0FF" fontSize="10" fontWeight="bold">BRAKE CALIPERS</text>
              </g>

              {/* 7. Rear Tyres Hotspot */}
              <g
                onClick={() => setSelectedId('rear-tyres')}
                className="cursor-pointer transition hover:opacity-80"
              >
                <rect x="70" y="490" width="36" height="85" rx="10" fill="#1C2541" stroke={selectedId === 'rear-tyres' ? '#00F0FF' : '#3A506B'} strokeWidth="3" />
                <rect x="394" y="490" width="36" height="85" rx="10" fill="#1C2541" stroke={selectedId === 'rear-tyres' ? '#00F0FF' : '#3A506B'} strokeWidth="3" />
                <line x1="106" y1="532.5" x2="394" y2="532.5" stroke="#3A506B" strokeWidth="3" strokeDasharray="4 4" />
              </g>
            </svg>
          </div>
        </div>

        {/* Subsystem Details Card (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Subsystem Header */}
          <div className="bg-navy-900/70 backdrop-blur-md rounded-2xl border border-navy-700 p-6 space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">Subsystem Detail</span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">{selectedComp.name}</h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">Last Serviced: {selectedComp.lastServiceDate}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  selectedComp.status === 'Healthy'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : selectedComp.status === 'Warning'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-critical/10 text-critical border-critical/30'
                }`}
              >
                {selectedComp.status}
              </span>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-navy-850 rounded-xl border border-navy-700">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Health Percentage
                </div>
                <div className="text-2xl font-black text-white font-mono mt-1">{selectedComp.health}%</div>
              </div>

              <div className="p-3.5 bg-navy-850 rounded-xl border border-navy-700">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temperature
                </div>
                <div className="text-2xl font-black text-amber-400 font-mono mt-1">{selectedComp.temperature}°C</div>
              </div>

              <div className="p-3.5 bg-navy-850 rounded-xl border border-navy-700">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Failure Probability
                </div>
                <div className="text-2xl font-black text-red-400 font-mono mt-1">{selectedComp.failureProbability}%</div>
              </div>

              <div className="p-3.5 bg-navy-850 rounded-xl border border-navy-700">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Remaining Life
                </div>
                <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                  {selectedComp.remainingUsefulLife} {selectedComp.rulUnit}
                </div>
              </div>
            </div>

            {/* Live Sensor Streams */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Telemetry Signals & Sensors
              </h4>
              <div className="bg-navy-850 rounded-xl border border-navy-700 divide-y divide-navy-700">
                {selectedComp.sensorReadings.map((sensor, i) => (
                  <div key={i} className="p-3 flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">{sensor.label}</span>
                    <span
                      className={`font-mono font-bold ${
                        sensor.status === 'critical'
                          ? 'text-critical'
                          : sensor.status === 'warning'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {sensor.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescriptive Action Box */}
            <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-xl space-y-2">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-4 h-4" /> AI Prescriptive Action
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">{selectedComp.actionRequired}</p>
            </div>

            {/* Why This Prediction Button */}
            {selectedComp.explanation && (
              <button
                onClick={() => openXAI(selectedComp.explanation!)}
                className="w-full py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Why This Prediction (Explainable AI)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
