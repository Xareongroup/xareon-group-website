export type FinancialPeriod = "today" | "daily" | "weekly" | "monthly" | "quarterly" | "annually" | "ytd";

export default function FinancialFilters({ period, onPeriodChange }: { period: FinancialPeriod; onPeriodChange: (period: FinancialPeriod) => void }) {
  return <select value={period} onChange={(event) => onPeriodChange(event.target.value as FinancialPeriod)} className="rounded-xl border border-slate-300 bg-white p-3 text-sm"><option value="today">Today</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="annually">Annually</option><option value="ytd">Year To Date</option></select>;
}
