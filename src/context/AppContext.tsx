/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from 'react';
import { translations } from '../i18n/translations';
import {
  DEFAULT_SETTINGS,
  exportData,
  importData,
  loadHistory,
  loadLastCalculation,
  loadSettings,
  saveHistory,
  saveLastCalculation,
  saveSettings,
} from '../lib/storage';
import {
  AppSettings,
  HistoryRecord,
  Language,
  LastCalculationSummary,
  TabType,
  ThemeMode,
} from '../types';

interface AppContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  restoreDefaults: () => void;
  balance: number;
  setBalance: (newBalance: number) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  t: typeof translations.en;
  history: HistoryRecord[];
  addHistoryRecord: (record: Omit<HistoryRecord, 'id' | 'timestamp'>) => void;
  deleteHistoryRecord: (id: string) => void;
  editHistoryRecord: (id: string, updated: Partial<HistoryRecord>) => void;
  clearHistory: () => void;
  lastCalculation: LastCalculationSummary | null;
  recordLastCalculation: (summary: LastCalculationSummary) => void;
  isOnline: boolean;
  exportAll: () => string;
  importAll: (json: string) => { success: boolean; error?: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<AppSettings>(loadSettings);
  const [history, setHistoryState] = useState<HistoryRecord[]>(loadHistory);
  const [lastCalculation, setLastCalcState] = useState<LastCalculationSummary | null>(
    loadLastCalculation
  );
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  const language = settings.language;
  const balance = settings.balance;
  const theme = settings.theme;
  const t = translations[language];

  // Update HTML dir and lang tags when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Apply dark mode class to html element and sync theme-color meta tag
  useEffect(() => {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      if (metaTheme) metaTheme.setAttribute('content', '#0f172a');
    } else {
      document.documentElement.classList.remove('dark');
      if (metaTheme) metaTheme.setAttribute('content', '#ffffff');
    }
  }, [theme]);

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettingsState(prev => {
      const merged = { ...prev, ...newSettings };
      saveSettings(merged);
      return merged;
    });
  };

  const setBalance = (newBalance: number) => {
    const safe = isNaN(newBalance) ? 0 : Math.max(0, newBalance);
    updateSettings({ balance: safe });
  };

  const setLanguage = (newLang: Language) => {
    updateSettings({ language: newLang });
  };

  const setTheme = (newTheme: ThemeMode) => {
    updateSettings({ theme: newTheme });
  };

  const toggleTheme = () => {
    updateSettings({ theme: theme === 'dark' ? 'light' : 'dark' });
  };

  const restoreDefaults = () => {
    const restored = { ...DEFAULT_SETTINGS, balance: settings.balance };
    setSettingsState(restored);
    saveSettings(restored);
  };

  const addHistoryRecord = (record: Omit<HistoryRecord, 'id' | 'timestamp'>) => {
    const newRecord: HistoryRecord = {
      ...record,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    setHistoryState(prev => {
      const updated = [newRecord, ...prev];
      saveHistory(updated);
      return updated;
    });
  };

  const deleteHistoryRecord = (id: string) => {
    setHistoryState(prev => {
      const updated = prev.filter(r => r.id !== id);
      saveHistory(updated);
      return updated;
    });
  };

  const editHistoryRecord = (id: string, updated: Partial<HistoryRecord>) => {
    setHistoryState(prev => {
      const updatedList = prev.map(r => (r.id === id ? { ...r, ...updated } : r));
      saveHistory(updatedList);
      return updatedList;
    });
  };

  const clearHistory = () => {
    setHistoryState([]);
    saveHistory([]);
  };

  const recordLastCalculation = (summary: LastCalculationSummary) => {
    setLastCalcState(summary);
    saveLastCalculation(summary);
  };

  const exportAll = () => exportData();

  const importAll = (json: string) => {
    const result = importData(json);
    if (result.success) {
      if (result.settings) setSettingsState(result.settings);
      if (result.history) setHistoryState(result.history);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        restoreDefaults,
        balance,
        setBalance,
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        theme,
        setTheme,
        toggleTheme,
        t,
        history,
        addHistoryRecord,
        deleteHistoryRecord,
        editHistoryRecord,
        clearHistory,
        lastCalculation,
        recordLastCalculation,
        isOnline,
        exportAll,
        importAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext };
export type { AppContextType };
export { useApp } from '../hooks/useApp';
