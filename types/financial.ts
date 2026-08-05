export type ExpenseStatus = 'Paid' | 'Pending' | 'Reimbursed';
export type ExpensePaymentMethod = 'Cash' | 'Credit Card' | 'Bank Transfer' | 'Check';

export interface ExpenseFormValues {
  date: string; category_id: string; vendor_id: string; customer_id: string; job_id: string; employee_id: string;
  description: string; amount: string; payment_method: ExpensePaymentMethod; status: ExpenseStatus; receipt_url: string; notes: string;
}

export interface FinancialSummary { revenue: number; paidInvoices: number; outstanding: number; averageInvoice: number; expenses: number; monthExpenses: number; yearExpenses: number; netProfit: number; profitMargin: number; }
