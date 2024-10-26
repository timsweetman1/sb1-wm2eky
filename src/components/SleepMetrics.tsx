import React, { useState } from 'react';
import { Moon, Timer, Activity } from 'lucide-react';
import { SleepData } from '../types/health';
import { DashboardCard } from './DashboardCard';
import { MetricModal } from './MetricModal';
import { MetricChart } from './MetricChart';
import { MetricCard } from './MetricCard';

interface SleepMetricsProps {
  data: SleepData;
}

export const SleepMetrics: React.FC<SleepMetricsProps> = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('week');

  // Mock historical data - in a real app, this would come from your API
  const mockHistoricalData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    value: Math.random() * (selectedMetric === 'duration' ? 10 : 100),
  }));

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'duration':
        return {
          title: 'Sleep Duration',
          data: mockHistoricalData,
          unit: 'hours',
        };
      case 'deep':
        return {
          title: 'Deep Sleep',
          data: mockHistoricalData,
          unit: '%',
        };
      case 'quality':
        return {
          title: 'Sleep Quality',
          data: mockHistoricalData,
          unit: '%',
        };
      default:
        return null;
    }
  };

  const metricData = getMetricData();

  return (
    <>
      <DashboardCard title="Sleep Overview" className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            icon={Timer}
            label="Duration"
            value={data.duration}
            unit="h"
            iconColor="text-blue-600"
            bgColor="bg-blue-50"
            onClick={() => setSelectedMetric('duration')}
          />
          
          <MetricCard
            icon={Moon}
            label="Deep Sleep"
            value={data.deepSleepPercentage}
            unit="%"
            iconColor="text-purple-600"
            bgColor="bg-purple-50"
            onClick={() => setSelectedMetric('deep')}
          />
          
          <MetricCard
            icon={Activity}
            label="Quality"
            value={data.quality}
            unit="%"
            iconColor="text-green-600"
            bgColor="bg-green-50"
            onClick={() => setSelectedMetric('quality')}
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