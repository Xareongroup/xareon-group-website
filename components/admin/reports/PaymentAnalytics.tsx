import PaymentCollectionChart from "./charts/PaymentCollectionChart";

interface PaymentAnalyticsProps {
  totalPayments: number;
  totalCollected: number;
  averagePayment: number;
  invoicesPaid: number;
  outstandingInvoices: number;
  collectionRate: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function PaymentAnalytics({
  totalPayments,
  totalCollected,
  averagePayment,
  invoicesPaid,
  outstandingInvoices,
  collectionRate,
}: PaymentAnalyticsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Payment Analytics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Monitor collections and payment performance.
          </p>
        </div>

        <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
          {collectionRate.toFixed(1)}% Collection Rate
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-slate-500">
            Payments
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {totalPayments}
          </h3>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-slate-500">
            Collected
          </p>

          <h3 className="mt-2 text-3xl font-bold text-emerald-600">
            {formatCurrency(totalCollected)}
          </h3>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-slate-500">
            Avg Payment
          </p>

          <h3 className="mt-2 text-3xl font-bold text-blue-600">
            {formatCurrency(averagePayment)}
          </h3>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-slate-500">
            Invoices Paid
          </p>

          <h3 className="mt-2 text-3xl font-bold text-indigo-600">
            {invoicesPaid}
          </h3>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-slate-500">
            Outstanding
          </p>

          <h3 className="mt-2 text-3xl font-bold text-amber-600">
            {outstandingInvoices}
          </h3>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-slate-500">
            Success Rate
          </p>

          <h3 className="mt-2 text-3xl font-bold text-emerald-600">
            {collectionRate.toFixed(1)}%
          </h3>
        </div>
      </div>

      <div className="mt-8">
        <PaymentCollectionChart
          collected={totalCollected}
          outstanding={averagePayment * outstandingInvoices}
        />
      </div>
    </div>
  );
}