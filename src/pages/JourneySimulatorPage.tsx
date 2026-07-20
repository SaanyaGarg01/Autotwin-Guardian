import React, { useState } from 'react';
import { JourneyParams, JourneyResult } from '../types';
import {
  Navigation,
  Play,
  RotateCcw,
  ShieldAlert,
  Battery,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  CloudSun,
  MapPin,
  TrendingUp,
  Zap,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

export const JourneySimulatorPage: React.FC = () => {
  const [params, setParams] = useState<JourneyParams>({
    startLocation: 'Mumbai Business Hub',
    destination: 'Pune Tech Park',
    distanceKm: 148,
    weather: 'Hot',
    roadType: 'Mountain',
    drivingStyle: 'Aggressive',
    vehicleLoad: 'Heavy',
    currentBatteryLevel: 68
  });

  const [result, setResult] = useState<JourneyResult | null>({
    riskScore: 72,
    successProbability: 81,
    predictedBatteryConsumption: 34,
    componentStress: {
      battery: 'High',
      brakes: 'Medium',
      motor: 'Medium',
      tyres: 'High'
    },
    possibleFailure: 'Battery thermal throttling under steep mountain incline load',
    estimatedArrivalBattery: 34,
    routeSafety: 'Moderate',
    maintenanceRecommendation: 'Inspect battery thermal cooling system & inflate front tyres to 33 PSI before departure.'
  });

  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    setTimeout(() => {
      // Calculate realistic simulation metrics based on inputs
      let baseRisk = 20;

      // Distance penalty
      baseRisk += Math.min(30, Math.round(params.distanceKm / 10));

      // Weather impact
      if (params.weather === 'Hot') baseRisk += 18;
      if (params.weather === 'Rainy') baseRisk += 14;
      if (params.weather === 'Foggy') baseRisk += 16;
      if (params.weather === 'Cold') baseRisk += 10;

      // Road type impact
      if (params.roadType === 'Mountain') baseRisk += 22;
      if (params.roadType === 'Mixed') baseRisk += 10;
      if (params.roadType === 'City') baseRisk += 12;

      // Driving style impact
      if (params.drivingStyle === 'Aggressive') baseRisk += 24;
      if (params.drivingStyle === 'Normal') baseRisk += 8;

      // Load impact
      if (params.vehicleLoad === 'Heavy') baseRisk += 16;
      if (params.vehicleLoad === 'Medium') baseRisk += 8;

      const riskScore = Math.min(98, Math.max(12, baseRisk));
      const successProbability = Math.max(25, 100 - Math.round(riskScore * 0.4));

      // Battery consumption calculation
      let consumptionRate = 0.18; // % per km base
      if (params.roadType === 'Mountain') consumptionRate *= 1.4;
      if (params.drivingStyle === 'Aggressive') consumptionRate *= 1.3;
      if (params.vehicleLoad === 'Heavy') consumptionRate *= 1.25;
      if (params.weather === 'Hot' || params.weather === 'Cold') consumptionRate *= 1.15;

      const batteryConsumed = Math.round(params.distanceKm * consumptionRate);
      const arrivalBattery = Math.max(0, params.currentBatteryLevel - batteryConsumed);

      const stressBattery = params.weather === 'Hot' || params.drivingStyle === 'Aggressive' ? 'High' : 'Medium';
      const stressBrakes = params.roadType === 'Mountain' || params.drivingStyle === 'Aggressive' ? 'High' : 'Medium';

      setResult({
        riskScore,
        successProbability,
        predictedBatteryConsumption: Math.min(100, batteryConsumed),
        componentStress: {
          battery: stressBattery,
          brakes: stressBrakes,
          motor: params.roadType === 'Mountain' ? 'High' : 'Medium',
          tyres: params.vehicleLoad === 'Heavy' ? 'High' : 'Low'
        },
        possibleFailure:
          arrivalBattery < 10
            ? 'Critical battery depletion before reaching destination'
            : riskScore > 65
            ? 'Battery thermal throttling under steep load'
            : undefined,
        estimatedArrivalBattery: arrivalBattery,
        routeSafety: riskScore > 70 ? 'Moderate' : riskScore > 85 ? 'Hazardous' : 'High',
        maintenanceRecommendation:
          arrivalBattery < 15
            ? 'Mandatory fast charging stop recommended along route (Kilometer 85).'
            : 'Inspect battery thermal cooling system & inflate tyres before departure.'
      });

      setIsCalculating(false);
    }, 600);
  };

  const handleReset = () => {
    setParams({
      startLocation: 'Mumbai Central',
      destination: 'Pune City Center',
      distanceKm: 150,
      weather: 'Clear',
      roadType: 'Highway',
      drivingStyle: 'Normal',
      vehicleLoad: 'Medium',
      currentBatteryLevel: 80
    });
    setResult(null);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="bg-navy-900 p-5 rounded-2xl border border-navy-700 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Navigation className="w-6 h-6 text-cyan-400" /> AI Journey Risk Simulator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate future trip stress parameters and predict battery depletion & component stress before departing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (5 cols) */}
        <form onSubmit={handleSimulate} className="lg:col-span-5 bg-navy-900 rounded-2xl border border-navy-700 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" /> Route & Vehicle Parameters
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Start Location</label>
              <input
                type="text"
                value={params.startLocation}
                onChange={e => setParams({ ...params, startLocation: e.target.value })}
                className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Destination</label>
              <input
                type="text"
                value={params.destination}
                onChange={e => setParams({ ...params, destination: e.target.value })}
                className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Distance (km)</label>
              <input
                type="number"
                value={params.distanceKm}
                onChange={e => setParams({ ...params, distanceKm: Number(e.target.value) })}
                className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                required
                min={1}
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Current Battery (%)</label>
              <input
                type="number"
                value={params.currentBatteryLevel}
                onChange={e => setParams({ ...params, currentBatteryLevel: Number(e.target.value) })}
                className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold focus:border-cyan-400 outline-none"
                required
                min={5}
                max={100}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Weather Condition</label>
              <select
                value={params.weather}
                onChange={e => setParams({ ...params, weather: e.target.value as any })}
                className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
              >
                <option value="Clear">Clear</option>
                <option value="Rainy">Rainy</option>
                <option value="Hot">Hot</option>
                <option value="Cold">Cold</option>
                <option value="Foggy">Foggy</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Road Type</label>
              <select
                value={params.roadType}
                onChange={e => setParams({ ...params, roadType: e.target.value as any })}
                className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
              >
                <option value="City">City</option>
                <option value="Highway">Highway</option>
                <option value="Mountain">Mountain</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Driving Style</label>
              <select
                value={params.drivingStyle}
                onChange={e => setParams({ ...params, drivingStyle: e.target.value as any })}
                className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
              >
                <option value="Eco">Eco</option>
                <option value="Normal">Normal</option>
                <option value="Aggressive">Aggressive</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Vehicle Load</label>
              <select
                value={params.vehicleLoad}
                onChange={e => setParams({ ...params, vehicleLoad: e.target.value as any })}
                className="w-full bg-navy-850 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
              >
                <option value="Light">Light</option>
                <option value="Medium">Medium</option>
                <option value="Heavy">Heavy</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex space-x-3">
            <button
              type="submit"
              disabled={isCalculating}
              className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-extrabold rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow-glow-cyan"
            >
              {isCalculating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                  <span>Calculating...</span>
                </div>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Simulate Journey</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-3 bg-navy-800 hover:bg-navy-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center space-x-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </form>

        {/* Results Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Gauges Overview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Risk Score */}
                <div className="p-4 bg-navy-900 rounded-2xl border border-amber-500/30 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Journey Risk Score</span>
                  <div className="text-4xl font-black text-amber-400 font-mono mt-2">{result.riskScore}/100</div>
                  <span className="mt-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    {result.riskScore > 70 ? 'High Risk' : 'Moderate'}
                  </span>
                </div>

                {/* Success Probability */}
                <div className="p-4 bg-navy-900 rounded-2xl border border-emerald-500/30 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Success Probability</span>
                  <div className="text-4xl font-black text-emerald-400 font-mono mt-2">{result.successProbability}%</div>
                  <span className="mt-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    High Confidence
                  </span>
                </div>

                {/* Est Arrival Battery */}
                <div className="p-4 bg-navy-900 rounded-2xl border border-cyan-500/30 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Arrival Battery</span>
                  <div className="text-4xl font-black text-cyan-400 font-mono mt-2">{result.estimatedArrivalBattery}%</div>
                  <span className="mt-1 text-xs font-bold text-slate-300 font-mono">
                    (-{result.predictedBatteryConsumption}% Used)
                  </span>
                </div>
              </div>

              {/* Stress Breakdown & Failure Warnings */}
              <div className="bg-navy-900 rounded-2xl border border-navy-700 p-6 space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" /> Component Stress Analysis
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-navy-850 rounded-xl border border-navy-700 flex justify-between items-center">
                    <span className="text-xs text-slate-300 font-medium">Battery Pack Stress</span>
                    <span className="text-xs font-bold text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/30">
                      {result.componentStress.battery}
                    </span>
                  </div>

                  <div className="p-3 bg-navy-850 rounded-xl border border-navy-700 flex justify-between items-center">
                    <span className="text-xs text-slate-300 font-medium">Brake System Stress</span>
                    <span className="text-xs font-bold text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/30">
                      {result.componentStress.brakes}
                    </span>
                  </div>

                  <div className="p-3 bg-navy-850 rounded-xl border border-navy-700 flex justify-between items-center">
                    <span className="text-xs text-slate-300 font-medium">Motor Thermal Load</span>
                    <span className="text-xs font-bold text-cyan-400 px-2 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/30">
                      {result.componentStress.motor}
                    </span>
                  </div>

                  <div className="p-3 bg-navy-850 rounded-xl border border-navy-700 flex justify-between items-center">
                    <span className="text-xs text-slate-300 font-medium">Tyre Friction Wear</span>
                    <span className="text-xs font-bold text-cyan-400 px-2 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/30">
                      {result.componentStress.tyres}
                    </span>
                  </div>
                </div>

                {/* Possible Failure Banner */}
                {result.possibleFailure && (
                  <div className="p-4 bg-critical/10 border border-critical/40 rounded-xl flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-critical shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-critical uppercase tracking-wider">Potential Failure Risk</div>
                      <div className="text-xs text-white mt-0.5 font-medium">{result.possibleFailure}</div>
                    </div>
                  </div>
                )}

                {/* Prescriptive Recommendation Box */}
                <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> AI Pre-Departure Recommendation
                  </div>
                  <p className="text-xs text-slate-200 font-medium">{result.maintenanceRecommendation}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-navy-900 rounded-2xl border border-navy-700 p-12 text-center text-slate-400 space-y-3">
              <Gauge className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-medium">Set route parameters and click "Simulate Journey" to run trip digital twin prognosis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
