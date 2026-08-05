export interface InvoicePdfCustomer {
  id?: string;

  first_name?: string;

  last_name?: string;

  email?: string;

  phone?: string;

  address?: string;

  city?: string;

  state?: string;

  zip?: string;
}

export interface InvoicePdfItem {
  id: string;

  description: string;

  quantity: number;

  unit: string;

  unit_price: number;

  discount: number;

  taxable: boolean;

  total: number;
}

export interface InvoicePdfData {
  id: string;

  invoice_number: string;

  status: string;

  issue_date: string;

  due_date: string;

  subtotal: number;

  tax: number;

  discount: number;

  total: number;

  balance_due: number;

  notes?: string;

  estimate_id?: string | null;

  job_id?: string | null;

  customers?: InvoicePdfCustomer | null;
}
