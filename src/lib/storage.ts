import { AppSettings, HistoryRecord, LastCalculationSummary } from '../types';

export const DEFAULT_SETTINGS: AppSettings = {
  balance: 10107.08,
  withdrawalFeePercent: 1.0,
  fixedFeePerThousand: 10.0,
  feeMode: 'percentage',
  feeRoundingPolicy: 'proportional',
  cardIssuanceFee: 10.0,
  atmLimitPerTx: 8000.0,
  defaultBundlePrice: 296.4,
  bundleIncludesTax: true,
  defaultTaxRate: 14.0,
  depositRounding: 'whole',
  language: 'en',
  decimalPrecision: 2,
  theme: 'dark',
};

const STORAGE_KEYS = {
  SETTINGS: 'vf_calc_settings_v1',
  HISTORY: 'vf_calc_history_v1',
  LAST_CALC: 'vf_calc_last_calc_v1',
};

/**
 * Loads application settings from localStorage. Falls back to defaults.
 */
export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      theme: parsed.theme === 'light' ? 'light' : 'dark',
      balance:
        typeof parsed.balance === 'number' && isFinite(parsed.balance)
          ? parsed.balance
          : DEFAULT_SETTINGS.balance,
      withdrawalFeePercent:
        typeof parsed.withdrawalFeePercent === 'number'
          ? parsed.withdrawalFeePercent
          : DEFAULT_SETTINGS.withdrawalFeePercent,
      fixedFeePerThousand:
        typeof parsed.fixedFeePerThousand === 'number'
          ? parsed.fixedFeePerThousand
          : DEFAULT_SETTINGS.fixedFeePerThousand,
      cardIssuanceFee:
        typeof parsed.cardIssuanceFee === 'number'
          ? parsed.cardIssuanceFee
          : DEFAULT_SETTINGS.cardIssuanceFee,
      atmLimitPerTx:
        typeof parsed.atmLimitPerTx === 'number'
          ? parsed.atmLimitPerTx
          : DEFAULT_SETTINGS.atmLimitPerTx,
      defaultBundlePrice:
        typeof parsed.defaultBundlePrice === 'number'
          ? parsed.defaultBundlePrice
          : DEFAULT_SETTINGS.defaultBundlePrice,
      defaultTaxRate:
        typeof parsed.defaultTaxRate === 'number'
          ? parsed.defaultTaxRate
          : DEFAULT_SETTINGS.defaultTaxRate,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Saves application settings to localStorage.
 */
export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
}

/**
 * Loads transaction history from localStorage.
 */
export function loadHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      item => item && typeof item.id === 'string' && typeof item.amount === 'number'
    );
  } catch {
    return [];
  }
}

/**
 * Saves transaction history to localStorage.
 */
export function saveHistory(history: HistoryRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save history to localStorage:', error);
  }
}

/**
 * Loads last calculation summary.
 */
export function loadLastCalculation(): LastCalculationSummary | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_CALC);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Saves last calculation summary.
 */
export function saveLastCalculation(calc: LastCalculationSummary): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_CALC, JSON.stringify(calc));
  } catch (error) {
    console.error('Failed to save last calculation:', error);
  }
}

/**
 * Exports settings and history as a JSON string for backup.
 */
export function exportData(): string {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    settings: loadSettings(),
    history: loadHistory(),
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Validates and imports data from a JSON string.
 */
export function importData(jsonString: string): {
  success: boolean;
  settings?: AppSettings;
  history?: HistoryRecord[];
  error?: string;
} {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Invalid file format. Expected a JSON object.' };
    }

    let importedSettings: AppSettings | undefined = undefined;
    if (data.settings && typeof data.settings === 'object') {
      const validSettings: AppSettings = {
        ...DEFAULT_SETTINGS,
        ...data.settings,
        balance:
          typeof data.settings.balance === 'number'
            ? data.settings.balance
            : DEFAULT_SETTINGS.balance,
      };
      importedSettings = validSettings;
      saveSettings(validSettings);
    }

    let importedHistory: HistoryRecord[] | undefined = undefined;
    if (Array.isArray(data.history)) {
      const validHistory: HistoryRecord[] = data.history.filter(
        (item: unknown): item is HistoryRecord =>
          typeof item === 'object' &&
          item !== null &&
          typeof (item as HistoryRecord).id === 'string' &&
          typeof (item as HistoryRecord).amount === 'number'
      );
      importedHistory = validHistory;
      saveHistory(validHistory);
    }

    return {
      success: true,
      settings: importedSettings,
      history: importedHistory,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse JSON file.',
    };
  }
}
