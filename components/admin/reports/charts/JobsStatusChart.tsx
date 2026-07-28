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

interface JobsStatusChartProps {
  completed: number;
  scheduled: number;
  inProgress: number;
  cancelled: number;
}

export default function JobsStatusChart({
  completed,
  scheduled,
  inProgress,
  cancelled,
}: JobsStatusChartProps) {
  const data = [
    {
      status: "Completed",
      jobs: completed,
    },
    {
      status: "Scheduled",
      jobs: scheduled,
    },
    {
      status: "In Progress",
      jobs: inProgress,
    },
    {
      status: "Cancelled",
      jobs: cancelled,
    },
  ];

  return (
    <ChartCard
      title="Jobs by Status"
      description="Current distribution of all jobs."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="status" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="jobs"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}