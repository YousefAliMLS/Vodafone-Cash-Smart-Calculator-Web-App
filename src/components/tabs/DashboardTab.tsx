import React from 'react';
import {
  ArrowDownCircle,
  ArrowRight,
  Banknote,
  Clock,
  CreditCard,
  Percent,
  Shield,
  Sparkles,
  Wifi,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateMaxWithdrawal } from '../../lib/calculator';
import { formatEGP, formatNumber } from '../../lib/money';
import { TabType } from '../../types';
import { BalanceBanner } from '../common/BalanceBanner';
import { CopyButton } from '../common/CopyButton';

export const DashboardTab: React.FC = () => {
  const { balance, settings, language, lastCalculation, setActiveTab, t } = useApp();

  const maxResult = calculateMaxWithdrawal(balance, settings);

  const quickActions: {
    id: TabType;
    title: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'withdrawals',
      title: t.dashboard.launchMaxWithdrawal,
      description: t.dashboard.launchMaxWithdrawalDesc,
      icon: <Banknote className="w-5 h-5 text-red-600" />,
    },
    {
      id: 'withdrawals',
      title: t.dashboard.launchTargetWithdrawal,
      description: t.dashboard.launchTargetWithdrawalDesc,
      icon: <Sparkles className="w-5 h-5 text-red-600" />,
    },
    {
      id: 'atm_planner',
      title: t.dashboard.launchAtmPlanner,
      description: t.dashboard.launchAtmPlannerDesc,
      icon: <CreditCard className="w-5 h-5 text-red-600" />,
    },
    {
      id: 'virtual_card',
      title: t.dashboard.launchVirtualCard,
      description: t.dashboard.launchVirtualCardDesc,
      icon: <Shield className="w-5 h-5 text-red-600" />,
    },
    {
      id: 'internet_bundle',
      title: t.dashboard.launchInternetBundle,
      description: t.dashboard.launchInternetBundleDesc,
      icon: <Wifi className="w-5 h-5 text-red-600" />,
    },
    {
      id: 'quick_deposit',
      title: t.dashboard.launchQuickDeposit,
      description: t.dashboard.launchQuickDepositDesc,
      icon: <ArrowDownCircle className="w-5 h-5 text-red-600" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Prominent Balance Banner */}
      <BalanceBanner />

      {/* Primary Highlight: Maximum Currently Withdrawable Amount */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 mb-2">
              <Banknote className="w-3.5 h-3.5" />
              <span>{t.dashboard.maxWithdrawable}</span>
            </div>
            <div className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
              {formatEGP(maxResult.maxWithdrawal, language, 0)}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {t.dashboard.maxWithdrawableDesc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <CopyButton
              textToCopy={maxResult.maxWithdrawal.toString()}
              label={t.common.copy}
              className="py-2 px-3 text-sm"
            />
            <button
              type="button"
              onClick={() => setActiveTab('withdrawals')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              <span>{t.withdrawals.title}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block">{t.withdrawals.estimatedFee}</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
              {formatEGP(maxResult.estimatedFee, language)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">{t.withdrawals.totalConsumed}</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
              {formatEGP(maxResult.totalConsumed, language)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">{t.withdrawals.remainingBalance}</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
              {formatEGP(maxResult.remainingBalance, language)}
            </span>
          </div>
        </div>
      </div>

      {/* Configuration Quick Stats Grid */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          {t.dashboard.quickStats}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">{t.dashboard.feeRate}</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                {settings.feeMode === 'percentage'
                  ? `${formatNumber(settings.withdrawalFeePercent, language, 1)}%`
                  : `${formatEGP(settings.fixedFeePerThousand, language)} / 1k`}
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Percent className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">{t.dashboard.cardFee}</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                {formatEGP(settings.cardIssuanceFee, language)}
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Shield className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">{t.dashboard.atmLimit}</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                {formatEGP(settings.atmLimitPerTx, language, 0)}
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Last Calculation Summary */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.dashboard.lastCalculation}
          </h2>
        </div>
        {lastCalculation ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {lastCalculation.title}
              </span>
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                {lastCalculation.primaryValue}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lastCalculation.details}
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {new Date(lastCalculation.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            {t.dashboard.noCalculationYet}
          </p>
        )}
      </div>

      {/* Quick Launch Tools */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          {t.dashboard.quickLaunch}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(action.id)}
              className="text-left rtl:text-right p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-300 dark:hover:border-red-900/60 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {action.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">
                  {action.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{action.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
