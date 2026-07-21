"use client";

import { Estimate } from "@/types/estimate";

interface EstimateSummaryProps {
  estimate: Estimate;
  customerName?: string;
}

export default function EstimateSummary({
  estimate,
  customerName,
}: EstimateSummaryProps) {
  return (
    <div className="sticky top-6 rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">
        Estimate Summary
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-slate-500">
            Estimate #
          </span>

          <span className="font-medium">
            {estimate.estimateNumber || "Auto"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Status
          </span>

          <span className="font-medium">
            {estimate.status}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Customer
          </span>

          <span className="font-medium">
            {customerName ||
              (estimate.customerId
                ? "Selected"
                : "Not Selected")}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Items
          </span>

          <span className="font-medium">
            {estimate.items.length}
          </span>
        </div>
      </div>

      <hr className="my-6" />

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Subtotal</span>

          <span>
            ${estimate.subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>

          <span>
            ${estimate.tax.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Discount</span>

          <span>
            -${estimate.discount.toFixed(2)}
          </span>
        </div>

        <hr />

        <div className="flex justify-between text-2xl font-bold">
          <span>Total</span>

          <span className="text-blue-700">
            ${estimate.total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}