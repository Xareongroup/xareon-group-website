"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  FileSignature,
  Receipt,
  CreditCard,
  Settings,
} from "lucide-react";

const links = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: Users,
  },
  {
    href: "/admin/estimates",
    label: "Estimates",
    icon: FileText,
  },
  {
    href: "/admin/jobs",
    label: "Jobs",
    icon: Briefcase,
  },
  {
    href: "/admin/contracts",
    label: "Contracts",
    icon: FileSignature,
  },
  {
    href: "/admin/invoices",
    label: "Invoices",
    icon: Receipt,
  },
  {
    href: "/admin/payments",
    label: "Payments",
    icon: CreditCard,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-72 flex-col border-r border-slate-200 bg-slate-900 text-white shadow-xl">

      {/* Logo */}
      <Link
        href="/admin/dashboard"
        className="border-b border-slate-700 p-6 transition hover:bg-slate-800"
      >
        <div className="flex flex-col items-center justify-center">

          <Image
            src="/logo/xareon1-logo.png"
            alt="XAREON Group"
            width={140}
            height={140}
            priority
            className="h-auto w-auto"
          />

          <h2 className="mt-4 text-lg font-bold tracking-wide text-white">
            XAREON
          </h2>

          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Business Suite
          </p>

        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            pathname.startsWith(`${link.href}/`);

          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                active
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />

              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 p-5">

        <div className="rounded-xl bg-slate-800 p-4">

          <p className="text-sm font-semibold text-white">
            Administrator
          </p>

          <p className="mt-1 text-xs text-slate-400">
            XAREON Group
          </p>

        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} XAREON Group
        </p>

      </div>

    </aside>
  );
}