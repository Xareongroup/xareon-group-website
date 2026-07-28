import ReportsClient from "./ReportsClient";

import {
  getBusinessMetrics,
  getCustomerReport,
  getInvoiceReport,
  getJobsReport,
  getPaymentReport,
  getRevenueReport,
} from "@/lib/reports";

import type { ReportDashboardData } from "@/types/report-dashboard";

interface ReportsPageProps {
  searchParams?: Promise<{
    range?: string;
  }>;
}

export default async function ReportsPage({
  searchParams,
}: ReportsPageProps) {
  const params = await searchParams;
  const range = params?.range ?? "30d";

  const [
    business,
    revenue,
    customers,
    invoices,
    jobs,
    payments,
  ] = await Promise.all([
    getBusinessMetrics(range),
    getRevenueReport(range),
    getCustomerReport(range),
    getInvoiceReport(range),
    getJobsReport(range),
    getPaymentReport(range),
  ]);

  const dashboard: ReportDashboardData = {
    overview: {
      revenue: business.totalRevenue,
      payments: payments.totalCollected,
      outstanding: business.outstandingBalance,
      jobs: jobs.totalJobs,
      customers: customers.totalCustomers,
      invoices: invoices.totalInvoices,
    },

    revenue: {
      totalRevenue: business.totalRevenue,
      totalPayments: payments.totalCollected,
      outstandingBalance: business.outstandingBalance,
      monthlyRevenue: revenue.monthlyRevenue,
    },

    jobs: {
      totalJobs: jobs.totalJobs,
      completedJobs: jobs.completedJobs,
      scheduledJobs: jobs.scheduledJobs,
      inProgressJobs: jobs.inProgressJobs,
      cancelledJobs: jobs.cancelledJobs,
    },

    customers: {
      totalCustomers: customers.totalCustomers,
      activeCustomers: customers.activeCustomers,
      inactiveCustomers: customers.inactiveCustomers,
      averageJobsPerCustomer: customers.averageJobsPerCustomer,
    },

    invoices: {
      totalInvoices: invoices.totalInvoices,
      paidInvoices: invoices.paidInvoices,
      overdueInvoices: invoices.overdueInvoices,
      draftInvoices: invoices.draftInvoices,
      sentInvoices: invoices.sentInvoices,
      partiallyPaidInvoices: invoices.partiallyPaidInvoices,
      cancelledInvoices: invoices.cancelledInvoices,
      collectionRate: invoices.collectionRate,
      outstandingBalance: invoices.outstandingBalance,
      averageInvoiceValue: invoices.averageInvoiceValue,
    },

    payments: {
      totalPayments: payments.totalPayments,
      totalCollected: payments.totalCollected,
      averagePayment: payments.averagePayment,
      invoicesPaid: payments.invoicesPaid,
      outstandingInvoices: payments.outstandingInvoices,
      collectionRate: payments.collectionRate,
    },
  };

  return <ReportsClient dashboard={dashboard} />;
}