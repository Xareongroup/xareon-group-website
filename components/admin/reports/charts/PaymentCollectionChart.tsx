"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ChartCard from "./ChartCard";

interface PaymentCollectionChartProps {
  collected: number;
  outstanding: number;
}

export default function PaymentCollectionChart({
  collected,
  outstanding,
}: PaymentCollectionChartProps) {
  const data = [
    {
      name: "Collected",
      amount: collected,
    },
    {
      name: "Outstanding",
      amount: outstanding,
    },
  ];

  return (
    <ChartCard
      title="Payment Collection"
      description="Collected payments versus outstanding balance."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="amount"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}