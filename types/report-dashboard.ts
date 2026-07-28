import type { MonthlyRevenue } from "@/lib/reports/getRevenueReport";

export interface OverviewMetrics {
  revenue: number;
  payments: number;
  outstanding: number;
  jobs: number;
  customers: number;
  invoices: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  totalPayments: number;
  outstandingBalance: number;
  monthlyRevenue: MonthlyRevenue[];
}

export interface JobMetrics {
  totalJobs: number;
  completedJobs: number;
  scheduledJobs: number;
  inProgressJobs: number;
  cancelledJobs: number;
}

export interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  averageJobsPerCustomer: number;
}

export interface InvoiceMetrics {
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  draftInvoices: number;
  sentInvoices: number;
  partiallyPaidInvoices: number;
  cancelledInvoices: number;
  collectionRate: number;
  outstandingBalance: number;
  averageInvoiceValue: number;
}

export interface PaymentMetrics {
  totalPayments: number;
  totalCollected: number;
  averagePayment: number;
  invoicesPaid: number;
  outstandingInvoices: number;
  collectionRate: number;
}

export interface ReportDashboardData {
  overview: OverviewMetrics;
  revenue: RevenueMetrics;
  jobs: JobMetrics;
  customers: CustomerMetrics;
  invoices: InvoiceMetrics;
  payments: PaymentMetrics;
}