"use client";

import Link from "next/link";
import {
  Bell,
  Receipt,
  Briefcase,
  Users,
  FileText,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  href: string;
  type: "customer" | "job" | "invoice" | "estimate";
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "New Customer",
    message: "John Smith was added.",
    href: "/admin/customers",
    type: "customer",
    read: false,
  },
  {
    id: "2",
    title: "Invoice Paid",
    message: "Invoice #104 has been paid.",
    href: "/admin/invoices",
    type: "invoice",
    read: false,
  },
  {
    id: "3",
    title: "Job Scheduled",
    message: "TV Mount Installation",
    href: "/admin/jobs",
    type: "job",
    read: true,
  },
  {
    id: "4",
    title: "Estimate Approved",
    message: "Estimate #220 approved.",
    href: "/admin/estimates",
    type: "estimate",
    read: true,
  },
];

function icon(type: Notification["type"]) {
  switch (type) {
    case "customer":
      return <Users className="h-5 w-5 text-blue-600" />;

    case "job":
      return <Briefcase className="h-5 w-5 text-orange-600" />;

    case "invoice":
      return <Receipt className="h-5 w-5 text-green-600" />;

    default:
      return <FileText className="h-5 w-5 text-purple-600" />;
  }
}

export default function NotificationPanel() {
  return (
    <div className="absolute right-0 top-14 z-50 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="font-bold">
          Notifications
        </h2>

        <Bell className="h-5 w-5 text-slate-500" />
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {notifications.map((notification) => (
          <Link
            key={notification.id}
            href={notification.href}
            className={`flex gap-3 border-b p-4 transition hover:bg-slate-50 ${
              !notification.read
                ? "bg-blue-50"
                : ""
            }`}
          >
            {icon(notification.type)}

            <div className="flex-1">
              <p className="font-semibold">
                {notification.title}
              </p>

              <p className="text-sm text-slate-500">
                {notification.message}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}