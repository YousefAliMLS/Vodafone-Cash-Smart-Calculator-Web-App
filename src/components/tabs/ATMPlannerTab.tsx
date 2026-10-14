import React, { useEffect, useState } from 'react';
import { AlertTriangle, CreditCard, History as HistoryIcon, Info, ListOrdered } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateAtmPlan } from '../../lib/calculator';
import { formatEGP, parseMoneyInput } from '../../lib/money';
import { BalanceBanner } from '../common/BalanceBanner';
import { RecordModal } from '../common/RecordModal';
import { ResultCard } from '../common/ResultCard';

export const ATMPlannerTab: React.FC = () => {
  const { balance, settings, language, recordLastCalculation, t } = useApp();

  const [targetInput, setTargetInput] = useState('10007');
  const [atmLimitInput, setAtmLimitInput] = useState(settings.atmLimitPerTx.toString());

  const targetWithdrawal = parseMoneyInput(targetInput);
  const atmLimit = parseMoneyInput(atmLimitInput);

  const planResult = calculateAtmPlan(targetWithdrawal, balance, atmLimit, settings);

  // Record modal state
  const [recordModalOpen, setRecordModalOpen] = useState(false);

  useEffect(() => {
    if (planResult.isFeasible && planResult.steps.length > 0) {
      recordLastCalculation({
        title: t.atmPlanner.title,
        primaryValue: `${planResult.steps.length} txs - ${formatEGP(planResult.totalWithdrawn, language)}`,
        details: `${t.atmPlanner.totalFees}: ${formatEGP(planResult.totalFees, language)}`,
        timestamp: new Date().toISOString(),
      });
    }
  }, [
    planResult.totalWithdrawn,
    planResult.steps.length,
    planResult.isFeasible,
    planResult.totalFees,
    language,
    recordLastCalculation,
    t.atmPlanner.title,
    t.atmPlanner.totalFees,
  ]);

  return (
    <div className="space-y-6">
      <BalanceBanner />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-red-600" />
            <span>{t.atmPlanner.title}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.atmPlanner.subtitle}</p>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.atmPlanner.targetAmount}
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
              {t.atmPlanner.atmLimit}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={atmLimitInput}
                onChange={e => setAtmLimitInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-base font-mono font-medium border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="absolute right-3 rtl:left-3 rtl:right-auto top-2.5 text-xs text-slate-400 font-mono">
                {t.common.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Overall Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ResultCard
            label={t.atmPlanner.totalWithdrawal}
            value={formatEGP(planResult.totalWithdrawn, language)}
            rawValue={planResult.totalWithdrawn}
            variant="highlight"
            icon={<CreditCard className="w-4 h-4" />}
          />
          <ResultCard
            label={t.atmPlanner.totalFees}
            value={formatEGP(planResult.totalFees, language)}
            rawValue={planResult.totalFees}
            variant="default"
          />
          <ResultCard
            label={t.atmPlanner.totalCost}
            value={formatEGP(planResult.totalCost, language)}
            rawValue={planResult.totalCost}
            subtext="Withdrawals plus all fees"
            variant="default"
          />
          <ResultCard
            label={t.atmPlanner.finalBalance}
            value={formatEGP(planResult.remainingBalance, language)}
            rawValue={planResult.remainingBalance}
            variant={planResult.isFeasible ? 'success' : 'warning'}
          />
        </div>

        {/* Feasibility Warning */}
        {!planResult.isFeasible && planResult.targetWithdrawal > 0 && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-800 dark:text-amber-300">
              <span className="font-bold block mb-1">{t.atmPlanner.limitExceededWarning}</span>
              <p>
                {t.atmPlanner.limitExceededAdvice}{' '}
                <strong className="font-mono">
                  {formatEGP(planResult.maxFeasibleWithdrawal || 0, language, 0)}
                </strong>
              </p>
            </div>
          </div>
        )}

        {/* Transaction Steps Breakdown Table */}
        {planResult.steps.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {t.atmPlanner.generatePlan} ({planResult.steps.length})
              </h3>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left rtl:text-right border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2.5 px-3 font-semibold">{t.atmPlanner.stepNumber}</th>
                    <th className="py-2.5 px-3 font-semibold">{t.atmPlanner.withdrawal}</th>
                    <th className="py-2.5 px-3 font-semibold">{t.atmPlanner.fee}</th>
                    <th className="py-2.5 px-3 font-semibold">{t.atmPlanner.txCost}</th>
                    <th className="py-2.5 px-3 font-semibold hidden md:table-cell">
                      {t.atmPlanner.cumulativeWithdrawn}
                    </th>
                    <th className="py-2.5 px-3 font-semibold hidden lg:table-cell">
                      {t.atmPlanner.remainingTarget}
                    </th>
                    <th className="py-2.5 px-3 font-semibold">{t.atmPlanner.remainingBalance}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {planResult.steps.map(step => (
                    <tr
                      key={step.stepNumber}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-bold text-red-600">#{step.stepNumber}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                        {formatEGP(step.withdrawalAmount, language)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                        {formatEGP(step.fee, language)}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                        {formatEGP(step.totalCost, language)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 hidden md:table-cell">
                        {formatEGP(step.cumulativeWithdrawn, language)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 hidden lg:table-cell">
                        {formatEGP(step.remainingTarget, language)}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                        {formatEGP(step.remainingBalance, language)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Informative Note */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>{planResult.disclaimer}</span>
        </div>

        {/* Record Transaction Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={!planResult.isFeasible || planResult.totalWithdrawn <= 0}
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
        type="withdrawal"
        amount={planResult.totalWithdrawn}
        fee={planResult.totalFees}
        defaultNote={`ATM split plan (${planResult.steps.length} transactions)`}
      />
    </div>
  );
};
