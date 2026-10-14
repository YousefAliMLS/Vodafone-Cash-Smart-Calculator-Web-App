import React, { useState } from 'react';
import { Check, Edit3, Wallet, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatEGP, parseMoneyInput } from '../../lib/money';

export const BalanceBanner: React.FC = () => {
  const { balance, setBalance, language, t } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(balance.toString());

  const handleOpenEdit = () => {
    setInputValue(balance.toString());
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseMoneyInput(inputValue);
    setBalance(parsed);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-5 md:p-6 shadow-md mb-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-red-100 font-medium">
              {t.common.balance}
            </span>
            <div className="text-2xl md:text-3xl font-extrabold tracking-tight font-mono">
              {formatEGP(balance, language, 2)}
            </div>
          </div>
        </div>

        <div>
          {!isEditing ? (
            <button
              type="button"
              onClick={handleOpenEdit}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-600 hover:bg-red-50 text-sm font-semibold rounded-xl shadow-sm transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>{t.common.updateBalance}</span>
            </button>
          ) : (
            <form onSubmit={handleSave} className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  inputMode="decimal"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="0.00"
                  className="w-36 md:w-44 px-3 py-2 rounded-lg text-slate-900 text-sm font-mono font-medium focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <button
                type="submit"
                className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                title={t.common.save}
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                title={t.common.cancel}
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
