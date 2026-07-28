import InvoiceStatusChart from "./charts/InvoiceStatusChart";

interface InvoiceAnalyticsProps {
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  draftInvoices: number;
  sentInvoices: number;
  partiallyPaidInvoices: number;
  cancelledInvoices: number;
  collectionRate: number;
  outstandingBalance: number;
  averageInvoiceValue: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function InvoiceAnalytics({
  totalInvoices,
  paidInvoices,
  overdueInvoices,
  draftInvoices,
  sentInvoices,
  partiallyPaidInvoices,
  cancelledInvoices,
  collectionRate,
  outstandingBalance,
  averageInvoiceValue,
}: InvoiceAnalyticsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Invoice Analytics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Monitor invoice performance and collections.
          </p>
        </div>

        <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
          {collectionRate.toFixed(1)}% Collected
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-4 lg:grid-cols-5">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-slate-500">Total</p>
          <h3 className="mt-2 text-3xl font-bold">{totalInvoices}</h3>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-slate-500">Paid</p>
          <h3 className="mt-2 text-3xl font-bold text-emerald-600">
            {paidInvoices}
          </h3>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-slate-500">Sent</p>
          <h3 className="mt-2 text-3xl font-bold text-blue-600">
            {sentInvoices}
          </h3>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-slate-500">Draft</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-600">
            {draftInvoices}
          </h3>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-slate-500">Overdue</p>
          <h3 className="mt-2 text-3xl font-bold text-red-600">
            {overdueInvoices}
          </h3>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-slate-500">Partially Paid</p>
          <h3 className="mt-2 text-3xl font-bold text-amber-600">
            {partiallyPaidInvoices}
          </h3>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-slate-500">Cancelled</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-500">
            {cancelledInvoices}
          </h3>
        </div>

        <div className="rounded-xl border p-5 lg:col-span-2">
          <p className="text-sm text-slate-500">
            Outstanding Balance
          </p>

          <h3 className="mt-2 text-3xl font-bold text-amber-600">
            {formatCurrency(outstandingBalance)}
          </h3>
        </div>

        <div className="rounded-xl border p-5 lg:col-span-2">
          <p className="text-sm text-slate-500">
            Average Invoice
          </p>

          <h3 className="mt-2 text-3xl font-bold text-indigo-600">
            {formatCurrency(averageInvoiceValue)}
          </h3>
        </div>
      </div>

      <div className="mt-8">
        <InvoiceStatusChart
          paid={paidInvoices}
          overdue={overdueInvoices}
          draft={draftInvoices}
          sent={sentInvoices}
          partial={partiallyPaidInvoices}
          cancelled={cancelledInvoices}
        />
      </div>
    </div>
  );
}