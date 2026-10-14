import React, { useState } from 'react';
import {
  AlertCircle,
  Download,
  Edit2,
  FileText,
  Filter,
  History as HistoryIcon,
  Plus,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatEGP } from '../../lib/money';
import { HistoryRecord } from '../../types';
import { BalanceBanner } from '../common/BalanceBanner';
import { RecordModal } from '../common/RecordModal';

export const HistoryTab: React.FC = () => {
  const {
    history,
    deleteHistoryRecord,
    editHistoryRecord,
    clearHistory,
    exportAll,
    importAll,
    language,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HistoryRecord | null>(null);
  const [editNote, setEditNote] = useState('');

  // Filter history list
  const filteredHistory = history.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      searchQuery === '' ||
      item.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.amount.toString().includes(searchQuery) ||
      t.history.types[item.type].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleExport = () => {
    const json = exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vodafone-cash-history-${new Date().toISOString().split('T')[0]}.json`;
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
          alert('Data imported successfully.');
        } else {
          alert(`Failed to import data: ${res.error}`);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearAll = () => {
    if (window.confirm(t.history.confirmClear)) {
      clearHistory();
    }
  };

  const handleStartEdit = (record: HistoryRecord) => {
    setEditingRecord(record);
    setEditNote(record.note);
  };

  const handleSaveEdit = () => {
    if (editingRecord) {
      editHistoryRecord(editingRecord.id, { note: editNote.trim() });
      setEditingRecord(null);
    }
  };

  return (
    <div className="space-y-6">
      <BalanceBanner />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HistoryIcon className="w-5 h-5 text-red-600" />
              <span>{t.history.title}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.history.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setManualModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.history.addRecord}</span>
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.common.export}</span>
            </button>
            <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>{t.common.import}</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.history.clearAll}</span>
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:right-3 rtl:left-auto top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`${t.common.search}...`}
              className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            >
              <option value="all">{t.common.all}</option>
              <option value="withdrawal">{t.history.types.withdrawal}</option>
              <option value="deposit">{t.history.types.deposit}</option>
              <option value="card_issuance">{t.history.types.card_issuance}</option>
              <option value="bundle_payment">{t.history.types.bundle_payment}</option>
              <option value="adjustment">{t.history.types.adjustment}</option>
            </select>
          </div>
        </div>

        {/* History Table */}
        {filteredHistory.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left rtl:text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-3 font-semibold">{t.common.date}</th>
                  <th className="py-2.5 px-3 font-semibold">{t.common.type}</th>
                  <th className="py-2.5 px-3 font-semibold">{t.common.amount}</th>
                  <th className="py-2.5 px-3 font-semibold">{t.common.fee}</th>
                  <th className="py-2.5 px-3 font-semibold">{t.history.impact}</th>
                  <th className="py-2.5 px-3 font-semibold hidden md:table-cell">
                    {t.history.before} / {t.history.after}
                  </th>
                  <th className="py-2.5 px-3 font-semibold">{t.common.note}</th>
                  <th className="py-2.5 px-3 font-semibold text-center">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {filteredHistory.map(record => (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(record.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      {new Date(record.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-800 dark:text-slate-200">
                      {t.history.types[record.type]}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                      {formatEGP(record.amount, language)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {record.fee > 0 ? formatEGP(record.fee, language) : '-'}
                    </td>
                    <td
                      className={`py-2.5 px-3 font-bold ${
                        record.balanceImpact >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {record.balanceImpact >= 0 ? '+' : ''}
                      {formatEGP(record.balanceImpact, language)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 hidden md:table-cell text-[11px]">
                      {formatEGP(record.balanceBefore, language)} &rarr;{' '}
                      {formatEGP(record.balanceAfter, language)}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {record.note || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(record)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors mr-1"
                        title={t.common.edit}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteHistoryRecord(record.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title={t.common.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.history.noRecords}</p>
          </div>
        )}

        {/* Local storage note */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{t.app.privacyNote}</span>
        </div>
      </div>

      {/* Manual Record Modal */}
      <RecordModal
        isOpen={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        type="adjustment"
        amount={0}
        fee={0}
        defaultNote="Manual adjustment"
      />

      {/* Edit Note Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              {t.common.edit} {t.common.note}
            </h3>
            <input
              type="text"
              autoFocus
              value={editNote}
              onChange={e => setEditNote(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="flex-1 py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="flex-1 py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm"
              >
                {t.common.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
