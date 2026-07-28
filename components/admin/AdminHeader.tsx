"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Settings,
  UserCircle2,
  LogOut,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import NotificationBell from "./NotificationBell";

export default function AdminHeader() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  async function handleLogout() {
    setLoading(true);

    await supabase.auth.signOut();

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      {/* Left */}
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {today}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Global Search */}
        <div className="relative hidden xl:block">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers, jobs, invoices..."
            className="w-80 rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Notifications */}
        <NotificationBell unread={5} />

        {/* Settings */}
        <Link
          href="/admin/settings"
          className="rounded-xl border border-slate-200 p-3 transition hover:bg-slate-100"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5 text-slate-600" />
        </Link>

        {/* User */}
        <div className="hidden items-center gap-3 rounded-xl border border-slate-200 px-4 py-2 lg:flex">
          <UserCircle2 className="h-10 w-10 text-slate-500" />

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Administrator
            </p>

            <p className="text-xs text-slate-500">
              XAREON Group
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut className="h-5 w-5" />

          {loading ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    </header>
  );
}