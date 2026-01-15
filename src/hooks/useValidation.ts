import { useMemo } from 'react';

export interface ValidationError {
  field: string;
  message: string;
}

interface ValidationInput {
  loanAmount: number;
  apr: number;
  monthlyPayment: number;
  maxDuration: number;
  annualLumpSum: number;
  lumpSumYears: number;
}

export function useValidation(values: ValidationInput): ValidationError[] {
  return useMemo(() => {
    const errors: ValidationError[] = [];

    // Loan amount validation
    if (values.loanAmount <= 0) {
      errors.push({ field: 'loanAmount', message: 'Loan amount must be greater than 0' });
    } else if (values.loanAmount > 10000000) {
      errors.push({ field: 'loanAmount', message: 'Loan amount seems too high' });
    }

    // APR validation
    if (values.apr < 0) {
      errors.push({ field: 'apr', message: 'APR cannot be negative' });
    } else if (values.apr > 30) {
      errors.push({ field: 'apr', message: 'APR above 30% is unusually high' });
    }

    // Monthly payment validation
    if (values.monthlyPayment <= 0) {
      errors.push({ field: 'monthlyPayment', message: 'Monthly payment must be greater than 0' });
    } else {
      // Check if payment covers at least the monthly interest
      const monthlyInterest = (values.loanAmount * values.apr) / 100 / 12;
      if (values.monthlyPayment < monthlyInterest) {
        errors.push({
          field: 'monthlyPayment',
          message: `Payment must be at least $${Math.ceil(monthlyInterest).toLocaleString()} to cover monthly interest`,
        });
      }
    }

    // Duration validation
    if (values.maxDuration < 12) {
      errors.push({ field: 'maxDuration', message: 'Duration must be at least 12 months' });
    } else if (values.maxDuration > 600) {
      errors.push({ field: 'maxDuration', message: 'Duration cannot exceed 600 months (50 years)' });
    }

    // Lump sum validation
    if (values.annualLumpSum < 0) {
      errors.push({ field: 'annualLumpSum', message: 'Annual lump sum cannot be negative' });
    }

    if (values.lumpSumYears < 1 || values.lumpSumYears > 10) {
      errors.push({ field: 'lumpSumYears', message: 'Lump sum years must be between 1 and 10' });
    }

    return errors;
  }, [values]);
}

export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find((e) => e.field === field)?.message;
}
