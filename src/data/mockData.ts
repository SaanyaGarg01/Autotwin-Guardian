import {
  Vehicle,
  TelemetryPoint,
  ComponentHealth,
  MaintenanceItem,
  AlertItem,
  CounterfactualScenario,
  AppSettings,
  ExplainableAIData
} from '../types';

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'ATG-7821',
    name: 'Tata NexDrive EV Pro',
    model: 'NexDrive EV 750',
    year: 2025,
    vin: 'MATG7821X90214812',
    status: 'Connected',
    batteryCapacity: 72,
    totalOdometer: 34280
  },
  {
    id: 'ATG-3042',
    name: 'Tata Harrier Fleet X',
    model: 'Harrier XZA+ Diesel',
    year: 2024,
    vin: 'MATG3042X81729011',
    status: 'Connected',
    batteryCapacity: 60,
    totalOdometer: 58120
  },
  {
    id: 'ATG-9910',
    name: 'Tata Avinya AI Twin',
    model: 'Avinya Concept Dual Motor',
    year: 2026,
    vin: 'MATG9910X11094857',
    status: 'Connected',
    batteryCapacity: 95,
    totalOdometer: 12450
  }
];

export const INITIAL_TELEMETRY: TelemetryPoint = {
  time: new Date().toLocaleTimeString(),
  timestamp: Date.now(),
  overallHealth: 87,
  batteryHealth: 62,
  engineTemp: 92,
  tyrePressure: 32,
  brakeHealth: 78,
  speed: 64,
  rpm: 2200,
  coolantTemp: 88,
  batteryTemp: 48,
  vibration: 1.4,
  fuelBatteryLevel: 68
};

// History of telemetry points for Recharts area/line charts
export const GENERATE_INITIAL_HISTORY = (): TelemetryPoint[] => {
  const history: TelemetryPoint[] = [];
  const now = Date.now();
  for (let i = 15; i >= 0; i--) {
    const timeSec = new Date(now - i * 3000);
    const timeStr = timeSec.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    history.push({
      time: timeStr,
      timestamp: now - i * 3000,
      overallHealth: Math.min(100, Math.max(80, 87 + Math.floor(Math.sin(i) * 2))),
      batteryHealth: 62,
      engineTemp: Math.min(105, Math.max(85, 92 + Math.floor(Math.sin(i * 0.8) * 4))),
      tyrePressure: Number((32 + (Math.random() * 0.4 - 0.2)).toFixed(1)),
      brakeHealth: 78,
      speed: Math.max(0, Math.round(64 + Math.sin(i * 0.5) * 12 + (Math.random() * 4 - 2))),
      rpm: Math.max(800, Math.round(2200 + Math.sin(i * 0.5) * 400 + (Math.random() * 100 - 50))),
      coolantTemp: Math.round(88 + Math.sin(i * 0.4) * 3),
      batteryTemp: Number((48 + Math.sin(i * 0.3) * 2).toFixed(1)),
      vibration: Number((1.4 + Math.random() * 0.3 - 0.15).toFixed(2)),
      fuelBatteryLevel: Math.max(10, Math.round(68 - i * 0.1))
    });
  }
  return history;
};

// Explainable AI Samples
export const BATTERY_XAI_EXPLANATION: ExplainableAIData = {
  prediction: 'Accelerated battery cell degradation projected within 18 days',
  mainContributingFactors: [
    { factor: 'Elevated Operating Temperature', impact: 'High Thermal Stress', percentage: 42 },
    { factor: 'Cell Voltage Deviation', impact: 'Unbalanced Discharge', percentage: 28 },
    { factor: 'Fast DC Charging Cycles', impact: 'Dendrite Growth Risk', percentage: 18 },
    { factor: 'Internal Resistance Rise', impact: 'Ohmic Heating', percentage: 12 }
  ],
  supportingSensors: [
    { name: 'Pack Temp Sensor #3', value: '48.2 °C', expected: '< 38.0 °C' },
    { name: 'Cell #14 Voltage Delta', value: '8.2%', expected: '< 2.5%' },
    { name: 'Fast Charging Count (30d)', value: '37 cycles', expected: '< 15 cycles' },
    { name: 'Coolant Flow Rate', value: '2.1 L/min', expected: '> 3.8 L/min' }
  ],
  confidenceScore: 97,
  rootCause: 'Frequent fast charging combined with reduced coolant pump efficiency led to thermal throttling and unbalanced cell wear.',
  recommendedAction: 'Inspect battery thermal management loop, flush coolant channel, and execute cell rebalancing sequence.',
  estimatedCost: 18000,
  urgency: 'High'
};

export const BRAKE_XAI_EXPLANATION: ExplainableAIData = {
  prediction: 'Front left brake pad wear reaching critical threshold in ~450 km',
  mainContributingFactors: [
    { factor: 'Acoustic Wear Sensor Spike', impact: 'Pad Friction Layer Depleted', percentage: 55 },
    { factor: 'Rotor Temperature Peak', impact: 'Thermal Dissipation Fatigue', percentage: 25 },
    { factor: 'Regen Braking Blending', impact: 'Hydraulic Bias Offset', percentage: 20 }
  ],
  supportingSensors: [
    { name: 'Front Left Pad Thickness', value: '3.2 mm', expected: '> 5.0 mm' },
    { name: 'Rotor Temp Peak', value: '210 °C', expected: '< 160 °C' },
    { name: 'Brake Fluid Moisture', value: '2.8%', expected: '< 1.5%' }
  ],
  confidenceScore: 92,
  rootCause: 'Aggressive downhill braking and uneven hydraulic distribution accelerated friction pad erosion.',
  recommendedAction: 'Replace front axle brake pad set and bleed hydraulic brake lines.',
  estimatedCost: 6500,
  urgency: 'Medium'
};

export const INITIAL_COMPONENTS: ComponentHealth[] = [
  {
    id: 'battery',
    name: 'HV Battery Pack',
    health: 62,
    status: 'Warning',
    failureProbability: 28,
    remainingUsefulLife: 18,
    rulUnit: 'days',
    temperature: 48,
    lastServiceDate: '2025-11-10',
    actionRequired: 'Inspect battery cooling system & execute cell rebalancing',
    sensorReadings: [
      { label: 'Pack Temp', value: '48°C', status: 'warning' },
      { label: 'State of Health (SOH)', value: '62%', status: 'warning' },
      { label: 'Cell Voltage Variance', value: '8.2%', status: 'warning' },
      { label: 'Coolant Flow', value: '2.1 L/min', status: 'critical' }
    ],
    explanation: BATTERY_XAI_EXPLANATION
  },
  {
    id: 'motor',
    name: 'Electric Traction Motor',
    health: 94,
    status: 'Healthy',
    failureProbability: 4,
    remainingUsefulLife: 320,
    rulUnit: 'days',
    temperature: 65,
    lastServiceDate: '2026-02-15',
    actionRequired: 'Normal operating condition. Schedule routine check at 40,000 km.',
    sensorReadings: [
      { label: 'Stator Temp', value: '65°C', status: 'normal' },
      { label: 'Inverter Efficiency', value: '96.8%', status: 'normal' },
      { label: 'Bearing Vibration', value: '0.8 m/s²', status: 'normal' },
      { label: 'Torque Output', value: '310 Nm', status: 'normal' }
    ]
  },
  {
    id: 'brakes',
    name: 'Brake System & Pads',
    health: 78,
    status: 'Healthy',
    failureProbability: 12,
    remainingUsefulLife: 450,
    rulUnit: 'km',
    temperature: 110,
    lastServiceDate: '2025-09-04',
    actionRequired: 'Monitor front-left brake pad thickness during next scheduled inspection.',
    sensorReadings: [
      { label: 'Front Pad Thickness', value: '3.2 mm', status: 'warning' },
      { label: 'Rear Pad Thickness', value: '6.8 mm', status: 'normal' },
      { label: 'Brake Fluid Moisture', value: '2.8%', status: 'warning' },
      { label: 'Pedal Pressure Delta', value: '2.1%', status: 'normal' }
    ],
    explanation: BRAKE_XAI_EXPLANATION
  },
  {
    id: 'front-tyres',
    name: 'Front Tyres & Alignment',
    health: 82,
    status: 'Healthy',
    failureProbability: 8,
    remainingUsefulLife: 6200,
    rulUnit: 'km',
    temperature: 36,
    lastServiceDate: '2026-01-20',
    actionRequired: 'Maintain 32 PSI pressure. Alignment check recommended in 2,000 km.',
    sensorReadings: [
      { label: 'Front Left Pressure', value: '32.1 PSI', status: 'normal' },
      { label: 'Front Right Pressure', value: '31.8 PSI', status: 'normal' },
      { label: 'Tread Depth', value: '5.2 mm', status: 'normal' },
      { label: 'Wheel Balance', value: 'Optimal', status: 'normal' }
    ]
  },
  {
    id: 'rear-tyres',
    name: 'Rear Tyres & Suspension',
    health: 89,
    status: 'Healthy',
    failureProbability: 5,
    remainingUsefulLife: 9800,
    rulUnit: 'km',
    temperature: 34,
    lastServiceDate: '2026-01-20',
    actionRequired: 'Tire condition optimal.',
    sensorReadings: [
      { label: 'Rear Left Pressure', value: '32.0 PSI', status: 'normal' },
      { label: 'Rear Right Pressure', value: '32.2 PSI', status: 'normal' },
      { label: 'Tread Depth', value: '6.1 mm', status: 'normal' },
      { label: 'Damper Absorption', value: '94%', status: 'normal' }
    ]
  },
  {
    id: 'cooling-system',
    name: 'Thermal Management & Cooling',
    health: 71,
    status: 'Warning',
    failureProbability: 22,
    remainingUsefulLife: 24,
    rulUnit: 'days',
    temperature: 88,
    lastServiceDate: '2025-08-12',
    actionRequired: 'Coolant pump flow rate sub-optimal (2.1 L/min). Inspect radiator fan & lines.',
    sensorReadings: [
      { label: 'Coolant Temp', value: '88°C', status: 'warning' },
      { label: 'Pump Flow Rate', value: '2.1 L/min', status: 'critical' },
      { label: 'Radiator Pressure', value: '1.2 bar', status: 'normal' },
      { label: 'Fan Duty Cycle', value: '85%', status: 'warning' }
    ]
  },
  {
    id: 'transmission',
    name: 'Single-Speed Gearbox',
    health: 96,
    status: 'Healthy',
    failureProbability: 2,
    remainingUsefulLife: 500,
    rulUnit: 'days',
    temperature: 58,
    lastServiceDate: '2025-05-18',
    actionRequired: 'Gearbox lubrication and gear engagement parameters nominal.',
    sensorReadings: [
      { label: 'Fluid Temp', value: '58°C', status: 'normal' },
      { label: 'Acoustic Signature', value: 'Normal', status: 'normal' },
      { label: 'Chip Detector Sensor', value: 'Clear', status: 'normal' },
      { label: 'Efficiency Ratio', value: '98.5%', status: 'normal' }
    ]
  }
];

export const INITIAL_MAINTENANCE: MaintenanceItem[] = [
  {
    id: 'maint-101',
    title: 'Battery Cooling System Inspection',
    component: 'HV Battery Pack',
    category: 'AI-Predicted',
    predictedDate: '2026-08-07',
    remainingUsefulLife: '18 days',
    priority: 'High',
    estimatedCost: 18000,
    vehicleDowntime: '3 hours',
    reason: 'Frequent battery thermal spikes & coolant pump flow degradation detected by AI model.',
    serviceCenter: 'Tata Motors Authorized EV Service Hub, Sector 62',
  },
  {
    id: 'maint-102',
    title: 'Front Brake Pad Set Replacement',
    component: 'Brake System & Pads',
    category: 'Upcoming',
    predictedDate: '2026-08-25',
    remainingUsefulLife: '450 km',
    priority: 'Medium',
    estimatedCost: 6500,
    vehicleDowntime: '1.5 hours',
    reason: 'Front pad thickness at 3.2mm; wear sensor triggering preventative replacement alert.',
    serviceCenter: 'Tata Motors Authorized EV Service Hub, Sector 62',
  },
  {
    id: 'maint-103',
    title: '4-Wheel Tyre Rotation & Balancing',
    component: 'Front & Rear Tyres',
    category: 'Upcoming',
    predictedDate: '2026-09-12',
    remainingUsefulLife: '2,000 km',
    priority: 'Low',
    estimatedCost: 2200,
    vehicleDowntime: '1 hour',
    reason: 'Standard 10,000 km wear equalization schedule for electric drive torque.',
  },
  {
    id: 'maint-104',
    title: 'Coolant Pump Flush & Refill',
    component: 'Thermal Management System',
    category: 'AI-Predicted',
    predictedDate: '2026-08-14',
    remainingUsefulLife: '24 days',
    priority: 'High',
    estimatedCost: 8500,
    vehicleDowntime: '2 hours',
    reason: 'Debris accumulation suspected in primary coolant loop causing 30% flow restriction.',
  },
  {
    id: 'maint-105',
    title: 'High Voltage Junction Box Seal Audit',
    component: 'Electrical System',
    category: 'Completed',
    predictedDate: '2026-06-10',
    remainingUsefulLife: 'Done',
    priority: 'Medium',
    estimatedCost: 4200,
    vehicleDowntime: '2 hours',
    reason: 'Preventative monsoon water resistance sealing inspection.',
    completedDate: '2026-06-10',
    scheduledDate: '2026-06-10',
    serviceCenter: 'Tata EV Tech Center'
  },
  {
    id: 'maint-106',
    title: 'HV AC Compressor Bearing Check',
    component: 'Cooling System',
    category: 'Overdue',
    predictedDate: '2026-07-01',
    remainingUsefulLife: '-19 days',
    priority: 'Urgent',
    estimatedCost: 11200,
    vehicleDowntime: '4 hours',
    reason: 'Bearing vibration frequency out of tolerance by 14%. Overdue for safety inspection.',
  }
];

export const COUNTERFACTUAL_SCENARIOS: CounterfactualScenario[] = [
  {
    id: 'scenario-1',
    title: 'Replace Battery Cooling System Now',
    description: 'Immediate replacement of coolant pump and pack thermal flush.',
    riskScore: 18,
    failureProbability: 4,
    estimatedCost: 18000,
    additionalLife: '+120 days',
    safetyLevel: 'Optimal',
    isRecommended: true
  },
  {
    id: 'scenario-2',
    title: 'Delay Maintenance by 15 Days',
    description: 'Continue operating vehicle with current high thermal loads for 2 more weeks.',
    riskScore: 78,
    failureProbability: 68,
    estimatedCost: 52000,
    additionalLife: '-15 days',
    safetyLevel: 'Low',
    isRecommended: false
  },
  {
    id: 'scenario-3',
    title: 'Reduce Vehicle Payload / Cargo Load by 50%',
    description: 'Limit gross vehicle weight to reduce battery discharge rates and thermal stress.',
    riskScore: 42,
    failureProbability: 26,
    estimatedCost: 0,
    additionalLife: '+35 days',
    safetyLevel: 'Medium',
    isRecommended: false
  },
  {
    id: 'scenario-4',
    title: 'Mandate Eco Driving Mode Only',
    description: 'Cap acceleration torque to 60% and limit top speed to 80 km/h.',
    riskScore: 35,
    failureProbability: 20,
    estimatedCost: 0,
    additionalLife: '+45 days',
    safetyLevel: 'High',
    isRecommended: false
  },
  {
    id: 'scenario-5',
    title: 'Continue Without Action (Baseline)',
    description: 'No driver intervention or scheduled service.',
    riskScore: 88,
    failureProbability: 82,
    estimatedCost: 85000,
    additionalLife: '0 days (High Risk of Breakdown)',
    safetyLevel: 'Low',
    isRecommended: false
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'ALT-1001',
    timestamp: '2026-07-20 20:45:12',
    severity: 'Warning',
    component: 'HV Battery Pack',
    title: 'Battery degradation detected',
    description: 'Cell #14 voltage variance exceeded 8.2%. Battery SOH down to 62% with elevated thermal readings (48°C).',
    recommendedAction: 'Schedule battery cooling loop inspection and cell balancing within 7 days.',
    status: 'Unacknowledged',
    explanation: BATTERY_XAI_EXPLANATION
  },
  {
    id: 'ALT-1002',
    timestamp: '2026-07-20 19:30:00',
    severity: 'Warning',
    component: 'Brake System & Pads',
    title: 'Brake pad wear increasing',
    description: 'Front left brake pad wear layer thin (3.2mm remaining). Acoustic wear sensor detected minor friction peak.',
    recommendedAction: 'Replace front brake pad set within 450 km.',
    status: 'Unacknowledged',
    explanation: BRAKE_XAI_EXPLANATION
  },
  {
    id: 'ALT-1003',
    timestamp: '2026-07-20 18:12:40',
    severity: 'Information',
    component: 'Front Tyres',
    title: 'Low tyre pressure notification',
    description: 'Front left tyre pressure dropped to 31.2 PSI due to ambient temperature drop.',
    recommendedAction: 'Inflate tyres to recommended pressure of 32.0 PSI.',
    status: 'Acknowledged'
  },
  {
    id: 'ALT-1004',
    timestamp: '2026-07-20 16:05:15',
    severity: 'Critical',
    component: 'Thermal Management',
    title: 'Engine / Motor temperature spike',
    description: 'Coolant flow rate dropped below critical safety limit (2.1 L/min vs 3.8 L/min nominal).',
    recommendedAction: 'Pull over safely if temp exceeds 105°C and inspect coolant fluid level.',
    status: 'Unacknowledged'
  },
  {
    id: 'ALT-1005',
    timestamp: '2026-07-19 11:22:04',
    severity: 'Warning',
    component: 'Cooling System',
    title: 'Cooling efficiency reduced by 30%',
    description: 'AI model detects thermal dissipation delay during high speed driving cycles.',
    recommendedAction: 'Inspect radiator fan shroud and coolant pump flow valve.',
    status: 'Resolved'
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  vehicleName: 'Tata NexDrive EV Pro',
  vehicleId: 'ATG-7821',
  speedUnit: 'km/h',
  tempUnit: '°C',
  updateFrequencySec: 3,
  criticalAlertThreshold: 75,
  notificationsEnabled: true,
  soundAlerts: false
};
