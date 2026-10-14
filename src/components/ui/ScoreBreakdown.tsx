import React from 'react';
import { ScoreFactorBreakdown } from '../../types';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

interface ScoreBreakdownProps {
  factors: ScoreFactorBreakdown[];
  title?: string;
  subtitle?: string;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({
  factors,
  title = 'Explainable Indicator Contribution',
  subtitle = 'Formula: ∑ (Normalized Score × Weight) = Total Composite Score',
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E6E1] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 pb-3 border-b border-[#E2E6E1]">
        <div>
          <h3 className="text-sm font-bold text-[#192A27]">{title}</h3>
          <p className="text-xs text-[#6D7975]">{subtitle}</p>
        </div>
        <span className="text-[11px] font-semibold text-[#16856B] bg-[#E8F5F1] px-2.5 py-1 rounded-md self-start sm:self-auto">
          Deterministic 100-Point Model
        </span>
      </div>

      <div className="space-y-4">
        {factors.map((item, idx) => {
          const percentageOfMax = Math.min(100, Math.round((item.contribution / item.maxContribution) * 100));
          const isCritical = item.status === 'critical';
          const isWarning = item.status === 'warning';

          const StatusIcon = isCritical ? AlertCircle : isWarning ? AlertTriangle : CheckCircle2;
          const statusColor = isCritical 
            ? 'text-[#C44B4B]' 
            : isWarning 
            ? 'text-[#C58A2A]' 
            : 'text-[#27845B]';

          return (
            <div key={idx} className="group">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-3.5 h-3.5 ${statusColor} shrink-0`} />
                  <span className="font-semibold text-[#192A27]">{item.factor}</span>
                  <span className="text-[11px] text-[#6D7975] bg-[#F7F6F1] px-1.5 py-0.5 rounded">
                    Weight: {item.weight}%
                  </span>
                </div>

                <div className="flex items-center gap-3 tabular-nums">
                  <span className="text-[#6D7975] text-[11px]">
                    Raw: <strong className="text-[#192A27] font-semibold">{item.score}/100</strong>
                  </span>
                  <span className="font-bold text-[#123D35] bg-[#F7F6F1] px-2 py-0.5 rounded border border-[#E2E6E1]">
                    +{item.contribution.toFixed(1)} <span className="text-[10px] text-[#6D7975] font-normal">/ {item.maxContribution}</span>
                  </span>
                </div>
              </div>

              {/* Progress bar representing weight contribution */}
              <div className="h-2 w-full bg-[#F0EFEA] rounded-full overflow-hidden flex">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isCritical 
                      ? 'bg-[#C44B4B]' 
                      : isWarning 
                      ? 'bg-[#C58A2A]' 
                      : 'bg-[#16856B]'
                  }`}
                  style={{ width: `${percentageOfMax}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-1 text-[11px] text-[#6D7975]">
                <span className="truncate">{item.detail}</span>
                <span className="text-[10px] shrink-0 font-medium">
                  {percentageOfMax}% realized
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
