import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  context: string;
  icon?: LucideIcon;
  badge?: {
    text: string;
    variant: 'positive' | 'warning' | 'critical' | 'neutral';
  };
  onClick?: () => void;
  active?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  context,
  icon: Icon,
  badge,
  onClick,
  active = false,
}) => {
  const badgeStyles = {
    positive: 'bg-[#EBF7F1] text-[#27845B] border-[#CCE8DA]',
    warning: 'bg-[#FBF4E8] text-[#C58A2A] border-[#F4DEC0]',
    critical: 'bg-[#FDF0F0] text-[#C44B4B] border-[#F8D2D2]',
    neutral: 'bg-[#F7F6F1] text-[#6D7975] border-[#E2E6E1]',
  };

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-xl border bg-white transition-all ${
        onClick ? 'cursor-pointer hover:border-[#16856B] hover:shadow-sm' : ''
      } ${
        active 
          ? 'border-[#123D35] ring-2 ring-[#123D35]/10 shadow-sm' 
          : 'border-[#E2E6E1]'
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-semibold tracking-wider text-[#6D7975] uppercase">
          {label}
        </span>
        {Icon && (
          <div className="p-2 rounded-lg bg-[#F7F6F1] text-[#123D35]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#192A27] tabular-nums font-display">
          {value}
        </div>
        {badge && (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${badgeStyles[badge.variant]}`}>
            {badge.text}
          </span>
        )}
      </div>

      <p className="text-xs text-[#6D7975] line-clamp-1">
        {context}
      </p>
    </div>
  );
};
