import React, { useState } from 'react';
import { Loan, PaymentConfig } from '../../types';
import { encodeScenarioToUrl, copyToClipboard } from '../../utils/urlParams';

interface ShareButtonProps {
  loan: Loan;
  payments: PaymentConfig;
}

export function ShareButton({ loan, payments }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = encodeScenarioToUrl(loan, payments);
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      style={{
        padding: '8px 16px',
        fontSize: 'var(--font-size-base)',
        backgroundColor: copied ? 'var(--color-success)' : 'transparent',
        color: copied ? 'white' : 'var(--color-primary)',
        border: `1px solid ${copied ? 'var(--color-success)' : 'var(--color-primary)'}`,
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {copied ? 'Link Copied!' : 'Share'}
    </button>
  );
}
