import { useState, useEffect, useCallback } from 'react';
import { Scenario, Loan, PaymentConfig, PayoffResult } from '../types';

const STORAGE_KEY = 'loan-calculator-scenarios';

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  // Load scenarios from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setScenarios(parsed);
      }
    } catch (error) {
      console.error('Failed to load scenarios:', error);
    }
  }, []);

  // Save scenarios to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
    } catch (error) {
      console.error('Failed to save scenarios:', error);
    }
  }, [scenarios]);

  const saveScenario = useCallback(
    (
      name: string,
      loan: Loan,
      payments: PaymentConfig,
      result: PayoffResult
    ): Scenario => {
      const newScenario: Scenario = {
        id: generateId(),
        name,
        loan,
        payments,
        result,
        createdAt: Date.now(),
      };
      setScenarios((prev) => [...prev, newScenario]);
      return newScenario;
    },
    []
  );

  const updateScenario = useCallback(
    (
      id: string,
      updates: Partial<Omit<Scenario, 'id' | 'createdAt'>>
    ): void => {
      setScenarios((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
      );
    },
    []
  );

  const deleteScenario = useCallback((id: string): void => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
    if (activeScenarioId === id) {
      setActiveScenarioId(null);
    }
  }, [activeScenarioId]);

  const duplicateScenario = useCallback(
    (id: string): Scenario | null => {
      const original = scenarios.find((s) => s.id === id);
      if (!original) return null;

      const duplicate: Scenario = {
        ...original,
        id: generateId(),
        name: `${original.name} (copy)`,
        createdAt: Date.now(),
      };
      setScenarios((prev) => [...prev, duplicate]);
      return duplicate;
    },
    [scenarios]
  );

  const loadScenario = useCallback(
    (id: string): Scenario | null => {
      const scenario = scenarios.find((s) => s.id === id);
      if (scenario) {
        setActiveScenarioId(id);
      }
      return scenario || null;
    },
    [scenarios]
  );

  const clearActiveScenario = useCallback(() => {
    setActiveScenarioId(null);
  }, []);

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || null;

  return {
    scenarios,
    activeScenario,
    activeScenarioId,
    saveScenario,
    updateScenario,
    deleteScenario,
    duplicateScenario,
    loadScenario,
    clearActiveScenario,
  };
}
