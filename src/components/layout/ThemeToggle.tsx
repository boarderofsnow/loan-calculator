import React from 'react';
import { Theme } from '../../types';

interface ThemeToggleProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  const themes: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRadius: 'var(--radius-sm)',
        padding: '2px',
      }}
    >
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => onThemeChange(t.value)}
          title={t.label}
          style={{
            padding: '6px 10px',
            fontSize: 'var(--font-size-sm)',
            backgroundColor: theme === t.value ? 'var(--color-bg)' : 'transparent',
            color: 'var(--color-text)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            boxShadow: theme === t.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}
