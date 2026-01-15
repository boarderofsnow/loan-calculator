import React, { useState, useMemo, useEffect } from 'react';
import { SliderInput } from './components/inputs/SliderInput';
import { SummaryCard } from './components/display/SummaryCard';
import { WarningBanner } from './components/display/WarningBanner';
import { BalanceChart } from './components/charts/BalanceChart';
import { PaymentBreakdownChart } from './components/charts/PaymentBreakdownChart';
import { PrincipalInterestPie } from './components/charts/PrincipalInterestPie';
import { ScenarioList } from './components/scenarios/ScenarioList';
import { SaveScenarioDialog } from './components/scenarios/SaveScenarioDialog';
import { ShareButton } from './components/scenarios/ShareButton';
import { ThemeToggle } from './components/layout/ThemeToggle';
import { calculatePayoffSchedule, formatCurrency, formatPercent, monthsToYears } from './utils/calculations';
import { decodeScenarioFromUrl, clearUrlParams } from './utils/urlParams';
import { exportToCSV } from './utils/export';
import { useScenarios } from './hooks/useScenarios';
import { useTheme } from './hooks/useTheme';
import { useValidation, getFieldError } from './hooks/useValidation';
import { Loan, PaymentConfig } from './types';

export default function StudentLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(450000);
  const [apr, setApr] = useState(7.0);
  const [monthlyPayment, setMonthlyPayment] = useState(5000);
  const [maxDuration, setMaxDuration] = useState(120);
  const [annualLumpSum, setAnnualLumpSum] = useState(5000);
  const [lumpSumYears, setLumpSumYears] = useState(5);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { theme, setTheme } = useTheme();

  const {
    scenarios,
    activeScenarioId,
    saveScenario,
    deleteScenario,
    duplicateScenario,
    loadScenario,
    clearActiveScenario,
  } = useScenarios();

  const validationErrors = useValidation({
    loanAmount,
    apr,
    monthlyPayment,
    maxDuration,
    annualLumpSum,
    lumpSumYears,
  });

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load scenario from URL on mount
  useEffect(() => {
    const urlData = decodeScenarioFromUrl(window.location.search);
    if (urlData) {
      setLoanAmount(urlData.loan.principal);
      setApr(urlData.loan.apr);
      setMonthlyPayment(urlData.payments.monthlyPayment);
      setMaxDuration(urlData.payments.maxDuration);
      setAnnualLumpSum(urlData.payments.annualLumpSum);
      setLumpSumYears(urlData.payments.lumpSumYears);
      clearUrlParams();
    }
  }, []);

  const loan: Loan = useMemo(
    () => ({
      id: 'current',
      name: 'Current Loan',
      principal: loanAmount,
      apr,
    }),
    [loanAmount, apr]
  );

  const paymentConfig: PaymentConfig = useMemo(
    () => ({
      monthlyPayment,
      annualLumpSum,
      lumpSumYears,
      maxDuration,
    }),
    [monthlyPayment, annualLumpSum, lumpSumYears, maxDuration]
  );

  const result = useMemo(
    () => calculatePayoffSchedule(loanAmount, apr, paymentConfig),
    [loanAmount, apr, paymentConfig]
  );

  const years = monthsToYears(result.totalMonths);
  const interestRatio = (result.totalInterest / loanAmount) * 100;

  const handleSaveScenario = (name: string) => {
    saveScenario(name, loan, paymentConfig, result);
  };

  const handleLoadScenario = (id: string) => {
    const scenario = loadScenario(id);
    if (scenario) {
      setLoanAmount(scenario.loan.principal);
      setApr(scenario.loan.apr);
      setMonthlyPayment(scenario.payments.monthlyPayment);
      setMaxDuration(scenario.payments.maxDuration);
      setAnnualLumpSum(scenario.payments.annualLumpSum);
      setLumpSumYears(scenario.payments.lumpSumYears);
    }
  };

  const handleNewScenario = () => {
    clearActiveScenario();
    setLoanAmount(450000);
    setApr(7.0);
    setMonthlyPayment(5000);
    setMaxDuration(120);
    setAnnualLumpSum(5000);
    setLumpSumYears(5);
  };

  const handleExportCSV = () => {
    exportToCSV(result.schedule, `loan-amortization-${Date.now()}.csv`);
  };

  const monthlyPaymentError = getFieldError(validationErrors, 'monthlyPayment');

  return (
    <div
      style={{
        padding: isMobile ? 'var(--spacing-md)' : 'var(--spacing-lg)',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 'var(--spacing-md)' : '0',
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        <h1
          style={{
            color: 'var(--color-primary)',
            margin: 0,
            fontSize: isMobile ? 'var(--font-size-lg)' : 'var(--font-size-xl)',
          }}
        >
          Student Loan Payoff Calculator
        </h1>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--spacing-sm)',
            justifyContent: isMobile ? 'space-between' : 'flex-end',
          }}
        >
          <ThemeToggle theme={theme} onThemeChange={setTheme} />
          <ShareButton loan={loan} payments={paymentConfig} />
          <button
            onClick={() => setShowSaveDialog(true)}
            style={{
              padding: '8px 16px',
              fontSize: 'var(--font-size-base)',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              flex: isMobile ? '1' : 'none',
            }}
          >
            Save
          </button>
          <button
            onClick={() => setShowScenarios(!showScenarios)}
            style={{
              padding: '8px 16px',
              fontSize: 'var(--font-size-base)',
              backgroundColor: showScenarios ? 'var(--color-bg-secondary)' : 'transparent',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              flex: isMobile ? '1' : 'none',
            }}
          >
            {showScenarios ? 'Hide' : 'Show'} ({scenarios.length})
          </button>
        </div>
      </div>

      {/* Scenarios Panel */}
      {showScenarios && (
        <div
          style={{
            marginBottom: 'var(--spacing-xl)',
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--spacing-md)',
              flexWrap: 'wrap',
              gap: 'var(--spacing-sm)',
            }}
          >
            <h2 style={{ fontSize: 'var(--font-size-lg)', margin: 0, color: 'var(--color-text)' }}>
              Saved Scenarios
            </h2>
            <button
              onClick={handleNewScenario}
              style={{
                padding: '6px 12px',
                fontSize: 'var(--font-size-sm)',
                backgroundColor: 'transparent',
                color: 'var(--color-primary)',
                border: '1px solid var(--color-primary)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              + New Scenario
            </button>
          </div>
          <ScenarioList
            scenarios={scenarios}
            activeScenarioId={activeScenarioId}
            onLoad={handleLoadScenario}
            onDelete={deleteScenario}
            onDuplicate={duplicateScenario}
          />
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        {/* Loan Details Section */}
        <div>
          <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)', color: 'var(--color-text)' }}>
            Loan Details
          </h2>

          <SliderInput
            label="Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            min={1000}
            max={500000}
            step={1000}
            formatValue={(v) => formatCurrency(v)}
          />

          <SliderInput
            label="APR"
            value={apr}
            onChange={setApr}
            min={0}
            max={15}
            step={0.1}
            formatValue={(v) => formatPercent(v, 2)}
            numberInputProps={{ step: 0.1 }}
          />

          <SliderInput
            label="Monthly Payment"
            value={monthlyPayment}
            onChange={setMonthlyPayment}
            min={50}
            max={10000}
            step={50}
            formatValue={(v) => formatCurrency(v)}
          />
          {monthlyPaymentError && (
            <div style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)', marginTop: '-10px', marginBottom: 'var(--spacing-md)' }}>
              {monthlyPaymentError}
            </div>
          )}

          <SliderInput
            label={`Maximum Payoff Duration (${monthsToYears(maxDuration)} years)`}
            value={maxDuration}
            onChange={setMaxDuration}
            min={12}
            max={600}
            step={6}
            formatValue={(v) => `${v} months`}
          />
        </div>

        {/* Annual Lump Sum Section */}
        <div>
          <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)', color: 'var(--color-text)' }}>
            Annual Lump Sum Payments
          </h2>
          <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }}>
            Optional extra payment made at the end of each year
          </p>

          <SliderInput
            label="Annual Lump Sum Amount"
            value={annualLumpSum}
            onChange={setAnnualLumpSum}
            min={0}
            max={50000}
            step={500}
            formatValue={(v) => formatCurrency(v)}
          />

          <SliderInput
            label="Apply Annual Payment For"
            value={lumpSumYears}
            onChange={(v) => setLumpSumYears(Math.min(10, Math.max(1, v)))}
            min={1}
            max={10}
            step={1}
            formatValue={(v) => `${v} years`}
            numberInputProps={{ min: 1, max: 10 }}
          />

          {annualLumpSum > 0 && (
            <div
              style={{
                backgroundColor: 'var(--color-bg-info)',
                border: '1px solid var(--color-border-info)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                marginTop: 'var(--spacing-lg)',
              }}
            >
              <div style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-info)', marginBottom: 'var(--spacing-sm)' }}>
                <strong>Annual Payment Schedule:</strong>
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-info)' }}>
                {formatCurrency(annualLumpSum)} will be applied at months:{' '}
                {Array.from({ length: lumpSumYears }, (_, i) => (i + 1) * 12).join(', ')}
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-info)', marginTop: 'var(--spacing-sm)' }}>
                <strong>Total extra payments:</strong> {formatCurrency(annualLumpSum * lumpSumYears)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Warning */}
      {!result.paidOff && (
        <WarningBanner>
          With current payment settings, the loan will not be fully paid off within {maxDuration} months. Consider
          increasing your monthly payment or adding larger annual lump sum payments.
        </WarningBanner>
      )}

      {/* Summary Grid */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--spacing-xl)',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: 'var(--spacing-lg)',
        }}
      >
        <SummaryCard
          label="Payoff Time"
          value={result.paidOff ? `${years} years` : `>${monthsToYears(maxDuration)} years`}
          subtext={result.paidOff ? `(${result.totalMonths} months)` : `(exceeds ${maxDuration} months)`}
          valueColor="var(--color-primary)"
        />
        <SummaryCard
          label="Total Interest"
          value={formatCurrency(result.totalInterest)}
          valueColor="var(--color-danger)"
        />
        <SummaryCard
          label="Total Paid"
          value={formatCurrency(result.totalPaid)}
          valueColor="var(--color-text)"
        />
        <SummaryCard
          label="Interest Rate"
          value={formatPercent(interestRatio)}
          subtext="of original loan"
          valueColor="var(--color-purple)"
        />
      </div>

      {/* Pie Chart */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        <div>
          <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)', color: 'var(--color-text)' }}>
            Payment Distribution
          </h2>
          <PrincipalInterestPie principal={loanAmount} totalInterest={result.totalInterest} />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', margin: 0, color: 'var(--color-text)' }}>
              Loan Balance Over Time
            </h2>
            <button
              onClick={handleExportCSV}
              style={{
                padding: '6px 12px',
                fontSize: 'var(--font-size-sm)',
                backgroundColor: 'transparent',
                color: 'var(--color-primary)',
                border: '1px solid var(--color-primary)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              Export CSV
            </button>
          </div>
          <BalanceChart schedule={result.schedule} />
        </div>
      </div>

      {/* Payment Breakdown Chart */}
      <h2
        style={{
          fontSize: 'var(--font-size-lg)',
          marginBottom: 'var(--spacing-md)',
          color: 'var(--color-text)',
        }}
      >
        Principal vs Interest Breakdown
      </h2>
      <PaymentBreakdownChart schedule={result.schedule} />

      {/* Save Dialog */}
      <SaveScenarioDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveScenario}
        defaultName={`Scenario ${scenarios.length + 1}`}
      />
    </div>
  );
}
