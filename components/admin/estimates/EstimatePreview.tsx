"use client";

import { Estimate } from "@/types/estimate";
import { formatCurrency } from "@/lib/utils/currency";

interface EstimatePreviewProps {
  estimate: Estimate;
  customerName?: string;
}

export default function EstimatePreview({
  estimate,
  customerName,
}: EstimatePreviewProps) {
  return (
    <div className="mx-auto max-w-5xl rounded-xl bg-white shadow-lg">

      {/* Header */}
      <div className="border-b px-8 py-6">

        <h1 className="text-3xl font-bold text-blue-700">
          XAREON GROUP
        </h1>

        <p className="text-slate-500">
          SHIELD OF INTEGRITY
        </p>

        <div className="mt-6 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold">
              ESTIMATE
            </h2>

            <p className="text-slate-500">
              {estimate.estimateNumber || "Auto Generated"}
            </p>
          </div>

          <div className="text-right">

            <p>
              <strong>Status:</strong>{" "}
              {estimate.status}
            </p>

            <p>
              <strong>Issue:</strong>{" "}
              {estimate.issueDate}
            </p>

            <p>
              <strong>Expires:</strong>{" "}
              {estimate.expirationDate}
            </p>

          </div>

        </div>

      </div>

      {/* Customer */}

      <div className="border-b px-8 py-6">

        <h3 className="mb-3 text-lg font-semibold">
          Customer
        </h3>

        <p className="font-medium">
          {customerName || "No customer selected"}
        </p>

      </div>

      {/* Line Items */}

      <div className="px-8 py-6">

        <h3 className="mb-4 text-lg font-semibold">
          Line Items
        </h3>

        <table className="w-full border-collapse">

          <thead>

            <tr className="border-b bg-slate-100">

              <th className="p-3 text-left">Description</th>

              <th className="p-3 text-center">Qty</th>

              <th className="p-3 text-right">Unit Price</th>

              <th className="p-3 text-right">Total</th>

            </tr>

          </thead>

          <tbody>

            {estimate.items.map((item) => (

              <tr
                key={item.id}
                className="border-b"
              >

                <td className="p-3">
                  {item.description}
                </td>

                <td className="p-3 text-center">
                  {item.quantity}
                </td>

                <td className="p-3 text-right">
                  {formatCurrency(item.unitPrice)}
                </td>

                <td className="p-3 text-right font-medium">
                  {formatCurrency(item.total)}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Totals */}

      <div className="border-t px-8 py-6">

        <div className="ml-auto max-w-sm space-y-2">

          <div className="flex justify-between">

            <span>Subtotal</span>

            <span>
              {formatCurrency(estimate.subtotal)}
            </span>

          </div>

          <div className="flex justify-between">

            <span>Tax</span>

            <span>
              {formatCurrency(estimate.tax)}
            </span>

          </div>

          <div className="flex justify-between">

            <span>Discount</span>

            <span>
              {formatCurrency(estimate.discount)}
            </span>

          </div>

          <hr />

          <div className="flex justify-between text-2xl font-bold text-blue-700">

            <span>Total</span>

            <span>
              {formatCurrency(estimate.total)}
            </span>

          </div>

        </div>

      </div>

      {/* Notes */}

      {estimate.notes && (

        <div className="border-t px-8 py-6">

          <h3 className="mb-3 text-lg font-semibold">
            Notes
          </h3>

          <p>{estimate.notes}</p>

        </div>

      )}

      {/* Terms */}

      {estimate.terms && (

        <div className="border-t px-8 py-6">

          <h3 className="mb-3 text-lg font-semibold">
            Terms & Conditions
          </h3>

          <p>{estimate.terms}</p>

        </div>

      )}

    </div>
  );
}