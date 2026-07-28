"use client";

import Link from "next/link";
import {
  UserPlus,
  FileText,
  Briefcase,
  FileSignature,
  Receipt,
  CreditCard,
  Users,
  X,
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const actions = [
  {
    href: "/admin/customers/new",
    label: "New Customer",
    icon: UserPlus,
  },
  {
    href: "/admin/estimates/new",
    label: "New Estimate",
    icon: FileText,
  },
  {
    href: "/admin/jobs/new",
    label: "New Job",
    icon: Briefcase,
  },
  {
    href: "/admin/contracts/new",
    label: "New Contract",
    icon: FileSignature,
  },
  {
    href: "/admin/invoices/new",
    label: "New Invoice",
    icon: Receipt,
  },
  {
    href: "/admin/payments/new",
    label: "Record Payment",
    icon: CreditCard,
  },
  {
    href: "/admin/employees/new",
    label: "Add Employee",
    icon: Users,
  },
];

export default function QuickActionsSheet({
  open,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 lg:hidden"
        onClick={onClose}
      />

      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white p-6 shadow-2xl lg:hidden">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Quick Actions
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-2">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.href}
                href={action.href}
                onClick={onClose}
                className="flex items-center gap-4 rounded-xl p-4 transition hover:bg-slate-100"
              >
                <Icon className="h-6 w-6 text-blue-600" />

                <span className="font-medium">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}