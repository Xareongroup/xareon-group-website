export type EstimateStatus =
  | "Draft"
  | "Sent"
  | "Viewed"
  | "Approved"
  | "Rejected"
  | "Expired"
  | "Converted";

export interface EstimateItem {
  id: string;

  description: string;

  quantity: number;

  unit: string;

  unitPrice: number;

  discount: number;

  taxable: boolean;

  total: number;
}

export interface Estimate {
  id?: string;

  customerId: string;

  estimateNumber: string;

  issueDate: string;

  expirationDate: string;

  status: EstimateStatus;

  items: EstimateItem[];

  subtotal: number;

  taxRate: number;

  tax: number;

  discount: number;

  total: number;

  notes: string;

  terms: string;
}