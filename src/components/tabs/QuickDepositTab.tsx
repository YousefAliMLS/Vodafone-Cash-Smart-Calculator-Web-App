import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowDownCircle,
  CheckCircle2,
  DollarSign,
  History as HistoryIcon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateQuickDeposit } from '../../lib/calculator';
import { formatEGP, parseMoneyInput } from '../../lib/money';
import { DepositRounding } from '../../types';
import { BalanceBanner } from '../common/BalanceBanner';
import { RecordModal } from '../common/RecordModal';
import { ResultCard } from '../common/ResultCard';

export const QuickDepositTab: React.FC = () => {
  const { balance, settings, language, recordLastCalculation, t } = useApp();

  const [targetInput, setTargetInput] = useState('7300');
  const [roundingMode, setRoundingMode] = useState<DepositRounding>(settings.depositRounding);

  const targetWithdrawal = parseMoneyInput(targetInput);

  const depositResult = calculateQuickDeposit(targetWithdrawal, balance, settings, roundingMode);

  const [recordModalOpen, setRecordModalOpen] = useState(false);

  useEffect(() => {
    if (depositResult.targetWithdrawal > 0) {
      recordLastCalculation({
        title: t.quickDeposit.title,
        primaryValue: formatEGP(depositResult.suggestedDeposit, language),
        details: `${t.quickDeposit.exactDeficit}: ${formatEGP(depositResult.exactDeficit, language)}`,
        timestamp: new Date().toISOString(),
      });
    }
  }, [
    depositResult.suggestedDeposit,
    depositResult.exactDeficit,
    depositResult.targetWithdrawal,
    language,
    recordLastCalculation,
    t.quickDeposit.exactDeficit,
    t.quickDeposit.title,
  ]);

  return (
    <div className="space-y-6">
      <BalanceBanner />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ArrowDownCircle className="w-5 h-5 text-red-600" />
            <span>{t.quickDeposit.title}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.quickDeposit.subtitle}
          </p>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.quickDeposit.targetAmount}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={targetInput}
                onChange={e => setTargetInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-base font-mono font-medium border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="absolute right-3 rtl:left-3 rtl:right-auto top-2.5 text-xs text-slate-400 font-mono">
                {t.common.currency}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.quickDeposit.roundingPolicy}
            </label>
            <select
              value={roundingMode}
              onChange={e => setRoundingMode(e.target.value as DepositRounding)}
              className="w-full px-3.5 py-2.5 text-sm font-medium border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="whole">{t.quickDeposit.wholePound}</option>
              <option value="two_decimals">{t.quickDeposit.twoDecimals}</option>
              <option value="exact">{t.quickDeposit.exactRounding}</option>
            </select>
          </div>
        </div>

        {/* Sufficiency Status Alert */}
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            depositResult.isSufficient
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300'
          }`}
        >
          {depositResult.isSufficient ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
          )}
          <div className="text-xs sm:text-sm font-medium">
            {depositResult.isSufficient ? t.withdrawals.sufficient : t.withdrawals.insufficient}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ResultCard
            label={t.quickDeposit.suggestedDeposit}
            value={formatEGP(
              depositResult.suggestedDeposit,
              language,
              roundingMode === 'whole' ? 0 : 2
            )}
            rawValue={depositResult.suggestedDeposit}
            subtext="Amount to put in wallet"
            variant="highlight"
            icon={<ArrowDownCircle className="w-4 h-4" />}
          />
          <ResultCard
            label={t.quickDeposit.exactDeficit}
            value={formatEGP(depositResult.exactDeficit, language)}
            rawValue={depositResult.exactDeficit}
            subtext="Required minus current balance"
            variant="default"
          />
          <ResultCard
            label={t.withdrawals.requiredBalance}
            value={formatEGP(depositResult.totalRequired, language)}
            rawValue={depositResult.totalRequired}
            subtext={`Target ${formatEGP(depositResult.targetWithdrawal, language)} + ${formatEGP(depositResult.estimatedFee, language)} fee`}
            variant="default"
            icon={<DollarSign className="w-4 h-4" />}
          />
          <ResultCard
            label={t.quickDeposit.balanceAfter}
            value={formatEGP(depositResult.balanceAfterOperation, language)}
            rawValue={depositResult.balanceAfterOperation}
            subtext="Leftover change after withdrawal"
            variant="success"
          />
        </div>

        {/* Record Transaction Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={depositResult.suggestedDeposit <= 0}
            onClick={() => setRecordModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            <HistoryIcon className="w-4 h-4" />
            <span>{t.common.recordTransaction}</span>
          </button>
        </div>
      </div>

      <RecordModal
        isOpen={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        type="deposit"
        amount={depositResult.suggestedDeposit}
        fee={0}
        defaultNote={`Deposit to cover ${formatEGP(depositResult.targetWithdrawal, language)} cash withdrawal`}
      />
    </div>
  );
};
