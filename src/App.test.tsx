import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock ResizeObserver for Recharts
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

describe('App', () => {
  test('renders loan calculator title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Student Loan Payoff Calculator/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders loan details section', () => {
    render(<App />);
    expect(screen.getByText(/Loan Details/i)).toBeInTheDocument();
  });

  test('renders summary cards', () => {
    render(<App />);
    expect(screen.getByText(/Payoff Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Interest/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Paid/i)).toBeInTheDocument();
  });

  test('renders annual lump sum section', () => {
    render(<App />);
    expect(screen.getByText(/Annual Lump Sum Payments/i)).toBeInTheDocument();
  });

  test('renders theme toggle', () => {
    render(<App />);
    // Theme toggle has emoji buttons
    expect(screen.getByTitle('Light')).toBeInTheDocument();
    expect(screen.getByTitle('Dark')).toBeInTheDocument();
    expect(screen.getByTitle('System')).toBeInTheDocument();
  });

  test('renders share and save buttons', () => {
    render(<App />);
    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('toggles scenarios panel', () => {
    render(<App />);
    const toggleButton = screen.getByText(/Show \(0\)/i);
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.getByText(/Saved Scenarios/i)).toBeInTheDocument();
    expect(screen.getByText(/No saved scenarios yet/i)).toBeInTheDocument();
  });

  test('renders export CSV button', () => {
    render(<App />);
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });

  test('renders pie chart section', () => {
    render(<App />);
    expect(screen.getByText(/Payment Distribution/i)).toBeInTheDocument();
  });

  test('renders charts', () => {
    render(<App />);
    expect(screen.getByText(/Loan Balance Over Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Principal vs Interest Breakdown/i)).toBeInTheDocument();
  });

  test('opens save dialog when save button clicked', () => {
    render(<App />);
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    expect(screen.getByText('Save Scenario')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter scenario name/i)).toBeInTheDocument();
  });
});
