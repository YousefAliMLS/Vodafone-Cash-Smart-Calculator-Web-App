import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  History as HistoryIcon,
  Info,
  Shield,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateVirtualCard } from '../../lib/calculator';
import { formatEGP, parseMoneyInput } from '../../lib/money';
import { VirtualCardMode } from '../../types';
import { BalanceBanner } from '../common/BalanceBanner';
import { RecordModal } from '../common/RecordModal';
import { ResultCard } from '../common/ResultCard';

export const VirtualCardTab: React.FC = () => {
  const { balance, settings, language, recordLastCalculation, t } = useApp();

  const [cardAmountInput, setCardAmountInput] = useState('300');
  const [cardFeeInput, setCardFeeInput] = useState(settings.cardIssuanceFee.toString());
  const [additionalFeesInput, setAdditionalFeesInput] = useState('0');
  const [mode, setMode] = useState<VirtualCardMode>('fee_separate');

  const cardAmount = parseMoneyInput(cardAmountInput);
  const cardFee = parseMoneyInput(cardFeeInput);
  const additionalFees = parseMoneyInput(additionalFeesInput);

  const cardResult = calculateVirtualCard(cardAmount, balance, cardFee, additionalFees, mode);

  const [recordModalOpen, setRecordModalOpen] = useState(false);

  useEffect(() => {
    if (cardResult.requestedAmount > 0) {
      recordLastCalculation({
        title: t.virtualCard.title,
        primaryValue: formatEGP(cardResult.requestedAmount, language),
        details: `${t.virtualCard.totalRequired}: ${formatEGP(cardResult.totalRequired, language)}`,
        timestamp: new Date().toISOString(),
      });
    }
  }, [
    cardResult.requestedAmount,
    cardResult.totalRequired,
    language,
    recordLastCalculation,
    t.virtualCard.title,
    t.virtualCard.totalRequired,
  ]);

  return (
    <div className="space-y-6">
      <BalanceBanner />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            <span>{t.virtualCard.title}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.virtualCard.subtitle}
          </p>
        </div>

        {/* Accounting Mode Toggle */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t.virtualCard.accountingMode}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('fee_separate')}
              className={`p-3.5 rounded-xl border text-left rtl:text-right text-xs transition-all ${
                mode === 'fee_separate'
                  ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200 ring-2 ring-red-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="font-bold mb-1">{t.virtualCard.mode1}</div>
              <div className="text-slate-500 dark:text-slate-400">
                {t.virtualCard.mode1Explanation}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode('budget_deduct')}
              className={`p-3.5 rounded-xl border text-left rtl:text-right text-xs transition-all ${
                mode === 'budget_deduct'
                  ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200 ring-2 ring-red-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="font-bold mb-1">{t.virtualCard.mode2}</div>
              <div className="text-slate-500 dark:text-slate-400">
                {t.virtualCard.mode2Explanation}
              </div>
            </button>
          </div>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.virtualCard.cardAmount}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={cardAmountInput}
                onChange={e => setCardAmountInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-base font-mono font-medium border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="absolute right-3 rtl:left-3 rtl:right-auto top-2.5 text-xs text-slate-400 font-mono">
                {t.common.currency}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.virtualCard.issuanceFee}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={cardFeeInput}
                onChange={e => setCardFeeInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-base font-mono font-medium border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="absolute right-3 rtl:left-3 rtl:right-auto top-2.5 text-xs text-slate-400 font-mono">
                {t.common.currency}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.virtualCard.additionalFees}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={additionalFeesInput}
                onChange={e => setAdditionalFeesInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-base font-mono font-medium border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="absolute right-3 rtl:left-3 rtl:right-auto top-2.5 text-xs text-slate-400 font-mono">
                {t.common.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Sufficiency Status Alert */}
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            cardResult.isSufficient
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300'
          }`}
        >
          {cardResult.isSufficient ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
          )}
          <div className="text-xs sm:text-sm font-medium">
            {cardResult.isSufficient
              ? t.virtualCard.sufficientStatus
              : t.virtualCard.insufficientStatus}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ResultCard
            label={t.virtualCard.totalRequired}
            value={formatEGP(cardResult.totalRequired, language)}
            rawValue={cardResult.totalRequired}
            subtext={
              mode === 'fee_separate'
                ? `Card value ${formatEGP(cardResult.requestedAmount, language)} + ${formatEGP(cardResult.issuanceFee, language)} fee`
                : 'Budget entered'
            }
            variant="highlight"
            icon={<CreditCard className="w-4 h-4" />}
          />
          <ResultCard
            label={t.virtualCard.maxAffordable}
            value={formatEGP(cardResult.maxAffordableCard, language)}
            rawValue={cardResult.maxAffordableCard}
            subtext="Highest card value possible"
            variant="default"
          />
          <ResultCard
            label={t.virtualCard.issuanceFee}
            value={formatEGP(cardResult.issuanceFee, language)}
            rawValue={cardResult.issuanceFee}
            subtext="Vodafone Cash generation fee"
            variant="default"
          />
          <ResultCard
            label={t.withdrawals.remainingBalance}
            value={formatEGP(cardResult.remainingBalance, language)}
            rawValue={cardResult.remainingBalance}
            subtext="Wallet balance left after card"
            variant={cardResult.isSufficient ? 'success' : 'warning'}
          />
        </div>

        {/* Disclaimer / Assumption Note */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>{cardResult.disclaimer}</span>
        </div>

        {/* Record Transaction Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={!cardResult.isSufficient || cardResult.requestedAmount <= 0}
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
        type="card_issuance"
        amount={cardResult.requestedAmount}
        fee={cardResult.issuanceFee}
        defaultNote={`Virtual card generated: ${formatEGP(cardResult.requestedAmount, language)}`}
      />
    </div>
  );
};
