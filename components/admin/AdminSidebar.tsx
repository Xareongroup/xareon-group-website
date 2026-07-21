"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
  { href: "/admin/estimates", label: "Estimates", icon: "📄" },
  { href: "/admin/jobs", label: "Jobs", icon: "🛠️" },
  { href: "/admin/contracts", label: "Contracts", icon: "📝" },
  { href: "/admin/invoices", label: "Invoices", icon: "💰" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-72 flex-col bg-slate-900 text-white shadow-xl">

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

          <p className="mt-3 text-sm font-medium tracking-wide text-slate-300 uppercase">
            Business Portal
          </p>

        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-lg">{link.icon}</span>

              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 p-4 text-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} XAREON Group
        </p>
      </div>
    </aside>
  );
}