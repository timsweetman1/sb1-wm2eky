export interface SleepData {
  date: string;
  duration: number;
  quality: number;
  deepSleepPercentage: number;
  remSleepPercentage: number;
}

export interface RecoveryData {
  date: string;
  score: number;
  hrv: number;
  restingHeartRate: number;
  readiness: 'low' | 'moderate' | 'optimal';
}

export interface HealthInsight {
  type: 'sleep' | 'recovery';
  message: string;
  recommendation: string;
  severity: 'info' | 'warning' | 'success';
}

export interface RecoveryTool {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPercentage?: number;
  affiliateUrl: string;
  category: 'sleep' | 'recovery' | 'nutrition' | 'fitness';
  imageUrl: string;
  rating: number;
  recommendedFor: string[];
}