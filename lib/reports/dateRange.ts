export function getReportStartDate(range: string): string | null {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  switch (range) {
    case "today": return start.toISOString();
    case "7d": start.setDate(start.getDate() - 6); return start.toISOString();
    case "30d": start.setDate(start.getDate() - 29); return start.toISOString();
    case "90d": start.setDate(start.getDate() - 89); return start.toISOString();
    case "year": start.setMonth(0, 1); return start.toISOString();
    default: return null;
  }
}
