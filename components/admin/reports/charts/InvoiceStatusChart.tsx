"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import ChartCard from "./ChartCard";

interface InvoiceStatusChartProps {
  paid: number;
  overdue: number;
  draft: number;
  sent: number;
  partial: number;
  cancelled: number;
}

const COLORS = [
  "#16a34a", // Paid
  "#dc2626", // Overdue
  "#2563eb", // Draft
  "#f59e0b", // Sent
  "#7c3aed", // Partial
  "#64748b", // Cancelled
];

export default function InvoiceStatusChart({
  paid,
  overdue,
  draft,
  sent,
  partial,
  cancelled,
}: InvoiceStatusChartProps) {
  const data = [
    { name: "Paid", value: paid },
    { name: "Overdue", value: overdue },
    { name: "Draft", value: draft },
    { name: "Sent", value: sent },
    { name: "Partial", value: partial },
    { name: "Cancelled", value: cancelled },
  ].filter((item) => item.value > 0);

  return (
    <ChartCard
      title="Invoice Status"
      description="Distribution of invoices by current status."
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}