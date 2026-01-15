import {
  calculatePayoffSchedule,
  calculateMinimumPayment,
  formatCurrency,
  formatPercent,
  monthsToYears,
} from '../calculations';

describe('calculatePayoffSchedule', () => {
  it('calculates basic loan payoff correctly', () => {
    const result = calculatePayoffSchedule(100000, 5, {
      monthlyPayment: 2000,
      annualLumpSum: 0,
      lumpSumYears: 0,
      maxDuration: 120,
    });

    expect(result.paidOff).toBe(true);
    expect(result.totalMonths).toBeLessThan(120);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalPaid).toBe(100000 + result.totalInterest);
    expect(result.schedule.length).toBe(result.totalMonths);
  });

  it('handles zero APR correctly', () => {
    const result = calculatePayoffSchedule(10000, 0, {
      monthlyPayment: 1000,
      annualLumpSum: 0,
      lumpSumYears: 0,
      maxDuration: 120,
    });

    expect(result.paidOff).toBe(true);
    expect(result.totalMonths).toBe(10);
    expect(result.totalInterest).toBe(0);
    expect(result.totalPaid).toBe(10000);
  });

  it('applies annual lump sum payments correctly', () => {
    const withoutLumpSum = calculatePayoffSchedule(100000, 7, {
      monthlyPayment: 1500,
      annualLumpSum: 0,
      lumpSumYears: 0,
      maxDuration: 120,
    });

    const withLumpSum = calculatePayoffSchedule(100000, 7, {
      monthlyPayment: 1500,
      annualLumpSum: 5000,
      lumpSumYears: 5,
      maxDuration: 120,
    });

    expect(withLumpSum.totalMonths).toBeLessThan(withoutLumpSum.totalMonths);
    expect(withLumpSum.totalInterest).toBeLessThan(withoutLumpSum.totalInterest);
  });

  it('returns paidOff=false when loan exceeds max duration', () => {
    const result = calculatePayoffSchedule(500000, 10, {
      monthlyPayment: 1000,
      annualLumpSum: 0,
      lumpSumYears: 0,
      maxDuration: 60,
    });

    expect(result.paidOff).toBe(false);
    expect(result.totalMonths).toBe(60);
  });

  it('does not overpay on final payment', () => {
    const result = calculatePayoffSchedule(10000, 5, {
      monthlyPayment: 5000,
      annualLumpSum: 0,
      lumpSumYears: 0,
      maxDuration: 120,
    });

    const lastEntry = result.schedule[result.schedule.length - 1];
    expect(lastEntry.balance).toBe(0);
  });

  it('schedule entries have correct structure', () => {
    const result = calculatePayoffSchedule(10000, 5, {
      monthlyPayment: 1000,
      annualLumpSum: 0,
      lumpSumYears: 0,
      maxDuration: 120,
    });

    result.schedule.forEach((entry, index) => {
      expect(entry.month).toBe(index);
      expect(entry.balance).toBeGreaterThanOrEqual(0);
      expect(entry.principal).toBeGreaterThanOrEqual(0);
      expect(entry.interest).toBeGreaterThanOrEqual(0);
      expect(entry.payment).toBeGreaterThan(0);
    });
  });
});

describe('calculateMinimumPayment', () => {
  it('calculates minimum payment for standard loan', () => {
    const payment = calculateMinimumPayment(100000, 6, 120);
    // Should be around $1110 for 100k at 6% over 10 years
    expect(payment).toBeGreaterThan(1100);
    expect(payment).toBeLessThan(1120);
  });

  it('handles zero APR', () => {
    const payment = calculateMinimumPayment(12000, 0, 12);
    expect(payment).toBe(1000);
  });

  it('returns higher payment for shorter term', () => {
    const shortTerm = calculateMinimumPayment(100000, 6, 60);
    const longTerm = calculateMinimumPayment(100000, 6, 120);
    expect(shortTerm).toBeGreaterThan(longTerm);
  });

  it('returns higher payment for higher APR', () => {
    const lowApr = calculateMinimumPayment(100000, 4, 120);
    const highApr = calculateMinimumPayment(100000, 8, 120);
    expect(highApr).toBeGreaterThan(lowApr);
  });
});

describe('formatCurrency', () => {
  it('formats numbers as currency', () => {
    expect(formatCurrency(1000)).toBe('$1,000');
    expect(formatCurrency(1234567)).toBe('$1,234,567');
  });

  it('handles decimal places', () => {
    expect(formatCurrency(1234.56, 2)).toBe('$1,234.56');
    expect(formatCurrency(1234.999, 0)).toBe('$1,235');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });
});

describe('formatPercent', () => {
  it('formats numbers as percentages', () => {
    expect(formatPercent(5)).toBe('5.0%');
    expect(formatPercent(5.75, 2)).toBe('5.75%');
  });

  it('handles whole numbers', () => {
    expect(formatPercent(10, 0)).toBe('10%');
  });
});

describe('monthsToYears', () => {
  it('converts months to years', () => {
    expect(monthsToYears(12)).toBe('1.0');
    expect(monthsToYears(18)).toBe('1.5');
    expect(monthsToYears(120)).toBe('10.0');
  });
});
