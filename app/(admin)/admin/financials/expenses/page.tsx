import ExpenseReportDashboard from "@/components/admin/financials/ExpenseReportDashboard";
import { financialPeriods, getExpenseReport, type FinancialPeriod } from "@/lib/financials/getFinancialSummary";

export default async function ExpensesPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const { period: requestedPeriod } = await searchParams;
  const period = financialPeriods.includes(requestedPeriod as FinancialPeriod) ? requestedPeriod as FinancialPeriod : "month";
  return <ExpenseReportDashboard report={await getExpenseReport(period)} />;
}
