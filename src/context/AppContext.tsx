import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Vehicle,
  TelemetryPoint,
  ComponentHealth,
  MaintenanceItem,
  AlertItem,
  AppSettings,
  ExplainableAIData
} from '../types';
import {
  MOCK_VEHICLES,
  INITIAL_TELEMETRY,
  GENERATE_INITIAL_HISTORY,
  INITIAL_COMPONENTS,
  INITIAL_MAINTENANCE,
  INITIAL_ALERTS,
  DEFAULT_SETTINGS
} from '../data/mockData';

interface AppContextType {
  currentVehicle: Vehicle;
  setCurrentVehicleId: (id: string) => void;
  vehicles: Vehicle[];
  telemetry: TelemetryPoint;
  telemetryHistory: TelemetryPoint[];
  isSimulating: boolean;
  toggleSimulation: () => void;
  components: ComponentHealth[];
  maintenanceList: MaintenanceItem[];
  scheduleMaintenance: (item: Partial<MaintenanceItem>) => void;
  markMaintenanceCompleted: (id: string) => void;
  dismissMaintenance: (id: string) => void;
  alerts: AlertItem[];
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetAllData: () => void;
  activeXAI: ExplainableAIData | null;
  openXAI: (data: ExplainableAIData) => void;
  closeXAI: () => void;
  currentNav: string;
  setCurrentNav: (nav: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  SETTINGS: 'atg_settings',
  MAINTENANCE: 'atg_maintenance',
  ALERTS: 'atg_alerts',
  VEHICLE_ID: 'atg_vehicle_id'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentNav, setCurrentNav] = useState<string>('dashboard');

  // Vehicles
  const [vehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [currentVehicleId, setCurrentVehicleIdState] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.VEHICLE_ID) || 'ATG-7821';
  });

  const currentVehicle = vehicles.find(v => v.id === currentVehicleId) || vehicles[0];

  const setCurrentVehicleId = (id: string) => {
    setCurrentVehicleIdState(id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.VEHICLE_ID, id);
  };

  // Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    });
  };

  // Telemetry & Live Simulation State
  const [telemetry, setTelemetry] = useState<TelemetryPoint>(INITIAL_TELEMETRY);
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>(GENERATE_INITIAL_HISTORY());
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Components State
  const [components] = useState<ComponentHealth[]>(INITIAL_COMPONENTS);

  // Maintenance State
  const [maintenanceList, setMaintenanceList] = useState<MaintenanceItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.MAINTENANCE);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_MAINTENANCE;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.MAINTENANCE, JSON.stringify(maintenanceList));
  }, [maintenanceList]);

  // Alerts State
  const [alerts, setAlerts] = useState<AlertItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ALERTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ALERTS;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  }, [alerts]);

  // Explainable AI Drawer State
  const [activeXAI, setActiveXAI] = useState<ExplainableAIData | null>(null);

  const openXAI = (data: ExplainableAIData) => setActiveXAI(data);
  const closeXAI = () => setActiveXAI(null);

  // Live simulation ticker
  useEffect(() => {
    if (!isSimulating) return;

    const intervalTime = (settings.updateFrequencySec || 3) * 1000;
    const timer = setInterval(() => {
      setTelemetry(prev => {
        const now = Date.now();
        const timeStr = new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        // Dynamic fluctuation
        const speedDelta = Math.sin(now / 2000) * 8;
        const newSpeed = Math.max(30, Math.min(120, Math.round(64 + speedDelta + (Math.random() * 4 - 2))));
        const newRpm = Math.max(1200, Math.min(4500, Math.round(newSpeed * 34.3 + (Math.random() * 120 - 60))));
        const newEngineTemp = Math.round(92 + Math.sin(now / 5000) * 3 + (Math.random() * 1.5 - 0.75));
        const newCoolantTemp = Math.round(88 + Math.sin(now / 5000) * 2);
        const newBatteryTemp = Number((48 + Math.sin(now / 4000) * 1.5).toFixed(1));
        const newTyrePressure = Number((32 + (Math.random() * 0.4 - 0.2)).toFixed(1));
        const newVibration = Number((1.4 + (Math.random() * 0.2 - 0.1)).toFixed(2));
        
        const newPoint: TelemetryPoint = {
          time: timeStr,
          timestamp: now,
          overallHealth: 87,
          batteryHealth: 62,
          engineTemp: newEngineTemp,
          tyrePressure: newTyrePressure,
          brakeHealth: 78,
          speed: newSpeed,
          rpm: newRpm,
          coolantTemp: newCoolantTemp,
          batteryTemp: newBatteryTemp,
          vibration: newVibration,
          fuelBatteryLevel: Math.max(15, prev.fuelBatteryLevel - 0.05)
        };

        // Append to history, keeping max 20 points
        setTelemetryHistory(h => [...h.slice(-19), newPoint]);

        return newPoint;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isSimulating, settings.updateFrequencySec]);

  const toggleSimulation = () => setIsSimulating(prev => !prev);

  // Maintenance Handlers
  const scheduleMaintenance = (item: Partial<MaintenanceItem>) => {
    const newItem: MaintenanceItem = {
      id: `maint-${Date.now()}`,
      title: item.title || 'Scheduled Service',
      component: item.component || 'General Inspection',
      category: 'Upcoming',
      predictedDate: item.scheduledDate || new Date().toISOString().split('T')[0],
      remainingUsefulLife: 'Scheduled',
      priority: item.priority || 'Medium',
      estimatedCost: item.estimatedCost || 5000,
      vehicleDowntime: item.vehicleDowntime || '2 hours',
      reason: item.reason || 'Manual service booking',
      scheduledDate: item.scheduledDate,
      scheduledTime: item.scheduledTime,
      serviceCenter: item.serviceCenter,
      notes: item.notes
    };

    setMaintenanceList(prev => [newItem, ...prev]);
  };

  const markMaintenanceCompleted = (id: string) => {
    setMaintenanceList(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              category: 'Completed',
              completedDate: new Date().toISOString().split('T')[0],
              remainingUsefulLife: 'Done'
            }
          : item
      )
    );
  };

  const dismissMaintenance = (id: string) => {
    setMaintenanceList(prev => prev.filter(item => item.id !== id));
  };

  // Alert Handlers
  const acknowledgeAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'Acknowledged' } : a))
    );
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'Resolved' } : a))
    );
  };

  const resetAllData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.MAINTENANCE);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ALERTS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.VEHICLE_ID);

    setSettings(DEFAULT_SETTINGS);
    setMaintenanceList(INITIAL_MAINTENANCE);
    setAlerts(INITIAL_ALERTS);
    setCurrentVehicleIdState('ATG-7821');
    setTelemetry(INITIAL_TELEMETRY);
    setTelemetryHistory(GENERATE_INITIAL_HISTORY());
  };

  return (
    <AppContext.Provider
      value={{
        currentVehicle,
        setCurrentVehicleId,
        vehicles,
        telemetry,
        telemetryHistory,
        isSimulating,
        toggleSimulation,
        components,
        maintenanceList,
        scheduleMaintenance,
        markMaintenanceCompleted,
        dismissMaintenance,
        alerts,
        acknowledgeAlert,
        resolveAlert,
        settings,
        updateSettings,
        resetAllData,
        activeXAI,
        openXAI,
        closeXAI,
        currentNav,
        setCurrentNav
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
