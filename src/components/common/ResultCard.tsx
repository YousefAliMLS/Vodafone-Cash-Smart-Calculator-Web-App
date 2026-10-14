import React from 'react';
import { CopyButton } from './CopyButton';

interface ResultCardProps {
  label: string;
  value: string;
  rawValue?: string | number;
  subtext?: string;
  variant?: 'default' | 'highlight' | 'success' | 'warning';
  icon?: React.ReactNode;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  label,
  value,
  rawValue,
  subtext,
  variant = 'default',
  icon,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'highlight':
        return 'bg-red-50 border-red-200 text-red-950 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-100';
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-950 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-100';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-950 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-100';
      default:
        return 'bg-white border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100';
    }
  };

  const getValueColor = () => {
    switch (variant) {
      case 'highlight':
        return 'text-red-600 dark:text-red-400';
      case 'success':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'warning':
        return 'text-amber-600 dark:text-amber-400';
      default:
        return 'text-slate-900 dark:text-white';
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border shadow-sm transition-all flex flex-col justify-between ${getVariantStyles()}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-500 dark:text-slate-400">{icon}</span>}
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </span>
        </div>
        {rawValue !== undefined && <CopyButton textToCopy={rawValue.toString()} />}
      </div>
      <div>
        <div className={`text-2xl font-bold tracking-tight font-mono ${getValueColor()}`}>
          {value}
        </div>
        {subtext && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-normal">{subtext}</p>
        )}
      </div>
    </div>
  );
};
