export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Settings
        </h1>

        <p className="mt-2 text-slate-600">
          Configure your XAREON Business Suite.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-lg">
            Company Information
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Business name, address, phone, email and logo.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-lg">
            Documents
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Estimate, Job, Invoice and Contract numbering.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-lg">
            Taxes & Payments
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Tax rates, payment terms and currency.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-lg">
            Notifications
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Email reminders and customer notifications.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-lg">
            Team Members
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Users, permissions and access control.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-lg">
            Integrations
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Google Calendar, Stripe, QuickBooks and more.
          </p>
        </div>

      </div>
    </div>
  );
}