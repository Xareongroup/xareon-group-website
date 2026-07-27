"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Settings,
  UserCircle2,
  LogOut,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function AdminHeader() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

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
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      {/* Left Side */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {today}
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <button className="rounded-xl border border-slate-200 p-3 transition hover:bg-slate-100">
          <Search className="h-5 w-5 text-slate-600" />
        </button>

        <button className="relative rounded-xl border border-slate-200 p-3 transition hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <button className="rounded-xl border border-slate-200 p-3 transition hover:bg-slate-100">
          <Settings className="h-5 w-5 text-slate-600" />
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-2">
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

        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          <LogOut className="h-5 w-5" />

          {loading ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    </header>
  );
}