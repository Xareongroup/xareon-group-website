"use client";

import { Invoice, InvoiceItem } from "@/types/invoice";
import {
  calculateLineTotal,
  recalculateInvoice,
} from "@/lib/invoices/calculations";

interface InvoiceItemsProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<
    React.SetStateAction<Invoice>
  >;
}

export default function InvoiceItems({
  invoice,
  setInvoice,
}: InvoiceItemsProps) {

  function updateItem(
    index: number,
    field: keyof InvoiceItem,
    value: string | number | boolean
  ) {

    const items = [...invoice.items];

    items[index] = {
      ...items[index],
      [field]: value,
    };

    setInvoice(
      recalculateInvoice({
        ...invoice,
        items,
      })
    );

  }

  function addItem() {

    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),

      description: "",

      quantity: 1,

      unit: "Each",

      unitPrice: 0,

      discount: 0,

      taxable: true,

      total: 0,
    };

    setInvoice(
      recalculateInvoice({
        ...invoice,
        items: [...invoice.items, newItem],
      })
    );

  }

  function removeItem(index: number) {

    const items =
      invoice.items.filter(
        (_, i) => i !== index
      );

    setInvoice(
      recalculateInvoice({
        ...invoice,
        items,
      })
    );

  }

  return (

    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

      <div className="flex items-center justify-between border-b px-6 py-5">

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            Invoice Items
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add products and services included in this invoice.
          </p>

        </div>

        <button
          type="button"
          onClick={addItem}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          + Add Item
        </button>

      </div>
            {invoice.items.length === 0 ? (

        <div className="m-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-8 py-12 text-center">

          <div className="text-5xl">
            📄
          </div>

          <h3 className="mt-4 text-lg font-semibold text-slate-800">
            No invoice items yet
          </h3>

          <p className="mt-2 text-slate-500">
            Click <strong>Add Item</strong> to begin building this invoice.
          </p>

        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="min-w-[1100px] w-full">

            <thead className="bg-slate-100 text-sm uppercase tracking-wide text-slate-600">

              <tr>

                <th className="w-12 px-3 py-3 text-center">
                  #
                </th>

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

              {invoice.items.map((item, index) => (

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
                      placeholder="Describe the product or service"
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