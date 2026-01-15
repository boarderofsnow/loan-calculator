import React from 'react';
import { Scenario } from '../../types';
import { formatCurrency, monthsToYears } from '../../utils/calculations';

interface ScenarioCardProps {
  scenario: Scenario;
  isActive: boolean;
  onLoad: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function ScenarioCard({
  scenario,
  isActive,
  onLoad,
  onDelete,
  onDuplicate,
}: ScenarioCardProps) {
  const { loan, payments, result } = scenario;

  return (
    <div
      style={{
        padding: 'var(--spacing-md)',
        border: isActive ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: isActive ? 'var(--color-bg-secondary)' : 'var(--color-bg)',
        marginBottom: 'var(--spacing-sm)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: 0, marginBottom: 'var(--spacing-xs)', color: 'var(--color-text)' }}>
            {scenario.name}
          </h4>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
            {formatCurrency(loan.principal)} @ {loan.apr}% APR
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
            {formatCurrency(payments.monthlyPayment)}/mo
            {payments.annualLumpSum > 0 && ` + ${formatCurrency(payments.annualLumpSum)}/yr`}
          </div>
          {result && (
            <div style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-xs)' }}>
              <span style={{ color: result.paidOff ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {result.paidOff
                  ? `Paid off in ${monthsToYears(result.totalMonths)} years`
                  : 'Will not pay off in time'}
              </span>
              <span style={{ color: 'var(--color-text-muted)', marginLeft: 'var(--spacing-sm)' }}>
                Interest: {formatCurrency(result.totalInterest)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-sm)' }}>
        <button
          onClick={onLoad}
          style={{
            padding: '4px 12px',
            fontSize: 'var(--font-size-sm)',
            backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
            color: isActive ? 'white' : 'var(--color-primary)',
            border: `1px solid var(--color-primary)`,
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        >
          {isActive ? 'Active' : 'Load'}
        </button>
        <button
          onClick={onDuplicate}
          style={{
            padding: '4px 12px',
            fontSize: 'var(--font-size-sm)',
            backgroundColor: 'transparent',
            color: 'var(--color-text-muted)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        >
          Duplicate
        </button>
        <button
          onClick={onDelete}
          style={{
            padding: '4px 12px',
            fontSize: 'var(--font-size-sm)',
            backgroundColor: 'transparent',
            color: 'var(--color-danger)',
            border: '1px solid var(--color-danger)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
