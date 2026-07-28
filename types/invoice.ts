export type InvoiceStatus =
  | "Draft"
  | "Sent"
  | "Viewed"
  | "Paid"
  | "Partially Paid"
  | "Overdue"
  | "Cancelled";

export interface InvoiceItem {
  id: string;

  description: string;

  quantity: number;

  unit: string;

  unitPrice: number;

  discount: number;

  taxable: boolean;

  total: number;
}

export interface Invoice {
  id?: string;

  customerId: string;

  estimateId: string;

  jobId: string;

  invoiceNumber: string;

  issueDate: string;

  dueDate: string;

  status: InvoiceStatus;

  items: InvoiceItem[];

  subtotal: number;

  taxRate: number;

  tax: number;

  discount: number;

  total: number;

  balanceDue: number;

  notes: string;
}