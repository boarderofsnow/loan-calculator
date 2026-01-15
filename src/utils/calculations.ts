import { ScheduleEntry, PayoffResult, PaymentConfig } from '../types';

export function calculatePayoffSchedule(
  principal: number,
  apr: number,
  payments: PaymentConfig
): PayoffResult {
  let balance = principal;
  let month = 0;
  const monthlyRate = apr / 100 / 12;
  const schedule: ScheduleEntry[] = [];
  let totalInterest = 0;
  const maxLumpSumMonths = payments.lumpSumYears * 12;

  while (balance > 0 && month < payments.maxDuration) {
    const interestCharge = balance * monthlyRate;
    totalInterest += interestCharge;

    let principalPayment = payments.monthlyPayment - interestCharge;

    // Check if this is the end of a year and within the lump sum period
    const isYearEnd = (month + 1) % 12 === 0;
    const withinLumpSumPeriod = month < maxLumpSumMonths;

    if (isYearEnd && withinLumpSumPeriod && payments.annualLumpSum > 0) {
      principalPayment += payments.annualLumpSum;
    }

    // Don't overpay
    if (principalPayment > balance) {
      principalPayment = balance;
    }

    balance -= principalPayment;

    schedule.push({
      month,
      balance: Math.max(0, balance),
      principal: principalPayment,
      interest: interestCharge,
      payment: principalPayment + interestCharge,
      lumpSum: isYearEnd && withinLumpSumPeriod && payments.annualLumpSum > 0 ? payments.annualLumpSum : 0,
    });

    month++;

    if (balance <= 0) break;
  }

  return {
    schedule,
    totalMonths: month,
    totalInterest,
    totalPaid: principal + totalInterest,
    paidOff: balance <= 0,
  };
}

export function calculateMinimumPayment(
  principal: number,
  apr: number,
  termMonths: number
): number {
  const monthlyRate = apr / 100 / 12;
  if (monthlyRate === 0) {
    return principal / termMonths;
  }
  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)
  );
}

export function formatCurrency(value: number, maximumFractionDigits = 0): string {
  return '$' + value.toLocaleString(undefined, { maximumFractionDigits });
}

export function formatPercent(value: number, decimals = 1): string {
  return value.toFixed(decimals) + '%';
}

export function monthsToYears(months: number): string {
  return (months / 12).toFixed(1);
}
