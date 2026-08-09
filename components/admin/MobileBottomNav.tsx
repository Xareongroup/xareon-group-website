"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  CalendarDays,
  PlusCircle,
  Menu,
} from "lucide-react";

import QuickActionsSheet from "./QuickActionsSheet";

const items = [
  {
    href: "/admin/dashboard",
    label: "Home",
    icon: Home,
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: Users,
  },
  {
    action: "quick",
    label: "New",
    icon: PlusCircle,
    primary: true,
  },
  {
    href: "/admin/calendar",
    label: "Calendar",
    icon: CalendarDays,
  },
  {
    action: "menu",
    label: "More",
    icon: Menu,
  },
];

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export default function MobileBottomNav({ onOpenMenu }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white shadow-lg lg:hidden">
        <div className="grid grid-cols-5">
          {items.map((item) => {
            const Icon = item.icon;

            if (item.action === "quick") {
              return (
                <button
                  key={item.label}
                  onClick={() => setOpen(true)}
                  className="flex min-h-14 flex-col items-center justify-center py-2 text-blue-600"
                >
                  <Icon className="mb-1 h-8 w-8" />

                  <span className="text-xs font-medium">
                    {item.label}
                  </span>
                </button>
              );
            }

            if (item.action === "menu") {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={onOpenMenu}
                  className="flex min-h-14 flex-col items-center justify-center py-2 text-slate-700 transition hover:text-blue-600"
                  aria-label="Open navigation menu"
                >
                  <Icon className="mb-1 h-6 w-6" />

                  <span>{item.label}</span>
                </button>
              );
            }

            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`flex min-h-14 flex-col items-center justify-center py-2 text-xs transition ${
                  active
                    ? "text-blue-600"
                    : "text-slate-700"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="mb-1 h-6 w-6" />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <QuickActionsSheet
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
