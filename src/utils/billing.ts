import { ProrateCalculation } from '../types';

/**
 * Calculates the next 5th of the month billing date from a given starting date.
 */
export function getNextBillingDate(fromDate: Date = new Date()): Date {
  const year = fromDate.getFullYear();
  const month = fromDate.getMonth(); // 0-indexed
  const day = fromDate.getDate();

  if (day < 5) {
    // Due on the 5th of current month
    return new Date(year, month, 5, 0, 0, 0, 0);
  } else {
    // Due on the 5th of next month
    return new Date(year, month + 1, 5, 0, 0, 0, 0);
  }
}

/**
 * Calculates the start date of the current billing cycle (the previous 5th).
 */
export function getCycleStartDate(fromDate: Date = new Date()): Date {
  const year = fromDate.getFullYear();
  const month = fromDate.getMonth();
  const day = fromDate.getDate();

  if (day < 5) {
    // Cycle started on the 5th of previous month
    return new Date(year, month - 1, 5, 0, 0, 0, 0);
  } else {
    // Cycle started on the 5th of current month
    return new Date(year, month, 5, 0, 0, 0, 0);
  }
}

/**
 * Calculates prorated initial payment for hiring an agent today until the 5th of the month.
 * Cost per month: $19.00 USD
 */
export function calculateProratedPayment(
  startDate: Date = new Date(),
  monthlyCost: number = 19.0
): ProrateCalculation {
  const nextBilling = getNextBillingDate(startDate);
  const cycleStart = getCycleStartDate(startDate);

  // Calculate total days in cycle
  const diffCycleMs = nextBilling.getTime() - cycleStart.getTime();
  const totalDaysInCycle = Math.round(diffCycleMs / (1000 * 60 * 60 * 24));

  // Calculate days remaining from startDate to nextBilling
  const diffMs = nextBilling.getTime() - startDate.getTime();
  const rawDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  // At least 1 day remaining
  const daysRemaining = Math.max(1, Math.min(rawDays, totalDaysInCycle));

  const dailyRate = monthlyCost / totalDaysInCycle;
  const rawProrated = dailyRate * daysRemaining;
  const proratedPrice = Math.round(rawProrated * 100) / 100;

  return {
    startDate: startDate.toISOString(),
    nextBillingDate: nextBilling.toISOString(),
    daysRemaining,
    totalDaysInCycle,
    fullMonthlyPrice: monthlyCost,
    proratedPrice,
    dailyRate: Math.round(dailyRate * 1000) / 1000,
  };
}

/**
 * Formats date to US/English standard (e.g., 09/05/2026 or Sep 5, 2026)
 */
export function formatDateEN(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

// Alias for backwards compatibility
export const formatDateBR = formatDateEN;

/**
 * Formats currency in USD (e.g. $19.00) or BRL equivalent if needed
 */
export function formatCurrencyUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
