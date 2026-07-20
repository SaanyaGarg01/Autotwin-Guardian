export type NavPage = 
  | 'dashboard'
  | 'digital-twin'
  | 'journey-simulator'
  | 'diagnostics'
  | 'maintenance'
  | 'alerts'
  | 'reports'
  | 'settings';

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  year: number;
  vin: string;
  status: 'Connected' | 'Disconnected' | 'Diagnosing';
  batteryCapacity: number; // kWh
  totalOdometer: number; // km
}

export interface TelemetryPoint {
  time: string;
  timestamp: number;
  overallHealth: number;
  batteryHealth: number;
  engineTemp: number; // °C
  tyrePressure: number; // PSI
  brakeHealth: number;
  speed: number; // km/h
  rpm: number;
  coolantTemp: number; // °C
  batteryTemp: number; // °C
  vibration: number; // m/s²
  fuelBatteryLevel: number; // %
}

export type ComponentId = 
  | 'battery'
  | 'motor'
  | 'brakes'
  | 'front-tyres'
  | 'rear-tyres'
  | 'cooling-system'
  | 'transmission';

export interface ComponentHealth {
  id: ComponentId;
  name: string;
  health: number; // %
  status: 'Healthy' | 'Warning' | 'Critical';
  failureProbability: number; // %
  remainingUsefulLife: number; // Days or km
  rulUnit: 'days' | 'km';
  temperature: number; // °C
  lastServiceDate: string;
  actionRequired: string;
  sensorReadings: {
    label: string;
    value: string | number;
    status: 'normal' | 'warning' | 'critical';
  }[];
  explanation?: ExplainableAIData;
}

export interface ExplainableAIData {
  prediction: string;
  mainContributingFactors: { factor: string; impact: string; percentage: number }[];
  supportingSensors: { name: string; value: string; expected: string }[];
  confidenceScore: number; // %
  rootCause: string;
  recommendedAction: string;
  estimatedCost: number; // INR ₹
  urgency: 'Low' | 'Medium' | 'High' | 'Immediate';
}

export interface JourneyParams {
  startLocation: string;
  destination: string;
  distanceKm: number;
  weather: 'Clear' | 'Rainy' | 'Hot' | 'Cold' | 'Foggy';
  roadType: 'City' | 'Highway' | 'Mountain' | 'Mixed';
  drivingStyle: 'Eco' | 'Normal' | 'Aggressive';
  vehicleLoad: 'Light' | 'Medium' | 'Heavy';
  currentBatteryLevel: number; // %
}

export interface JourneyResult {
  riskScore: number; // 0-100
  successProbability: number; // %
  predictedBatteryConsumption: number; // %
  componentStress: {
    battery: 'Low' | 'Medium' | 'High' | 'Severe';
    brakes: 'Low' | 'Medium' | 'High' | 'Severe';
    motor: 'Low' | 'Medium' | 'High' | 'Severe';
    tyres: 'Low' | 'Medium' | 'High' | 'Severe';
  };
  possibleFailure?: string;
  estimatedArrivalBattery: number; // %
  routeSafety: 'High' | 'Moderate' | 'Low' | 'Hazardous';
  maintenanceRecommendation: string;
}

export interface DiagnosticResult {
  id: string;
  component: string;
  status: 'Healthy' | 'Warning' | 'Critical';
  errorCode?: string;
  issue?: string;
  severity: 'None' | 'Low' | 'Medium' | 'High' | 'Critical';
  confidenceScore: number; // %
  rootCause?: string;
  recommendedAction?: string;
}

export interface MaintenanceItem {
  id: string;
  title: string;
  component: string;
  category: 'Upcoming' | 'AI-Predicted' | 'Completed' | 'Overdue';
  predictedDate: string;
  remainingUsefulLife: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  estimatedCost: number; // ₹
  vehicleDowntime: string; // e.g. "2 hours"
  reason: string;
  scheduledDate?: string;
  scheduledTime?: string;
  serviceCenter?: string;
  notes?: string;
  completedDate?: string;
}

export interface CounterfactualScenario {
  id: string;
  title: string;
  description: string;
  riskScore: number; // %
  failureProbability: number; // %
  estimatedCost: number; // ₹
  additionalLife: string; // e.g. "+120 days" or "-15 days"
  safetyLevel: 'Low' | 'Medium' | 'High' | 'Optimal';
  isRecommended: boolean;
}

export interface AlertItem {
  id: string;
  timestamp: string;
  severity: 'Critical' | 'Warning' | 'Information';
  component: string;
  title: string;
  description: string;
  recommendedAction: string;
  status: 'Unacknowledged' | 'Acknowledged' | 'Resolved';
  explanation?: ExplainableAIData;
}

export interface AppSettings {
  vehicleName: string;
  vehicleId: string;
  speedUnit: 'km/h' | 'mph';
  tempUnit: '°C' | '°F';
  updateFrequencySec: number;
  criticalAlertThreshold: number; // %
  notificationsEnabled: boolean;
  soundAlerts: boolean;
}
