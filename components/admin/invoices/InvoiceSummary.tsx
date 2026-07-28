"use client";

import { Invoice } from "@/types/invoice";
import { recalculateInvoice } from "@/lib/invoices/calculations";

interface Props {
  invoice: Invoice;
  setInvoice: React.Dispatch<
    React.SetStateAction<Invoice>
  >;
}

export default function InvoiceSummary({
  invoice,
  setInvoice,
}: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-xl font-bold text-slate-900">
        Invoice Summary
      </h2>

      <div className="mt-6 space-y-4">

        <div className="flex items-center justify-between">
          <span className="text-slate-600">
            Subtotal
          </span>

          <span className="font-semibold">
            ${invoice.subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">

          <span className="text-slate-600">
            Tax Rate
          </span>

          <input
            type="number"
            min="0"
            step="0.01"
            value={invoice.taxRate}
            onChange={(e) =>
  setInvoice((prev) =>
    recalculateInvoice({
      ...prev,
      taxRate: Number(e.target.value),
    })
  )
}
            className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-right"
          />

        </div>

        <div className="flex items-center justify-between">

          <span className="text-slate-600">
            Tax
          </span>

          <span className="font-semibold">
            ${invoice.tax.toFixed(2)}
          </span>

        </div>

        <div className="flex items-center justify-between">

          <span className="text-slate-600">
            Invoice Discount
          </span>

          <input
            type="number"
            min="0"
            step="0.01"
            value={invoice.discount}
            onChange={(e) =>
  setInvoice((prev) =>
    recalculateInvoice({
      ...prev,
      discount: Number(e.target.value),
    })
  )
}
            className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-right"
          />

        </div>

        <hr />

        <div className="flex items-center justify-between text-lg font-bold">

          <span>
            Grand Total
          </span>

          <span>
            ${invoice.total.toFixed(2)}
          </span>

        </div>

        <div className="flex items-center justify-between text-blue-700 font-semibold">

          <span>
            Balance Due
          </span>

          <span>
            ${invoice.balanceDue.toFixed(2)}
          </span>

        </div>

      </div>

    </div>
  );
}