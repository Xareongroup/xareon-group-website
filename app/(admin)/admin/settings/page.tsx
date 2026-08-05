import Link from "next/link";

const settings = [
  ["Company Information", "Business name, address, phone, email and logo.", "/admin/settings/company"],
  ["Documents", "Estimate, Job, Invoice and Contract numbering.", "/admin/settings/documents"],
  ["Taxes & Payments", "Tax rates, payment terms and currency.", "/admin/settings/taxes"],
  ["Notifications", "Email reminders and customer notifications.", "/admin/settings/notifications"],
  ["Team Members", "Users, permissions and access control.", "/admin/employees"],
  ["Integrations", "Google Calendar, Stripe, QuickBooks and more.", "/admin/settings/integrations"],
] as const;

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-slate-600">Configure your XAREON Business Suite.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {settings.map(([title, description, href]) => (
          <Link key={href} href={href} className="rounded-xl border bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
