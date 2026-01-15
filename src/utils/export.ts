import { ScheduleEntry } from '../types';

export function exportToCSV(schedule: ScheduleEntry[], filename: string = 'amortization-schedule.csv'): void {
  const headers = ['Month', 'Balance', 'Principal', 'Interest', 'Payment', 'Lump Sum'];

  const rows = schedule.map((entry) => [
    entry.month + 1, // 1-indexed for user readability
    entry.balance.toFixed(2),
    entry.principal.toFixed(2),
    entry.interest.toFixed(2),
    entry.payment.toFixed(2),
    entry.lumpSum.toFixed(2),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
