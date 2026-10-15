import React from 'react';
import {
  ArrowDownCircle,
  Banknote,
  CreditCard,
  History,
  LayoutDashboard,
  Settings,
  Shield,
  Wifi,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: t.nav.dashboard,
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'withdrawals',
      label: t.nav.withdrawals,
      icon: <Banknote className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'atm_planner',
      label: t.nav.atmPlanner,
      icon: <CreditCard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'virtual_card',
      label: t.nav.virtualCard,
      icon: <Shield className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'internet_bundle',
      label: t.nav.internetBundle,
      icon: <Wifi className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'quick_deposit',
      label: t.nav.quickDeposit,
      icon: <ArrowDownCircle className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'history',
      label: t.nav.history,
      icon: <History className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'settings',
      label: t.nav.settings,
      icon: <Settings className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-header-safe z-20 transition-colors pl-safe-left pr-safe-right">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 rtl:space-x-reverse overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
