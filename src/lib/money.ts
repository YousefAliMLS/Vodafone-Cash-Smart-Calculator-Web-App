import { Language } from '../types';

/**
 * Converts an EGP amount to integer piastres.
 * 1 EGP = 100 piastres (qirsh).
 */
export function toPiastres(egp: number): number {
  if (isNaN(egp) || !isFinite(egp)) return 0;
  return Math.round(egp * 100);
}

/**
 * Converts integer piastres back to standard EGP.
 */
export function fromPiastres(piastres: number): number {
  if (isNaN(piastres) || !isFinite(piastres)) return 0;
  return piastres / 100;
}

/**
 * Decimal-safe addition using integer piastres.
 */
export function addMoney(a: number, b: number): number {
  return fromPiastres(toPiastres(a) + toPiastres(b));
}

/**
 * Decimal-safe subtraction using integer piastres.
 */
export function subtractMoney(a: number, b: number): number {
  return fromPiastres(toPiastres(a) - toPiastres(b));
}

/**
 * Formats a currency value with appropriate commas, decimals, and Egyptian pound symbol.
 */
export function formatEGP(
  amount: number,
  lang: Language = 'en',
  decimalPlaces: number = 2
): string {
  if (isNaN(amount) || !isFinite(amount)) {
    amount = 0;
  }

  const formatted = amount.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  const currencyUnit = lang === 'ar' ? 'ج.م' : 'EGP';
  return `${formatted} ${currencyUnit}`;
}

/**
 * Formats a raw number without currency suffix.
 */
export function formatNumber(
  amount: number,
  lang: Language = 'en',
  decimalPlaces: number = 2
): string {
  if (isNaN(amount) || !isFinite(amount)) {
    return '0';
  }
  return amount.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
}

/**
 * Safely parse a localized or standard numeric string into a float.
 */
export function parseMoneyInput(input: string): number {
  if (!input) return 0;
  // Replace Arabic digits with standard ASCII digits
  const standard = input
    .replace(/[٠-٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)])
    .replace(/,/g, '')
    .trim();

  const parsed = parseFloat(standard);
  return isNaN(parsed) ? 0 : parsed;
}
