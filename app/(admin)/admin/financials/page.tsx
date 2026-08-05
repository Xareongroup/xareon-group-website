import FinancialDashboard from "@/components/admin/financials/FinancialDashboard";
import { financialPeriods, getFinancialSummary, type FinancialPeriod } from "@/lib/financials/getFinancialSummary";

export default async function FinancialsPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const { period: requestedPeriod } = await searchParams;
  const period: FinancialPeriod = financialPeriods.includes(requestedPeriod as FinancialPeriod) ? requestedPeriod as FinancialPeriod : "month";
  const summary = await getFinancialSummary(period);
  return <FinancialDashboard summary={summary} />;
}
