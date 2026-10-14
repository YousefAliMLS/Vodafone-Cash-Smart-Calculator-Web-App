import React from 'react';
import { Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { t } = useApp();

  return (
    <footer className="mt-12 py-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center sm:text-left rtl:sm:text-right">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-red-600 text-white flex items-center justify-center font-black text-xs">
              VF
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{t.app.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
              v1.0.0
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/YousefAliMLS/Vodafone-Cash-Smart-Calculator-Web-App"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-red-600 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>

        <p className="text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
          Independent personal financial calculation tool designed for Vodafone Cash customers in
          Egypt. Not affiliated with, sponsored by, or endorsed by Vodafone Egypt or Vodafone Group
          Plc. All trademarks and service marks belong to their respective owners.
        </p>

        <div className="flex items-center justify-center sm:justify-start rtl:sm:justify-end gap-1.5 text-[11px] text-slate-400">
          <Shield className="w-3.5 h-3.5" />
          <span>{t.app.privacyNote}</span>
        </div>
      </div>
    </footer>
  );
};
