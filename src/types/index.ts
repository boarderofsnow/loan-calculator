export interface Loan {
  id: string;
  name: string;
  principal: number;
  apr: number;
}

export interface PaymentConfig {
  monthlyPayment: number;
  annualLumpSum: number;
  lumpSumYears: number;
  maxDuration: number;
}

export interface ScheduleEntry {
  month: number;
  balance: number;
  principal: number;
  interest: number;
  payment: number;
  lumpSum: number;
}

export interface PayoffResult {
  schedule: ScheduleEntry[];
  totalMonths: number;
  totalInterest: number;
  totalPaid: number;
  paidOff: boolean;
}

export interface Scenario {
  id: string;
  name: string;
  loan: Loan;
  payments: PaymentConfig;
  result?: PayoffResult;
  createdAt: number;
}

export type Theme = 'light' | 'dark' | 'system';
