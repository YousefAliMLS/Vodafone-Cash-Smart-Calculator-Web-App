import React, { useState } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatEGP } from '../../lib/money';
import { TransactionType } from '../../types';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TransactionType;
  amount: number;
  fee: number;
  defaultNote?: string;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  type,
  amount,
  fee,
  defaultNote = '',
}) => {
  const { balance, setBalance, addHistoryRecord, language, t } = useApp();
  const [note, setNote] = useState(defaultNote);
  const [applyBalanceChange, setApplyBalanceChange] = useState(true);

  if (!isOpen) return null;

  // Calculate balance impact
  let balanceImpact = 0;
  if (type === 'deposit') {
    balanceImpact = amount;
  } else if (type === 'withdrawal') {
    balanceImpact = -(amount + fee);
  } else if (type === 'fee') {
    balanceImpact = -fee;
  } else if (type === 'card_issuance') {
    balanceImpact = -fee;
  } else if (type === 'bundle_payment') {
    balanceImpact = -(amount + fee);
  } else if (type === 'card_payment') {
    balanceImpact = -(amount + fee);
  } else {
    balanceImpact = amount;
  }

  const projectedBalance = Math.max(0, balance + balanceImpact);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addHistoryRecord({
      type,
      amount,
      fee,
      balanceImpact,
      balanceBefore: balance,
      balanceAfter: applyBalanceChange ? projectedBalance : balance,
      note: note.trim(),
    });

    if (applyBalanceChange) {
      setBalance(projectedBalance);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          aria-label={t.common.close}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.modal.recordTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.history.types[type]}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2 border border-slate-200/60 dark:border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">{t.common.amount}:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                {formatEGP(amount, language)}
              </span>
            </div>
            {fee > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">{t.common.fee}:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {formatEGP(fee, language)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-xs border-t border-slate-200 dark:border-slate-700 pt-2">
              <span className="text-slate-500">{t.history.impact}:</span>
              <span
                className={`font-bold font-mono ${
                  balanceImpact >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {balanceImpact >= 0 ? '+' : ''}
                {formatEGP(balanceImpact, language)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.common.note} ({t.common.optional})
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={t.modal.notePlaceholder}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex items-start gap-3 p-3 bg-red-50/70 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-xl">
            <input
              type="checkbox"
              id="applyBalanceChange"
              checked={applyBalanceChange}
              onChange={e => setApplyBalanceChange(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500"
            />
            <label
              htmlFor="applyBalanceChange"
              className="text-xs text-slate-700 dark:text-slate-300 select-none cursor-pointer"
            >
              <span className="font-semibold block mb-0.5">{t.modal.updateBalanceQuestion}</span>
              <span className="text-slate-500 dark:text-slate-400">
                {applyBalanceChange
                  ? t.modal.balanceWillChange
                      .replace('{old}', formatEGP(balance, language))
                      .replace('{new}', formatEGP(projectedBalance, language))
                  : t.modal.balanceWillNotChange}
              </span>
            </label>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{t.app.privacyNote}</span>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-sm transition-colors"
            >
              {t.common.confirm}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
