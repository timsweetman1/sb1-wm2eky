import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  iconColor: string;
  bgColor: string;
  onClick: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  label,
  value,
  unit,
  iconColor,
  bgColor,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 p-4 ${bgColor} rounded-lg w-full hover:opacity-90 transition-opacity text-left`}
    >
      <Icon className={`${iconColor} w-6 h-6`} />
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-lg font-semibold text-gray-900">
          {value}
          {unit && <span className="text-sm ml-1">{unit}</span>}
        </p>
      </div>
    </button>
  );
};