import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, label, className = '' }) => {
  const { t } = useApp();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? t.common.copied : label || t.common.copy}
      aria-label={copied ? t.common.copied : label || t.common.copy}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
        copied
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
      } ${className}`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? t.common.copied : label || t.common.copy}</span>
    </button>
  );
};
