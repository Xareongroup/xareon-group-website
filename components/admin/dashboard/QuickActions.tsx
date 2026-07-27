import Link from "next/link";

import {
  UserPlus,
  FileText,
  Hammer,
  Receipt,
  ScrollText,
} from "lucide-react";

import Card from "@/components/ui/Card";

const actions = [
  {
    title: "New Customer",
    description: "Create a customer profile",
    href: "/admin/customers/new",
    icon: UserPlus,
  },
  {
    title: "New Estimate",
    description: "Prepare a new estimate",
    href: "/admin/estimates/new",
    icon: FileText,
  },
  {
    title: "New Job",
    description: "Schedule a new job",
    href: "/admin/jobs/new",
    icon: Hammer,
  },
  {
    title: "New Invoice",
    description: "Create an invoice",
    href: "/admin/invoices/new",
    icon: Receipt,
  },
  {
    title: "New Contract",
    description: "Generate a contract",
    href: "/admin/contracts/new",
    icon: ScrollText,
  },
];

export default function QuickActions() {
  return (
    <Card
      title="Quick Actions"
      description="Frequently used shortcuts"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3 transition-colors group-hover:bg-blue-100">

                <Icon className="h-6 w-6 text-blue-600" />

              </div>

              <h3 className="text-base font-semibold text-slate-900">
                {action.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {action.description}
              </p>

            </Link>
          );
        })}

      </div>
    </Card>
  );
}