"use client";

import { TrendingUp, DollarSign } from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import Card from "@/components/ui/Card";
import { RevenueDataPoint } from "@/lib/dashboard/getDashboardStats";

interface RevenueChartProps {
  monthlyRevenue: number;
  monthlyInvoices: number;
  outstandingBalance: number;
  revenueData: RevenueDataPoint[];
}

export default function RevenueChart({
  monthlyRevenue,
  monthlyInvoices,
  outstandingBalance,
  revenueData,
}: RevenueChartProps) {
  return (
    <Card
      title="Revenue Overview"
      description="Current month's financial summary"
    >
      {/* KPI Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 transition hover:shadow-md">
          <div className="mb-4 inline-flex rounded-lg bg-green-100 p-3">
            <DollarSign className="h-6 w-6 text-green-700" />
          </div>

          <p className="text-sm text-slate-500">
            Revenue This Month
          </p>

          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            ${monthlyRevenue.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 transition hover:shadow-md">
          <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3">
            <TrendingUp className="h-6 w-6 text-blue-700" />
          </div>

          <p className="text-sm text-slate-500">
            Invoices This Month
          </p>

          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {monthlyInvoices}
          </h3>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 transition hover:shadow-md">
          <div className="mb-4 inline-flex rounded-lg bg-red-100 p-3">
            <DollarSign className="h-6 w-6 text-red-700" />
          </div>

          <p className="text-sm text-slate-500">
            Outstanding Balance
          </p>

          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            ${outstandingBalance.toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Revenue Trend
          </h3>

          <p className="text-sm text-slate-500">
            Monthly revenue based on invoices
          </p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueData}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#2563eb"
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="95%"
                    stopColor="#2563eb"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                tickFormatter={(value) => `$${value}`}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
  formatter={(value) => [
    `$${Number(value).toLocaleString()}`,
    "Revenue",
  ]}
/>
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
                fill="url(#revenueGradient)"
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}