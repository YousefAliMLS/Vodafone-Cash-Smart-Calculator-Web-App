import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowDownCircle,
  Banknote,
  CheckCircle2,
  DollarSign,
  History as HistoryIcon,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateMaxWithdrawal, calculateTargetWithdrawal } from '../../lib/calculator';
import { formatEGP, parseMoneyInput } from '../../lib/money';
import { BalanceBanner } from '../common/BalanceBanner';
import { RecordModal } from '../common/RecordModal';
import { ResultCard } from '../common/ResultCard';

export const WithdrawalTab: React.FC = () => {
  const { balance, settings, language, recordLastCalculation, t } = useApp();

  const [activeMode, setActiveMode] = useState<'modeA' | 'modeB'>('modeA');

  // Mode A Inputs
  const [customBalanceInput, setCustomBalanceInput] = useState(balance.toString());
  const effectiveBalanceA = parseMoneyInput(customBalanceInput);

  // Sync custom input if global balance changed externally
  useEffect(() => {
    setCustomBalanceInput(balance.toString());
  }, [balance]);

  // Mode B Inputs
  const [targetWithdrawalInput, setTargetWithdrawalInput] = useState('9500');
  const targetWithdrawal = parseMoneyInput(targetWithdrawalInput);

  // Calculation Results
  const resultA = calculateMaxWithdrawal(effectiveBalanceA, settings);
  const resultB = calculateTargetWithdrawal(targetWithdrawal, balance, settings);

  // Record modal state
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [recordData, setRecordData] = useState<{
    amount: number;
    fee: number;
    note: string;
  }>({ amount: 0, fee: 0, note: '' });

  // Update last calculation summary on state change
  useEffect(() => {
    if (activeMode === 'modeA') {
      recordLastCalculation({
        title: t.withdrawals.modeA,
        primaryValue: formatEGP(resultA.maxWithdrawal, language, 0),
        details: `${t.withdrawals.estimatedFee}: ${formatEGP(resultA.estimatedFee, language)}`,
        timestamp: new Date().toISOString(),
      });
    } else {
      recordLastCalculation({
        title: t.withdrawals.modeB,
        primaryValue: formatEGP(resultB.requestedWithdrawal, language),
        details: `${t.withdrawals.requiredBalance}: ${formatEGP(resultB.totalRequired, language)}`,
        timestamp: new Date().toISOString(),
      });
    }
  }, [
    activeMode,
    resultA.maxWithdrawal,
    resultA.estimatedFee,
    resultB.requestedWithdrawal,
    resultB.totalRequired,
    language,
    recordLastCalculation,
    t.withdrawals.estimatedFee,
    t.withdrawals.modeA,
    t.withdrawals.modeB,
    t.withdrawals.requiredBalance,
  ]);

  const handleOpenRecordA = () => {
    setRecordData({
      amount: resultA.maxWithdrawal,
      fee: resultA.estimatedFee,
      note: 'Max cash withdrawal calculated from balance',
    });
    setRecordModalOpen(true);
  };

  const handleOpenRecordB = () => {
    setRecordData({
      amount: resultB.requestedWithdrawal,
      fee: resultB.estimatedFee,
      note: `Target cash withdrawal: ${resultB.requestedWithdrawal} EGP`,
    });
    setRecordModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <BalanceBanner />

      {/* Mode Selector Tabs */}
      <div className="flex p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveMode('modeA')}
          className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeMode === 'modeA'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          {t.withdrawals.modeA}
        </button>
        <button
          type="button"
          onClick={() => setActiveMode('modeB')}
          className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeMode === 'modeB'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          {t.withdrawals.modeB}
        </button>
      </div>

      {/* MODE A: Maximum Possible Withdrawal */}
      {activeMode === 'modeA' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Banknote className="w-5 h-5 text-red-600" />
              <span>{t.withdrawals.modeA}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.withdrawals.modeADesc}
            </p>
          </div>

          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.withdrawals.inputBalance}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={customBalanceInput}
                onChange={e => setCustomBalanceInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-base font-mono font-medium border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="absolute right-3 rtl:left-3 rtl:right-auto top-2.5 text-xs text-slate-400 font-mono">
                {t.common.currency}
              </span>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard
              label={t.withdrawals.maxAmount}
              value={formatEGP(resultA.maxWithdrawal, language, 0)}
              rawValue={resultA.maxWithdrawal}
              subtext="Whole pound cash output"
              variant="highlight"
              icon={<Banknote className="w-4 h-4" />}
            />
            <ResultCard
              label={t.withdrawals.estimatedFee}
              value={formatEGP(resultA.estimatedFee, language)}
              rawValue={resultA.estimatedFee}
              subtext={`Based on ${settings.feeMode === 'percentage' ? `${settings.withdrawalFeePercent}%` : 'fixed'} fee rule`}
              variant="default"
              icon={<DollarSign className="w-4 h-4" />}
            />
            <ResultCard
              label={t.withdrawals.totalConsumed}
              value={formatEGP(resultA.totalConsumed, language)}
              rawValue={resultA.totalConsumed}
              subtext="Withdrawal plus fee"
              variant="default"
            />
            <ResultCard
              label={t.withdrawals.remainingBalance}
              value={formatEGP(resultA.remainingBalance, language)}
              rawValue={resultA.remainingBalance}
              subtext="Leftover wallet change"
              variant="success"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={resultA.maxWithdrawal <= 0}
              onClick={handleOpenRecordA}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors"
            >
              <HistoryIcon className="w-4 h-4" />
              <span>{t.common.recordTransaction}</span>
            </button>
          </div>
        </div>
      )}

      {/* MODE B: Target Cash Withdrawal */}
      {activeMode === 'modeB' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-600" />
              <span>{t.withdrawals.modeB}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.withdrawals.modeBDesc}
            </p>
          </div>

          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.withdrawals.inputTarget}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={targetWithdrawalInput}
                onChange={e => setTargetWithdrawalInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-base font-mono font-medium border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="absolute right-3 rtl:left-3 rtl:right-auto top-2.5 text-xs text-slate-400 font-mono">
                {t.common.currency}
              </span>
            </div>
          </div>

          {/* Sufficiency Status Alert */}
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              resultB.isSufficient
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300'
                : 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300'
            }`}
          >
            {resultB.isSufficient ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
            )}
            <div className="text-xs sm:text-sm font-medium">
              {resultB.isSufficient ? t.withdrawals.sufficient : t.withdrawals.insufficient}
            </div>
          </div>

          {/* Target Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard
              label={t.withdrawals.requiredBalance}
              value={formatEGP(resultB.totalRequired, language)}
              rawValue={resultB.totalRequired}
              subtext={`Target ${formatEGP(resultB.requestedWithdrawal, language)} + ${formatEGP(resultB.estimatedFee, language)} fee`}
              variant="highlight"
            />
            <ResultCard
              label={t.withdrawals.depositDeficit}
              value={formatEGP(resultB.additionalDepositNeeded, language)}
              rawValue={resultB.additionalDepositNeeded}
              subtext="Exact deficit to cover"
              variant={resultB.additionalDepositNeeded > 0 ? 'warning' : 'success'}
              icon={<ArrowDownCircle className="w-4 h-4" />}
            />
            <ResultCard
              label={t.withdrawals.depositWhole}
              value={formatEGP(resultB.suggestedDepositWhole, language, 0)}
              rawValue={resultB.suggestedDepositWhole}
              subtext="Convenient whole pound deposit"
              variant={resultB.additionalDepositNeeded > 0 ? 'warning' : 'default'}
            />
            <ResultCard
              label={t.withdrawals.surplus}
              value={formatEGP(resultB.surplusBalance, language)}
              rawValue={resultB.surplusBalance}
              subtext="Wallet balance left after transaction"
              variant={resultB.isSufficient ? 'success' : 'default'}
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={resultB.requestedWithdrawal <= 0 || !resultB.isSufficient}
              onClick={handleOpenRecordB}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors"
            >
              <HistoryIcon className="w-4 h-4" />
              <span>{t.common.recordTransaction}</span>
            </button>
          </div>
        </div>
      )}

      {/* Record Modal */}
      <RecordModal
        isOpen={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        type="withdrawal"
        amount={recordData.amount}
        fee={recordData.fee}
        defaultNote={recordData.note}
      />
    </div>
  );
};
