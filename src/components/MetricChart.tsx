import React from 'react';
import { TimeRangeSelector } from './TimeRangeSelector';

interface MetricChartProps {
  title: string;
  timeRange: string;
  onRangeChange: (range: string) => void;
  data: { date: string; value: number }[];
  unit?: string;
}

export const MetricChart: React.FC<MetricChartProps> = ({
  title,
  timeRange,
  onRangeChange,
  data,
  unit,
}) => {
  // This is a simplified chart representation
  const max = Math.max(...data.map(d => d.value));
  
  return (
    <div>
      <TimeRangeSelector selectedRange={timeRange} onRangeChange={onRangeChange} />
      <div className="bg-white p-4 rounded-lg">
        <div className="h-64 flex items-end space-x-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center"
            >
              <div
                className="w-full bg-blue-500 rounded-t"
                style={{
                  height: `${(item.value / max) * 100}%`,
                  minHeight: '4px'
                }}
              ></div>
              <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                {new Date(item.date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};