import React from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  formatValue?: (value: number) => string;
  numberInputProps?: {
    min?: number;
    max?: number;
    step?: number;
  };
}

export function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  formatValue,
  numberInputProps,
}: SliderInputProps) {
  const displayValue = formatValue ? formatValue(value) : value.toString();

  return (
    <div style={{ marginBottom: 'var(--spacing-md)' }}>
      <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: 500 }}>
        {label}: {displayValue}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%' }}
      />
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={numberInputProps?.min}
        max={numberInputProps?.max}
        step={numberInputProps?.step ?? step}
        style={{
          width: '100%',
          padding: 'var(--spacing-sm)',
          marginTop: 'var(--spacing-xs)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text)',
        }}
      />
    </div>
  );
}
