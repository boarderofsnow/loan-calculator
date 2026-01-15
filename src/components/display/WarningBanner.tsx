import React from 'react';

interface WarningBannerProps {
  children: React.ReactNode;
}

export function WarningBanner({ children }: WarningBannerProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-warning)',
        border: '1px solid var(--color-border-warning)',
        padding: 'var(--spacing-md)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--spacing-lg)',
        color: 'var(--color-text-warning)',
      }}
    >
      <strong>Warning:</strong> {children}
    </div>
  );
}
