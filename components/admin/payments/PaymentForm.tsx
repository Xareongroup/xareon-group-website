"use client";

import { useState } from "react";

interface PaymentFormProps {
  invoice: {
    id: string;
    invoice_number: string | null;
    total: number | null;
    balance_due: number | null;
    customer:
      | {
          first_name: string;
          last_name: string;
        }
      | null;
  };

  payment?: {
    id: string;
    amount: number;
    payment_method: string;
    payment_date: string;
    reference_number: string | null;
    notes: string | null;
  };

  mode?: "create" | "edit";
}

const paymentMethods = [
  "Cash",
  "Check",
  "Credit Card",
  "Debit Card",
  "ACH",
  "Zelle",
  "Cash App",
  "Venmo",
  "PayPal",
  "Other",
];

export default function PaymentForm({
  invoice,
  payment,
  mode = "create",
}: PaymentFormProps) {
  const [form, setForm] = useState({
  amount:
    payment?.amount?.toString() ??
    invoice.balance_due?.toString() ??
    "",

  payment_method:
    payment?.payment_method ?? "Cash",

  payment_date:
    payment?.payment_date ??
    new Date().toISOString().split("T")[0],

  reference_number:
    payment?.reference_number ?? "",

  notes:
    payment?.notes ?? "",
});

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  try {
    const url =
      mode === "edit"
        ? `/api/payments/${payment?.id}`
        : "/api/payments";

    const method =
      mode === "edit"
        ? "PUT"
        : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invoice_id: invoice.id,
        amount: Number(form.amount),
        payment_method: form.payment_method,
        payment_date: form.payment_date,
        reference_number: form.reference_number,
        notes: form.notes,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Unable to save payment.");
      return;
    }

    alert(
      mode === "edit"
        ? "Payment updated successfully!"
        : "Payment saved successfully!"
    );

    window.location.href = `/admin/invoices/${invoice.id}`;
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
}

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-2xl border bg-white p-8 shadow-sm"
    >
      {/* Invoice Information */}

      <div className="rounded-xl bg-slate-50 p-6">

        <h2 className="text-lg font-semibold">
          Invoice Information
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">

          <div>
            <p className="text-xs uppercase text-slate-500">
              Invoice
            </p>

            <p className="font-semibold">
              {invoice.invoice_number}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase text-slate-500">
              Customer
            </p>

            <p className="font-semibold">
              {invoice.customer?.[0]
  ? `${invoice.customer[0].first_name} ${invoice.customer[0].last_name}`
  : "Unknown"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase text-slate-500">
              Invoice Total
            </p>

            <p className="font-semibold">
              $
              {(invoice.total ?? 0).toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase text-slate-500">
              Balance Due
            </p>

            <p className="font-semibold text-blue-600">
              $
              {(invoice.balance_due ?? 0).toFixed(2)}
            </p>
          </div>

        </div>

      </div>

      {/* Payment */}

      <div className="grid gap-6 md:grid-cols-2">

        <div>

          <label className="mb-2 block font-medium">
            Payment Amount
          </label>

          <input
            type="number"
            step="0.01"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Payment Method
          </label>

          <select
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          >
            {paymentMethods.map((method) => (
              <option
                key={method}
                value={method}
              >
                {method}
              </option>
            ))}
          </select>

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Payment Date
          </label>

          <input
            type="date"
            name="payment_date"
            value={form.payment_date}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Reference Number
          </label>

          <input
            type="text"
            name="reference_number"
            value={form.reference_number}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            placeholder="Optional"
          />

        </div>

      </div>

      <div>

        <label className="mb-2 block font-medium">
          Notes
        </label>

        <textarea
          name="notes"
          rows={4}
          value={form.notes}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />

      </div>

      <div className="flex justify-end">

        <button
  type="submit"
  className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700"
>
  {mode === "edit"
    ? "Update Payment"
    : "Save Payment"}
</button>

      </div>

    </form>
  );
}
