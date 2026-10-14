import React from 'react';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { ATMPlannerTab } from './components/tabs/ATMPlannerTab';
import { DashboardTab } from './components/tabs/DashboardTab';
import { HistoryTab } from './components/tabs/HistoryTab';
import { InternetBundleTab } from './components/tabs/InternetBundleTab';
import { QuickDepositTab } from './components/tabs/QuickDepositTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { VirtualCardTab } from './components/tabs/VirtualCardTab';
import { WithdrawalTab } from './components/tabs/WithdrawalTab';
import { useApp } from './context/AppContext';

export const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <Header />
      <Navigation />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'withdrawals' && <WithdrawalTab />}
        {activeTab === 'atm_planner' && <ATMPlannerTab />}
        {activeTab === 'virtual_card' && <VirtualCardTab />}
        {activeTab === 'internet_bundle' && <InternetBundleTab />}
        {activeTab === 'quick_deposit' && <QuickDepositTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>

      <Footer />
    </div>
  );
};
