import { SleepData, RecoveryData } from '../types/health';

declare global {
  interface Window {
    webkit?: {
      messageHandlers: {
        healthKit: {
          postMessage: (message: any) => void;
        };
      };
    };
  }
}

export class HealthKitService {
  private static instance: HealthKitService;
  private isAvailable: boolean = false;

  private constructor() {
    this.isAvailable = this.checkAvailability();
  }

  static getInstance(): HealthKitService {
    if (!HealthKitService.instance) {
      HealthKitService.instance = new HealthKitService();
    }
    return HealthKitService.instance;
  }

  private checkAvailability(): boolean {
    return !!window.webkit?.messageHandlers?.healthKit;
  }

  async requestAuthorization(): Promise<boolean> {
    if (!this.isAvailable) return false;

    try {
      window.webkit?.messageHandlers.healthKit.postMessage({
        type: 'requestAuthorization',
        dataTypes: [
          'sleepAnalysis',
          'heartRate',
          'restingHeartRate',
          'heartRateVariability',
          'activeEnergy',
          'bodyTemperature'
        ]
      });
      return true;
    } catch (error) {
      console.error('HealthKit authorization failed:', error);
      return false;
    }
  }

  async fetchSleepData(days: number = 7): Promise<SleepData[]> {
    if (!this.isAvailable) throw new Error('HealthKit not available');

    return new Promise((resolve, reject) => {
      window.addEventListener('healthKitSleepData', ((event: CustomEvent) => {
        resolve(event.detail.data);
      }) as EventListener);

      window.webkit?.messageHandlers.healthKit.postMessage({
        type: 'fetchSleepData',
        days
      });
    });
  }

  async fetchRecoveryData(days: number = 7): Promise<RecoveryData[]> {
    if (!this.isAvailable) throw new Error('HealthKit not available');

    return new Promise((resolve, reject) => {
      window.addEventListener('healthKitRecoveryData', ((event: CustomEvent) => {
        resolve(event.detail.data);
      }) as EventListener);

      window.webkit?.messageHandlers.healthKit.postMessage({
        type: 'fetchRecoveryData',
        days
      });
    });
  }
}