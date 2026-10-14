import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  History as HistoryIcon,
  Receipt,
  Wifi,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateInternetBundle } from '../../lib/calculator';
import { formatEGP, parseMoneyInput } from '../../lib/money';
import { BalanceBanner } from '../common/BalanceBanner';
import { RecordModal } from '../common/RecordModal';
import { ResultCard } from '../common/ResultCard';

export const InternetBundleTab: React.FC = () => {
  const { balance, settings, language, recordLastCalculation, t } = useApp();

  const [bundlePriceInput, setBundlePriceInput] = useState(settings.defaultBundlePrice.toString());
  const [taxIncluded, setTaxIncluded] = useState(settings.bundleIncludesTax);
  const [taxRateInput, setTaxRateInput] = useState(settings.defaultTaxRate.toString());
  const [cardFeeInput, setCardFeeInput] = useState(settings.cardIssuanceFee.toString());
  const [customCardInput, setCustomCardInput] = useState('');

  const bundlePrice = parseMoneyInput(bundlePriceInput);
  const taxRate = parseMoneyInput(taxRateInput);
  const cardFee = parseMoneyInput(cardFeeInput);
  const customCardAmount = customCardInput.trim() ? parseMoneyInput(customCardInput) : undefined;

  const bundleResult = calculateInternetBundle(
    bundlePrice,
    taxIncluded,
    taxRate,
    balance,
    cardFee,
    0,
    customCardAmount
  );

  const [recordModalOpen, setRecordModalOpen] = useState(false);

  useEffect(() => {
    if (bundleResult.finalBundleCost > 0) {
      recordLastCalculation({
        title: t.internetBundle.title,
        primaryValue: formatEGP(bundleResult.finalBundleCost, language),
        details: `${t.internetBundle.totalRequired}: ${formatEGP(bundleResult.totalRequired, language)}`,
        timestamp: new Date().toISOString(),
      });
    }
  }, [
    bundleResult.finalBundleCost,
    bundleResult.totalRequired,
    language,
    recordLastCalculation,
    t.internetBundle.title,
    t.internetBundle.totalRequired,
  ]);

  return (
    <div className="space-y-6">
      <BalanceBanner />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wifi className="w-5 h-5 text-red-600" />
            <span>{t.internetBundle.title}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.internetBundle.subtitle}
          </p>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.internetBundle.bundlePrice}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={bundlePriceInput}
                onChange={e => setBundlePriceInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-base font-mono font-medium border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="absolute right-3 rtl:left-3 rtl:right-auto top-2.5 text-xs text-slate-400 font-mono">
                {t.common.currency}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.internetBundle.cardFee}
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
              {t.internetBundle.customCardAmount}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={customCardInput}
                onChange={e => setCustomCardInput(e.target.value)}
                placeholder={formatEGP(bundleResult.finalBundleCost, language)}
                className="w-full px-3.5 py-2.5 text-base font-mono font-medium border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="absolute right-3 rtl:left-3 rtl:right-auto top-2.5 text-xs text-slate-400 font-mono">
                {t.common.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Tax Inclusion Switch & Rate */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              {t.internetBundle.taxIncludedSwitch}
            </span>
            <input
              type="checkbox"
              checked={taxIncluded}
              onChange={e => setTaxIncluded(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
            />
          </div>

          {!taxIncluded && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {t.internetBundle.taxRate}
              </label>
              <input
                type="number"
                value={taxRateInput}
                onChange={e => setTaxRateInput(e.target.value)}
                className="w-24 px-3 py-1.5 text-xs font-mono font-medium border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="text-xs text-slate-500">%</span>
            </div>
          )}
        </div>

        {/* Sufficiency Status Alert */}
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            bundleResult.isSufficient
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300'
          }`}
        >
          {bundleResult.isSufficient ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
          )}
          <div className="text-xs sm:text-sm font-medium">
            {bundleResult.isSufficient
              ? t.internetBundle.sufficient
              : t.internetBundle.insufficient}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ResultCard
            label={t.internetBundle.finalBundleCost}
            value={formatEGP(bundleResult.finalBundleCost, language)}
            rawValue={bundleResult.finalBundleCost}
            subtext={
              taxIncluded
                ? 'Tax already included'
                : `Includes ${formatEGP(bundleResult.taxAmount, language)} VAT`
            }
            variant="highlight"
            icon={<Receipt className="w-4 h-4" />}
          />
          <ResultCard
            label={t.internetBundle.totalRequired}
            value={formatEGP(bundleResult.totalRequired, language)}
            rawValue={bundleResult.totalRequired}
            subtext={`Card ${formatEGP(bundleResult.cardAmount, language)} + ${formatEGP(bundleResult.issuanceFee, language)} fee`}
            variant="default"
            icon={<CreditCard className="w-4 h-4" />}
          />
          <ResultCard
            label={t.internetBundle.requiredCardAmount}
            value={formatEGP(bundleResult.cardAmount, language)}
            rawValue={bundleResult.cardAmount}
            subtext="Face value to generate"
            variant="default"
          />
          <ResultCard
            label={t.withdrawals.remainingBalance}
            value={formatEGP(bundleResult.remainingBalance, language)}
            rawValue={bundleResult.remainingBalance}
            subtext="Wallet balance left after payment"
            variant={bundleResult.isSufficient ? 'success' : 'warning'}
          />
        </div>

        {/* Record Transaction Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={!bundleResult.isSufficient || bundleResult.finalBundleCost <= 0}
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
        type="bundle_payment"
        amount={bundleResult.finalBundleCost}
        fee={bundleResult.issuanceFee}
        defaultNote={`Internet bundle renewal: ${formatEGP(bundleResult.finalBundleCost, language)}`}
      />
    </div>
  );
};
