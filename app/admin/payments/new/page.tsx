import Link from "next/link";
import PaymentForm from "@/components/admin/payments/PaymentForm";

export default function NewPaymentPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link
          href="/admin/payments"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Payments
        </Link>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Record Payment
        </h1>

        <p className="mt-1 text-slate-600">
          Record a customer payment for an invoice.
        </p>
      </div>

      <PaymentForm />
    </div>
  );
}