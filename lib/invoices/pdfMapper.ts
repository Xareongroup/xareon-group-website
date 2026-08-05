import {
  InvoicePdfData,
  InvoicePdfItem,
} from "@/types/invoicePdf";

export function mapInvoiceToPdf(
  invoice: any
): InvoicePdfData {
  return {
    id: invoice.id,

    invoice_number: invoice.invoice_number,

    status: invoice.status,

    issue_date: invoice.issue_date,

    due_date: invoice.due_date,

    subtotal: Number(invoice.subtotal ?? 0),

    tax: Number(invoice.tax ?? 0),

    discount: Number(invoice.discount ?? 0),

    total: Number(invoice.total ?? 0),

    balance_due: Number(
      invoice.balance_due ?? 0
    ),

    notes: invoice.notes ?? "",

    estimate_id:
      invoice.estimate_id,

    job_id:
      invoice.job_id,

    customers: invoice.customers
      ? {
          id: invoice.customers.id,

          first_name:
            invoice.customers.first_name,

          last_name:
            invoice.customers.last_name,

          email:
            invoice.customers.email,

          phone:
            invoice.customers.phone,

          address:
            invoice.customers.address,

          city:
            invoice.customers.city,

          state:
            invoice.customers.state,

          zip:
            invoice.customers.zip,
        }
      : null,
  };
}

export function mapInvoiceItemsToPdf(
  items: any[]
): InvoicePdfItem[] {
  return items.map((item) => ({
    id: item.id,

    description:
      item.description,

    quantity:
      Number(item.quantity),

    unit:
      item.unit,

    unit_price:
      Number(item.unit_price),

    discount:
      Number(item.discount),

    taxable:
      Boolean(item.taxable),

    total:
      Number(item.total),
  }));
}
