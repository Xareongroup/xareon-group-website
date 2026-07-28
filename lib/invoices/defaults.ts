import { Invoice } from "@/types/invoice";

export const defaultInvoice: Invoice = {
  customerId: "",

  estimateId: "",

  jobId: "",

  invoiceNumber: "",

  issueDate: new Date()
    .toISOString()
    .split("T")[0],

  dueDate: new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0],

  status: "Draft",

  items: [],

  subtotal: 0,

  taxRate: 6,

  tax: 0,

  discount: 0,

  total: 0,

  balanceDue: 0,

  notes: `Thank you for choosing XAREON Group.

• Payment is due within 30 days unless otherwise agreed.
• Late payments may incur additional fees.
• Please include the invoice number with your payment.
• Thank you for your business.`,

};