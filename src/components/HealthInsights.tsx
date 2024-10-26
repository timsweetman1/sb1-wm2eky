import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { HealthInsight } from '../types/health';
import { DashboardCard } from './DashboardCard';

interface HealthInsightsProps {
  insights: HealthInsight[];
}

export const HealthInsights: React.FC<HealthInsightsProps> = ({ insights }) => {
  const getInsightIcon = (severity: string) => {
    switch (severity) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getInsightColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <DashboardCard title="Health Insights" className="h-full">
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getInsightColor(insight.severity)}`}
          >
            <div className="flex items-start space-x-3">
              {getInsightIcon(insight.severity)}
              <div>
                <p className="font-medium text-gray-900">{insight.message}</p>
                <p className="text-sm text-gray-600 mt-1">{insight.recommendation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};