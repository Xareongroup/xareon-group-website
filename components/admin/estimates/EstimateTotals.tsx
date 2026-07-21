"use client";

import { Estimate } from "@/types/estimate";
import { recalculateEstimate } from "@/lib/estimates/calculations";

interface EstimateTotalsProps {
  estimate: Estimate;
  setEstimate: React.Dispatch<React.SetStateAction<Estimate>>;
}

export default function EstimateTotals({
  estimate,
  setEstimate,
}: EstimateTotalsProps) {
  function updateTaxRate(value: number) {
    setEstimate(
      recalculateEstimate({
        ...estimate,
        taxRate: value,
      })
    );
  }

  function updateDiscount(value: number) {
    setEstimate(
      recalculateEstimate({
        ...estimate,
        discount: value,
      })
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">
        Financial Settings
      </h2>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Tax Rate (%)
            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              value={estimate.taxRate}
              onChange={(e) =>
                updateTaxRate(Number(e.target.value))
              }
              className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Overall Discount ($)
            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              value={estimate.discount}
              onChange={(e) =>
                updateDiscount(Number(e.target.value))
              }
              className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="rounded-xl border bg-slate-50 p-6">
          <div className="space-y-4">

            <div className="flex justify-between">
              <span className="text-slate-600">
                Subtotal
              </span>

              <span className="font-medium">
                ${estimate.subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600">
                Tax
              </span>

              <span className="font-medium">
                ${estimate.tax.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600">
                Discount
              </span>

              <span className="font-medium text-red-600">
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
      </div>
    </div>
  );
}