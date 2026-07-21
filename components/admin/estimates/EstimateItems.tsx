"use client";

import { Estimate, EstimateItem } from "@/types/estimate";
import {
  calculateLineTotal,
  recalculateEstimate,
} from "@/lib/estimates/calculations";

interface EstimateItemsProps {
  estimate: Estimate;
  setEstimate: React.Dispatch<React.SetStateAction<Estimate>>;
}

export default function EstimateItems({
  estimate,
  setEstimate,
}: EstimateItemsProps) {
  function updateItem(
    index: number,
    field: keyof EstimateItem,
    value: string | number | boolean
  ) {
    const items = [...estimate.items];

    items[index] = {
      ...items[index],
      [field]: value,
    };

    setEstimate(
      recalculateEstimate({
        ...estimate,
        items,
      })
    );
  }

  function addItem() {
    const newItem: EstimateItem = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unit: "Each",
      unitPrice: 0,
      discount: 0,
      taxable: true,
      total: 0,
    };

    setEstimate(
      recalculateEstimate({
        ...estimate,
        items: [...estimate.items, newItem],
      })
    );
  }

  function removeItem(index: number) {
    const items = estimate.items.filter((_, i) => i !== index);

    setEstimate(
      recalculateEstimate({
        ...estimate,
        items,
      })
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Line Items
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add the products or services included in this estimate.
          </p>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          + Add Line Item
        </button>
      </div>

      {estimate.items.length === 0 ? (
        <div className="m-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-8 py-12 text-center">
          <div className="text-5xl">📄</div>

          <h3 className="mt-4 text-lg font-semibold text-slate-800">
            No line items yet
          </h3>

          <p className="mt-2 text-slate-500">
            Click <strong>Add Line Item</strong> to begin building
            this estimate.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full">
            <thead className="bg-slate-100 text-sm uppercase tracking-wide text-slate-600">
              <tr>
                <th className="w-12 px-3 py-3 text-center">#</th>

                <th className="px-3 py-3 text-left">
                  Description
                </th>

                <th className="w-24 px-3 py-3 text-center">
                  Qty
                </th>

                <th className="w-32 px-3 py-3 text-left">
                  Unit
                </th>

                <th className="w-36 px-3 py-3 text-right">
                  Unit Price
                </th>

                <th className="w-36 px-3 py-3 text-right">
                  Discount
                </th>

                <th className="w-24 px-3 py-3 text-center">
                  Taxable
                </th>

                <th className="w-36 px-3 py-3 text-right">
                  Total
                </th>

                <th className="w-24 px-3 py-3"></th>
              </tr>
            </thead>

            <tbody>
              {estimate.items.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b transition hover:bg-slate-50"
                >
                  <td className="px-3 py-4 text-center font-semibold text-slate-500">
                    {index + 1}
                  </td>

                  <td className="px-3 py-4">
                    <input
                      value={item.description}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Describe the service or product"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </td>

                  <td className="px-3 py-4">
                    <input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "quantity",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-center focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </td>

                  <td className="px-3 py-4">
                    <input
                      value={item.unit}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "unit",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </td>

                  <td className="px-3 py-4">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "unitPrice",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </td>

                  <td className="px-3 py-4">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.discount}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "discount",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </td>

                  <td className="px-3 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={item.taxable}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "taxable",
                          e.target.checked
                        )
                      }
                      className="h-5 w-5 accent-blue-600"
                    />
                  </td>

                  <td className="px-3 py-4 text-right font-semibold text-slate-800">
                    ${calculateLineTotal(item).toFixed(2)}
                  </td>

                  <td className="px-3 py-4">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}