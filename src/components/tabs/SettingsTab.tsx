import React, { useState } from 'react';
import { Download, Info, RotateCcw, Save, Settings, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FeeMode, RoundingPolicy } from '../../types';
import { BalanceBanner } from '../common/BalanceBanner';

export const SettingsTab: React.FC = () => {
  const { settings, updateSettings, restoreDefaults, exportAll, importAll, t } = useApp();

  const [feeMode, setFeeMode] = useState<FeeMode>(settings.feeMode);
  const [feePercent, setFeePercent] = useState(settings.withdrawalFeePercent.toString());
  const [fixedFee, setFixedFee] = useState(settings.fixedFeePerThousand.toString());
  const [roundingPolicy, setRoundingPolicy] = useState<RoundingPolicy>(settings.feeRoundingPolicy);
  const [atmLimit, setAtmLimit] = useState(settings.atmLimitPerTx.toString());
  const [cardFee, setCardFee] = useState(settings.cardIssuanceFee.toString());
  const [bundlePrice, setBundlePrice] = useState(settings.defaultBundlePrice.toString());
  const [taxRate, setTaxRate] = useState(settings.defaultTaxRate.toString());
  const [bundleIncludesTax, setBundleIncludesTax] = useState(settings.bundleIncludesTax);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      feeMode,
      withdrawalFeePercent: parseFloat(feePercent) || 1.0,
      fixedFeePerThousand: parseFloat(fixedFee) || 10.0,
      feeRoundingPolicy: roundingPolicy,
      atmLimitPerTx: parseFloat(atmLimit) || 8000.0,
      cardIssuanceFee: parseFloat(cardFee) || 10.0,
      defaultBundlePrice: parseFloat(bundlePrice) || 296.4,
      defaultTaxRate: parseFloat(taxRate) || 14.0,
      bundleIncludesTax,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRestore = () => {
    if (window.confirm(t.settings.confirmRestore)) {
      restoreDefaults();
      setFeeMode('percentage');
      setFeePercent('1.0');
      setFixedFee('10.0');
      setRoundingPolicy('proportional');
      setAtmLimit('8000.0');
      setCardFee('10.0');
      setBundlePrice('296.4');
      setTaxRate('14.0');
      setBundleIncludesTax(true);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleExport = () => {
    const json = exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vodafone-cash-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const res = importAll(content);
        if (res.success) {
          alert('Settings and data imported successfully.');
        } else {
          alert(`Failed to import data: ${res.error}`);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <BalanceBanner />

      <form
        onSubmit={handleSave}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-red-600" />
              <span>{t.settings.title}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.settings.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestore}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.settings.restoreDefaults}</span>
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.common.save}</span>
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold">
            Settings updated and saved to localStorage.
          </div>
        )}

        {/* Section 1: Fee Configuration */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            {t.settings.feeSection}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.settings.feeMode}
              </label>
              <select
                value={feeMode}
                onChange={e => setFeeMode(e.target.value as FeeMode)}
                className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="percentage">Percentage Rate (%)</option>
                <option value="fixed_per_thousand">Fixed Fee per 1,000 EGP</option>
              </select>
            </div>

            {feeMode === 'percentage' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.settings.feePercentage}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={feePercent}
                  onChange={e => setFeePercent(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-mono font-medium border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.settings.fixedPerThousand}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={fixedFee}
                    onChange={e => setFixedFee(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono font-medium border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.settings.roundingPolicy}
                  </label>
                  <select
                    value={roundingPolicy}
                    onChange={e => setRoundingPolicy(e.target.value as RoundingPolicy)}
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="proportional">{t.settings.roundingProportional}</option>
                    <option value="ceil">{t.settings.roundingCeil}</option>
                    <option value="floor">{t.settings.roundingFloor}</option>
                    <option value="nearest">{t.settings.roundingNearest}</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 2: Limits and Card Fees */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            {t.settings.limitsSection}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.settings.atmLimit}
              </label>
              <input
                type="number"
                value={atmLimit}
                onChange={e => setAtmLimit(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono font-medium border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.settings.cardIssuanceFee}
              </label>
              <input
                type="number"
                value={cardFee}
                onChange={e => setCardFee(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono font-medium border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Bundle Defaults */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            {t.settings.bundleSection}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.settings.defaultBundlePrice}
              </label>
              <input
                type="number"
                step="0.01"
                value={bundlePrice}
                onChange={e => setBundlePrice(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono font-medium border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.settings.defaultTaxRate}
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={e => setTaxRate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono font-medium border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="bundleIncludesTax"
                checked={bundleIncludesTax}
                onChange={e => setBundleIncludesTax(e.target.checked)}
                className="rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <label
                htmlFor="bundleIncludesTax"
                className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                {t.settings.bundleIncludesTax}
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Data Export / Import */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            {t.settings.dataSection}
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.settings.exportSettings}</span>
            </button>
            <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>{t.settings.importSettings}</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>{t.settings.assumptionNotice}</span>
        </div>
      </form>
    </div>
  );
};
