import React, { useState } from 'react';
import { Heart, Activity, Battery } from 'lucide-react';
import { RecoveryData } from '../types/health';
import { DashboardCard } from './DashboardCard';
import { MetricModal } from './MetricModal';
import { MetricChart } from './MetricChart';
import { MetricCard } from './MetricCard';

interface RecoveryMetricsProps {
  data: RecoveryData;
}

export const RecoveryMetrics: React.FC<RecoveryMetricsProps> = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('week');

  // Mock historical data - in a real app, this would come from your API
  const mockHistoricalData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    value: Math.random() * (selectedMetric === 'hrv' ? 100 : selectedMetric === 'restingHr' ? 80 : 100),
  }));

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'restingHr':
        return {
          title: 'Resting Heart Rate',
          data: mockHistoricalData,
          unit: 'bpm',
        };
      case 'hrv':
        return {
          title: 'Heart Rate Variability',
          data: mockHistoricalData,
          unit: 'ms',
        };
      case 'readiness':
        return {
          title: 'Readiness Score',
          data: mockHistoricalData,
          unit: '',
        };
      default:
        return null;
    }
  };

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'optimal': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const metricData = getMetricData();

  return (
    <>
      <DashboardCard title="Recovery Status" className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            icon={Heart}
            label="Resting HR"
            value={data.restingHeartRate}
            unit="bpm"
            iconColor="text-red-600"
            bgColor="bg-red-50"
            onClick={() => setSelectedMetric('restingHr')}
          />
          
          <MetricCard
            icon={Activity}
            label="HRV"
            value={data.hrv}
            unit="ms"
            iconColor="text-indigo-600"
            bgColor="bg-indigo-50"
            onClick={() => setSelectedMetric('hrv')}
          />
          
          <MetricCard
            icon={Battery}
            label="Readiness"
            value={data.readiness}
            iconColor={getReadinessColor(data.readiness)}
            bgColor="bg-emerald-50"
            onClick={() => setSelectedMetric('readiness')}
          />
        </div>
      </DashboardCard>

      {selectedMetric && metricData && (
        <MetricModal
          isOpen={true}
          onClose={() => setSelectedMetric(null)}
          title={metricData.title}
        >
          <MetricChart
            title={metricData.title}
            timeRange={timeRange}
            onRangeChange={setTimeRange}
            data={metricData.data}
            unit={metricData.unit}
          />
        </MetricModal>
      )}
    </>
  );
};