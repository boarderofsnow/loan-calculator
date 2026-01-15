# Loan Calculator

A React-based student loan payoff calculator with interactive visualizations.

## Tech Stack

- React 19 with Create React App
- TypeScript for type safety
- Recharts for data visualization
- CSS custom properties for theming
- Deployed via Vercel

## Project Structure

```
src/
  types/
    index.ts              # TypeScript interfaces (Loan, Scenario, etc.)
  utils/
    calculations.ts       # Loan payoff calculations
    urlParams.ts          # URL encoding/decoding for sharing
    export.ts             # CSV export functionality
    __tests__/            # Unit tests for utilities
  hooks/
    useScenarios.ts       # Scenario management with localStorage
    useTheme.ts           # Dark/light/system theme management
    useValidation.ts      # Input validation
  components/
    inputs/
      SliderInput.tsx     # Reusable slider + number input
    display/
      SummaryCard.tsx     # Metric display card
      WarningBanner.tsx   # Warning message component
    charts/
      BalanceChart.tsx    # Balance over time area chart
      PaymentBreakdownChart.tsx  # Principal/interest stacked chart
      PrincipalInterestPie.tsx   # Pie chart for payment distribution
    scenarios/
      ScenarioCard.tsx    # Individual saved scenario
      ScenarioList.tsx    # List of saved scenarios
      SaveScenarioDialog.tsx  # Modal for saving scenarios
      ShareButton.tsx     # Copy shareable URL button
    layout/
      ThemeToggle.tsx     # Light/dark/system theme switcher
  styles/
    variables.css         # CSS custom properties (colors, spacing, breakpoints)
  App.tsx                 # Main application component
  App.test.tsx            # Integration tests
  index.tsx               # Entry point
  index.css               # Global styles
```

## Commands

- `npm start` - Run development server (localhost:3000)
- `npm test` - Run tests in watch mode
- `npm run build` - Production build
- `npx tsc --noEmit` - TypeScript type checking

## Code Patterns

- Component-based architecture with extracted reusable components
- Custom hooks for state management (useScenarios, useTheme, useValidation)
- TypeScript interfaces in `src/types/index.ts`
- CSS custom properties for theming (`--color-*`, `--spacing-*`, `--font-size-*`)
- Responsive design using `isMobile` state (breakpoint at 768px)
- Recharts `ResponsiveContainer` wraps all charts

## Key Features

- **Calculator**: Loan amount, APR, monthly payment, duration inputs with sliders
- **Lump Sum Payments**: Annual extra payments for first N years
- **Visualizations**: Balance chart, payment breakdown chart, pie chart
- **Save/Load Scenarios**: Persist scenarios to localStorage
- **Share URLs**: Copy shareable URL with encoded parameters
- **Dark Mode**: Light/dark/system theme support
- **Mobile Responsive**: Adapts layout for screens under 768px
- **CSV Export**: Download amortization schedule
- **Input Validation**: Warns when payment is below monthly interest

## Theme System

Theme is controlled via `data-theme` attribute on `<html>`:
- `light` - Light color scheme
- `dark` - Dark color scheme
- `system` - Follows OS preference

Colors are defined in `src/styles/variables.css` with dark mode overrides.
