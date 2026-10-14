import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  const config = {
    high: {
      label: 'Priority Risk',
      bg: 'bg-[#FDF0F0]',
      text: 'text-[#C44B4B]',
      border: 'border-[#F8D2D2]',
      icon: ShieldAlert,
    },
    medium: {
      label: 'Moderate Review',
      bg: 'bg-[#FBF4E8]',
      text: 'text-[#C58A2A]',
      border: 'border-[#F4DEC0]',
      icon: AlertTriangle,
    },
    low: {
      label: 'On Track',
      bg: 'bg-[#EBF7F1]',
      text: 'text-[#27845B]',
      border: 'border-[#CCE8DA]',
      icon: CheckCircle2,
    },
  }[level];

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  }[size];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
