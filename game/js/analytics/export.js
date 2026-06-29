import { analytics } from './tracker.js';

export function exportAnalyticsToCSV() {
  const events = analytics.getEvents();
  if (events.length === 0) return 'No data';
  const headers = ['type', 'timestamp', ...new Set(events.flatMap(e => Object.keys(e.data)))];
  const rows = events.map(e => {
    return headers.map(h => {
      if (h === 'type') return e.type;
      if (h === 'timestamp') return new Date(e.timestamp).toISOString();
      return JSON.stringify(e.data[h] ?? '');
    }).join(',');
  });
  return [headers.join(','), ...rows].join('\n');
}

export function downloadAnalytics() {
  const csv = exportAnalyticsToCSV();
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sovereign-analytics-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
