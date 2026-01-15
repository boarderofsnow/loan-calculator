import { Loan, PaymentConfig } from '../types';

interface UrlScenarioData {
  loan: Loan;
  payments: PaymentConfig;
}

export function encodeScenarioToUrl(loan: Loan, payments: PaymentConfig): string {
  const params = new URLSearchParams();
  params.set('principal', loan.principal.toString());
  params.set('apr', loan.apr.toString());
  params.set('payment', payments.monthlyPayment.toString());
  params.set('duration', payments.maxDuration.toString());
  params.set('lumpsum', payments.annualLumpSum.toString());
  params.set('lumpyears', payments.lumpSumYears.toString());
  if (loan.name) {
    params.set('name', loan.name);
  }
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

export function decodeScenarioFromUrl(search: string): UrlScenarioData | null {
  try {
    const params = new URLSearchParams(search);

    const principal = params.get('principal');
    const apr = params.get('apr');
    const payment = params.get('payment');

    // Require at least the basic loan params
    if (!principal || !apr || !payment) {
      return null;
    }

    const loan: Loan = {
      id: 'url-imported',
      name: params.get('name') || 'Shared Scenario',
      principal: parseFloat(principal),
      apr: parseFloat(apr),
    };

    const payments: PaymentConfig = {
      monthlyPayment: parseFloat(payment),
      maxDuration: parseInt(params.get('duration') || '120', 10),
      annualLumpSum: parseFloat(params.get('lumpsum') || '0'),
      lumpSumYears: parseInt(params.get('lumpyears') || '5', 10),
    };

    // Validate the parsed values
    if (
      isNaN(loan.principal) ||
      isNaN(loan.apr) ||
      isNaN(payments.monthlyPayment) ||
      isNaN(payments.maxDuration) ||
      isNaN(payments.annualLumpSum) ||
      isNaN(payments.lumpSumYears)
    ) {
      return null;
    }

    return { loan, payments };
  } catch {
    return null;
  }
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false);
}

export function clearUrlParams(): void {
  window.history.replaceState({}, '', window.location.pathname);
}
