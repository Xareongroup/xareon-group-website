import {
  Invoice,
  InvoiceItem,
} from "@/types/invoice";

export function calculateLineTotal(
  item: InvoiceItem
): number {

  const quantity =
    Number(item.quantity) || 0;

  const unitPrice =
    Number(item.unitPrice) || 0;

  const discount =
    Number(item.discount) || 0;

  const total =
    quantity * unitPrice - discount;

  return Number(total.toFixed(2));

}

export function calculateSubtotal(
  items: InvoiceItem[]
): number {

  return Number(

    items
      .reduce(

        (sum, item) =>
          sum +
          calculateLineTotal(item),

        0

      )
      .toFixed(2)

  );

}

export function calculateTax(
  subtotal: number,
  taxRate: number
): number {

  return Number(

    (
      (subtotal * taxRate) / 100
    ).toFixed(2)

  );

}

export function calculateGrandTotal(
  subtotal: number,
  tax: number,
  discount: number
): number {

  return Number(

    (
      subtotal +
      tax -
      discount
    ).toFixed(2)

  );

}

export function recalculateInvoice(
  invoice: Invoice
): Invoice {

  const items =
    invoice.items.map(
      (item) => ({
        ...item,
        total:
          calculateLineTotal(item),
      })
    );

  const subtotal =
    calculateSubtotal(items);

  const tax =
    calculateTax(
      subtotal,
      invoice.taxRate
    );

  const total =
    calculateGrandTotal(
      subtotal,
      tax,
      invoice.discount
    );

  return {

    ...invoice,

    items,

    subtotal,

    tax,

    total,

    balanceDue: total,

  };

}