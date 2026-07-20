import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { BackgroundVideo } from './components/common/BackgroundVideo';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ExplainableAIDrawer } from './components/common/ExplainableAIDrawer';
import { DashboardPage } from './pages/DashboardPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { JourneySimulatorPage } from './pages/JourneySimulatorPage';
import { DiagnosticsPage } from './pages/DiagnosticsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

const MainLayout: React.FC = () => {
  const { currentNav, activeXAI, closeXAI } = useApp();

  const renderPage = () => {
    switch (currentNav) {
      case 'dashboard':
        return <DashboardPage />;
      case 'digital-twin':
        return <DigitalTwinPage />;
      case 'journey-simulator':
        return <JourneySimulatorPage />;
      case 'diagnostics':
        return <DiagnosticsPage />;
      case 'maintenance':
        return <MaintenancePage />;
      case 'alerts':
        return <AlertsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Reusable Page-Playlist Full-Screen Cinematic Video Background */}
      <BackgroundVideo />

      {/* Main UI Container */}
      <div className="relative z-10 flex flex-col h-screen overflow-hidden bg-transparent">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-transparent">
            {renderPage()}
          </main>
        </div>
      </div>

      {/* Global Explainable AI Side Drawer */}
      <ExplainableAIDrawer data={activeXAI} onClose={closeXAI} />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
