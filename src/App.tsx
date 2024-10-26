import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Layout, RefreshCw } from 'lucide-react';
import { SleepMetrics } from './components/SleepMetrics';
import { RecoveryMetrics } from './components/RecoveryMetrics';
import { HealthInsights } from './components/HealthInsights';
import { RecoveryTools } from './components/RecoveryTools';
import { HealthChat } from './components/HealthChat';
import { useHealthKit } from './hooks/useHealthKit';
import { mockSleepData, mockRecoveryData, mockInsights, mockRecoveryTools } from './data/mockData';
import { Login } from './components/Login';
import { HealthKitSetup } from './components/HealthKitSetup';

function Dashboard() {
  const { isAuthenticated, logout } = useAuth0();
  const {
    isAuthorized,
    isLoading,
    error,
    sleepData,
    recoveryData,
    refreshData
  } = useHealthKit();

  // Use HealthKit data if available, otherwise fall back to mock data
  const currentSleepData = isAuthorized ? sleepData : mockSleepData;
  const currentRecoveryData = isAuthorized ? recoveryData : mockRecoveryData;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Layout className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">HealthSync</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthorized && (
                <button
                  onClick={refreshData}
                  disabled={isLoading}
                  className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SleepMetrics data={currentSleepData[currentSleepData.length - 1]} />
                <RecoveryMetrics data={currentRecoveryData[currentRecoveryData.length - 1]} />
              </div>
              <HealthInsights insights={mockInsights} />
              <RecoveryTools tools={mockRecoveryTools} />
            </div>
            <div className="lg:col-span-1">
              <HealthChat />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/setup-healthkit" element={
          <ProtectedRoute>
            <HealthKitSetup />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;