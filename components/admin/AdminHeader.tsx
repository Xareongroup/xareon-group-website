"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Settings, UserCircle2, LogOut } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import type { GlobalSearchResult } from "@/lib/search/globalSearch";
import NotificationBell from "./NotificationBell";

const emptyResults: GlobalSearchResult = { customers: [], jobs: [], estimates: [], invoices: [], payments: [], employees: [], vendors: [] };
const settingsLinks = [
  ["Company Information", "/admin/settings/company"],
  ["Documents", "/admin/settings/documents"],
  ["Taxes & Payments", "/admin/settings/taxes"],
  ["Notifications", "/admin/settings/notifications"],
  ["Team Members", "/admin/employees"],
  ["Integrations", "/admin/settings/integrations"],
] as const;

export default function AdminHeader() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<GlobalSearchResult>(emptyResults);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const resultGroups = useMemo(() => [
    { label: "Customers", items: results.customers.map((item) => ({ id: item.id, href: `/admin/customers/${item.id}`, title: item.name, detail: item.email ?? item.phone ?? "Customer" })) },
    { label: "Jobs", items: results.jobs.map((item) => ({ id: item.id, href: `/admin/jobs/${item.id}`, title: item.job_number ?? "Unnumbered job", detail: item.title ?? item.status ?? "Job" })) },
    { label: "Estimates", items: results.estimates.map((item) => ({ id: item.id, href: `/admin/estimates/${item.id}`, title: `Estimate #${item.estimate_number}`, detail: `${item.status} · $${Number(item.total).toFixed(2)}` })) },
    { label: "Invoices", items: results.invoices.map((item) => ({ id: item.id, href: `/admin/invoices/${item.id}`, title: item.invoice_number ?? "Unnumbered invoice", detail: item.status ?? "Draft" })) },
    { label: "Payments", items: results.payments.map((item) => ({ id: item.id, href: `/admin/payments/${item.id}`, title: item.reference ?? "Payment", detail: `$${Number(item.amount).toFixed(2)}` })) },
    { label: "Employees", items: results.employees.map((item) => ({ id: item.id, href: `/admin/employees/${item.id}`, title: item.name, detail: `${item.role} · ${item.status}` })) },
    { label: "Vendors", items: results.vendors.map((item) => ({ id: item.id, href: `/admin/financials/vendors/${item.id}`, title: item.name, detail: item.company ?? "Vendor / Payee" })) },
  ], [results]);
  const hasResults = resultGroups.some((group) => group.items.length > 0);

  useEffect(() => {
    const query = search.trim();
    if (query.length < 2) {
      setResults(emptyResults);
      setSearchLoading(false);
      return;
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Search request failed");
        setResults(await response.json() as GlobalSearchResult);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setResults(emptyResults);
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false);
      }
    }, 250);
    return () => { controller.abort(); window.clearTimeout(timeout); };
  }, [search]);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div className="min-w-0"><h1 className="truncate text-2xl font-bold text-slate-900">Dashboard</h1><p className="mt-1 text-sm text-slate-500">{today}</p></div>
      <div className="flex items-center gap-4">
        <div className="relative hidden xl:block">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => setSearchOpen(true)} onBlur={() => window.setTimeout(() => setSearchOpen(false), 150)} placeholder="Search customers, jobs, invoices..." className="w-80 rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          {searchOpen && search.trim().length >= 2 && <div className="absolute right-0 top-full z-50 mt-2 max-h-96 w-[28rem] overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
            {searchLoading ? <p className="px-3 py-4 text-sm text-slate-500">Searching…</p> : hasResults ? resultGroups.map((group) => group.items.length > 0 && <div key={group.label} className="py-1"><p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{group.label}</p>{group.items.map((item) => <Link key={`${group.label}-${item.id}`} href={item.href} onClick={() => { setSearch(""); setSearchOpen(false); }} className="block rounded-lg px-3 py-2 hover:bg-slate-50"><p className="text-sm font-medium text-slate-900">{item.title}</p><p className="truncate text-xs text-slate-500">{item.detail}</p></Link>)}</div>) : <p className="px-3 py-4 text-sm text-slate-500">No matching records.</p>}
          </div>}
        </div>
        <NotificationBell unread={5} />
        <div className="relative">
          <button onClick={() => setSettingsOpen((open) => !open)} className="rounded-xl border border-slate-200 p-3 transition hover:bg-slate-100" aria-label="Settings" aria-expanded={settingsOpen}><Settings className="h-5 w-5 text-slate-600" /></button>
          {settingsOpen && <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">{settingsLinks.map(([label, href]) => <Link key={href} href={href} onClick={() => setSettingsOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">{label}</Link>)}</div>}
        </div>
        <div className="hidden items-center gap-3 rounded-xl border border-slate-200 px-4 py-2 lg:flex"><UserCircle2 className="h-10 w-10 text-slate-500" /><div><p className="text-sm font-semibold text-slate-900">Administrator</p><p className="text-xs text-slate-500">XAREON Group</p></div></div>
        <button onClick={handleLogout} disabled={loading} className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"><LogOut className="h-5 w-5" />{loading ? "Signing Out..." : "Sign Out"}</button>
      </div>
    </header>
  );
}
