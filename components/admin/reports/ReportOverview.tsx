import StatsCard from "@/components/admin/StatsCard";

import {
  DollarSign,
  Receipt,
  Briefcase,
  Users,
  Wallet,
  CreditCard,
} from "lucide-react";

interface ReportOverviewProps {
  revenue: number;
  payments: number;
  jobs: number;
  customers: number;
  outstanding: number;
  invoices: number;
}

export default function ReportOverview({
  revenue,
  payments,
  jobs,
  customers,
  outstanding,
  invoices,
}: ReportOverviewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      <StatsCard
        title="Revenue"
        value={`$${revenue.toLocaleString()}`}
        color="green"
        icon={
          <DollarSign className="h-8 w-8 text-green-600" />
        }
      />

      <StatsCard
        title="Payments Received"
        value={`$${payments.toLocaleString()}`}
        color="blue"
        icon={
          <Wallet className="h-8 w-8 text-blue-600" />
        }
      />

      <StatsCard
        title="Outstanding"
        value={`$${outstanding.toLocaleString()}`}
        color="orange"
        icon={
          <CreditCard className="h-8 w-8 text-orange-600" />
        }
      />

      <StatsCard
        title="Jobs Completed"
        value={jobs}
        color="purple"
        icon={
          <Briefcase className="h-8 w-8 text-purple-600" />
        }
      />

      <StatsCard
        title="Customers"
        value={customers}
        color="blue"
        icon={
          <Users className="h-8 w-8 text-blue-600" />
        }
      />

      <StatsCard
        title="Invoices"
        value={invoices}
        color="green"
        icon={
          <Receipt className="h-8 w-8 text-green-600" />
        }
      />

    </div>
  );
}