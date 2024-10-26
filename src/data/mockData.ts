import { SleepData, RecoveryData, HealthInsight, RecoveryTool } from '../types/health';

// Generate realistic sleep data for the past week
const generateSleepData = (days: number): SleepData[] => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const duration = 6 + Math.random() * 3;
    const quality = Math.round(65 + Math.random() * 30);
    const deepSleep = Math.round(15 + Math.random() * 10);
    const remSleep = Math.round(20 + Math.random() * 10);

    return {
      date: date.toISOString().split('T')[0],
      duration: Number(duration.toFixed(1)),
      quality,
      deepSleepPercentage: deepSleep,
      remSleepPercentage: remSleep,
    };
  });
};

const generateRecoveryData = (days: number): RecoveryData[] => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const score = Math.round(60 + Math.random() * 35);
    const hrv = Math.round(35 + Math.random() * 30);
    const restingHeartRate = Math.round(55 + Math.random() * 15);
    
    let readiness: 'low' | 'moderate' | 'optimal';
    if (score < 70) readiness = 'low';
    else if (score < 85) readiness = 'moderate';
    else readiness = 'optimal';

    return {
      date: date.toISOString().split('T')[0],
      score,
      hrv,
      restingHeartRate,
      readiness,
    };
  });
};

export const mockSleepData = generateSleepData(7);
export const mockRecoveryData = generateRecoveryData(7);

export const mockInsights: HealthInsight[] = [
  {
    type: 'sleep',
    message: 'Your deep sleep has increased by 12% this week',
    recommendation: 'Keep maintaining your consistent bedtime schedule to optimize sleep quality',
    severity: 'success',
  },
  {
    type: 'recovery',
    message: 'HRV trending lower than your baseline',
    recommendation: 'Consider reducing training intensity and focusing on recovery activities',
    severity: 'warning',
  }
];

export const mockRecoveryTools: RecoveryTool[] = [
  {
    id: 'eightsleep-pod3',
    name: 'Eight Sleep Pod 3 Cover',
    description: 'Revolutionary smart mattress cover with dynamic temperature control and advanced sleep tracking. Optimize your sleep with personalized temperature regulation.',
    price: 2045,
    discountPercentage: 17.1, // Represents $350 off
    affiliateUrl: 'https://eightsleep.com',
    category: 'sleep',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=60',
    rating: 4.9,
    recommendedFor: ['temperature_optimization', 'sleep_quality', 'recovery'],
    specialOffer: 'EXCLUSIVE: Save $350 through HealthSync'
  }
];