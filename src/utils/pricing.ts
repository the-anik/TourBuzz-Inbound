import { CurrencyCode } from '../types/tour';

export const CURRENCY_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 154.5,
  BDT: 121.5,
};

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  BDT: '৳',
};

/**
 * Converts price in USD to selected target currency.
 */
export function convertPrice(amountUSD: number, targetCurrency: CurrencyCode): number {
  if (amountUSD <= 0) return 0;
  const rate = CURRENCY_RATES[targetCurrency] || 1;
  const converted = amountUSD * rate;
  // JPY and BDT normally display rounded to integer, EUR and GBP to 2 decimals
  if (targetCurrency === 'JPY' || targetCurrency === 'BDT') {
    return Math.round(converted);
  }
  return Math.round(converted * 100) / 100;
}

/**
 * Formats price with proper symbol and separators.
 */
export function formatPrice(amountUSD: number, targetCurrency: CurrencyCode): string {
  const converted = convertPrice(amountUSD, targetCurrency);
  const symbol = CURRENCY_SYMBOLS[targetCurrency];
  
  if (targetCurrency === 'JPY' || targetCurrency === 'BDT') {
    return `${symbol}${converted.toLocaleString()}`;
  }
  return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Calculates total booking amount including guest multiplier and optional discounts.
 */
export function calculateBookingTotal(priceUSD: number, guestCount: number, soloSupplement = 0): number {
  if (guestCount < 1) return 0;
  const base = priceUSD * guestCount;
  return guestCount === 1 ? base + soloSupplement : base;
}
