import { useState, useEffect } from 'react';
import { SleepData, RecoveryData } from '../types/health';
import { HealthKitService } from '../services/healthkit';

export function useHealthKit() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [recoveryData, setRecoveryData] = useState<RecoveryData[]>([]);

  useEffect(() => {
    // Check if running in iOS WebView
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isWebView = window.webkit?.messageHandlers?.healthKit;
    setIsAvailable(isIOS && !!isWebView);
    setIsLoading(false);
  }, []);

  const requestAuthorization = async () => {
    if (!isAvailable) {
      setError('HealthKit is not available. Please ensure you are using the iOS app.');
      return false;
    }

    try {
      setIsLoading(true);
      const healthKit = HealthKitService.getInstance();
      const authorized = await healthKit.requestAuthorization();
      setIsAuthorized(authorized);
      
      if (authorized) {
        const [sleep, recovery] = await Promise.all([
          healthKit.fetchSleepData(),
          healthKit.fetchRecoveryData()
        ]);

        setSleepData(sleep);
        setRecoveryData(recovery);
      }
      
      return authorized;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to authorize HealthKit');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    if (!isAuthorized || !isAvailable) return;
    
    setIsLoading(true);
    try {
      const healthKit = HealthKitService.getInstance();
      const [sleep, recovery] = await Promise.all([
        healthKit.fetchSleepData(),
        healthKit.fetchRecoveryData()
      ]);

      setSleepData(sleep);
      setRecoveryData(recovery);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAvailable,
    isAuthorized,
    isLoading,
    error,
    sleepData,
    recoveryData,
    refreshData,
    requestAuthorization
  };
}