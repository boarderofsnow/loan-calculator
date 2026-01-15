import React from 'react';
import { Scenario } from '../../types';
import { ScenarioCard } from './ScenarioCard';

interface ScenarioListProps {
  scenarios: Scenario[];
  activeScenarioId: string | null;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function ScenarioList({
  scenarios,
  activeScenarioId,
  onLoad,
  onDelete,
  onDuplicate,
}: ScenarioListProps) {
  if (scenarios.length === 0) {
    return (
      <div
        style={{
          padding: 'var(--spacing-lg)',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          border: '1px dashed var(--color-border)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <p style={{ margin: 0 }}>No saved scenarios yet.</p>
        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-xs)' }}>
          Save your current configuration to compare different payment strategies.
        </p>
      </div>
    );
  }

  // Sort by creation date, newest first
  const sortedScenarios = [...scenarios].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div>
      {sortedScenarios.map((scenario) => (
        <ScenarioCard
          key={scenario.id}
          scenario={scenario}
          isActive={scenario.id === activeScenarioId}
          onLoad={() => onLoad(scenario.id)}
          onDelete={() => onDelete(scenario.id)}
          onDuplicate={() => onDuplicate(scenario.id)}
        />
      ))}
    </div>
  );
}
