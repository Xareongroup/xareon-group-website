export * from "./getBusinessMetrics";
export * from "./getRevenueReport";
export * from "./getJobsReport";
export * from "./getCustomerReport";
export * from "./getInvoiceReport";
export * from "./getPaymentReport";

export type ReportPeriod =
  | "today"
  | "7days"
  | "30days"
  | "90days"
  | "year";

export interface RevenuePoint {
  label: string;
  revenue: number;
}

export interface OverviewReport {
  revenue: number;
  payments: number;
  outstanding: number;
  jobs: number;
  customers: number;
  invoices: number;
}