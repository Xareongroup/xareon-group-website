"use client";

import RevenueChart from "./charts/RevenueChart";
import { formatCurrency } from "@/lib/utils/formatters";
import type { MonthlyRevenue } from "@/lib/reports/getRevenueReport";

interface RevenueAnalyticsProps {
  totalRevenue: number;
  totalPayments: number;
  outstandingBalance: number;
  monthlyRevenue: MonthlyRevenue[];
}

export default function RevenueAnalytics({
  totalRevenue,
  totalPayments,
  outstandingBalance,
  monthlyRevenue,
}: RevenueAnalyticsProps) {
  const collectionRate =
    totalRevenue > 0
      ? (totalPayments / totalRevenue) * 100
      : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Revenue Analytics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Revenue performance and collection summary.
          </p>
        </div>

        <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
          {collectionRate.toFixed(1)}% Collected
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">
            Total Revenue
          </p>

          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {formatCurrency(totalRevenue)}
          </h3>
        </div>

        <div className="rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">
            Payments Received
          </p>

          <h3 className="mt-2 text-3xl font-bold text-emerald-600">
            {formatCurrency(totalPayments)}
          </h3>
        </div>

        <div className="rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">
            Outstanding Balance
          </p>

          <h3 className="mt-2 text-3xl font-bold text-amber-600">
            {formatCurrency(outstandingBalance)}
          </h3>
        </div>
      </div>

      <div className="mt-8">
        <RevenueChart data={monthlyRevenue} />
      </div>
    </div>
  );
}