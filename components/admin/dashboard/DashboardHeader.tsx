import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  firstName?: string;
}

export default function DashboardHeader({
  firstName = "Admin",
}: DashboardHeaderProps) {
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

      <div>

        <p className="text-sm text-slate-500">
          {today}
        </p>

        <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
          Welcome back, {firstName}
        </h1>

        <p className="mt-2 text-slate-600">
          Here's what's happening with your business today.
        </p>

      </div>

      <Button>

        <Plus className="mr-2 h-4 w-4" />

        New Customer

      </Button>

    </div>
  );
}
