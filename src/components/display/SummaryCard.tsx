import React from 'react';

interface SummaryCardProps {
  label: string;
  value: string;
  subtext?: string;
  valueColor?: string;
}

export function SummaryCard({ label, value, subtext, valueColor = 'var(--color-text)' }: SummaryCardProps) {
  return (
    <div>
      <div style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
        {label}
      </div>
      <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', color: valueColor }}>
        {value}
      </div>
      {subtext && (
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          {subtext}
        </div>
      )}
    </div>
  );
}
