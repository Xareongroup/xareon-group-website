"use client";

import { useEffect, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { exportReportPdf } from "@/lib/reports/exportPdf";

import PageHeader from "@/components/admin/PageHeader";
import ReportFilters from "@/components/admin/reports/ReportFilters";
import ReportOverview from "@/components/admin/reports/ReportOverview";
import RevenueAnalytics from "@/components/admin/reports/RevenueAnalytics";
import JobsAnalytics from "@/components/admin/reports/JobsAnalytics";
import CustomerAnalytics from "@/components/admin/reports/CustomerAnalytics";
import InvoiceAnalytics from "@/components/admin/reports/InvoiceAnalytics";
import PaymentAnalytics from "@/components/admin/reports/PaymentAnalytics";

import type { ReportDashboardData } from "@/types/report-dashboard";

interface ReportsClientProps {
  dashboard: ReportDashboardData;
}

export default function ReportsClient({
  dashboard,
}: ReportsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialRange =
    searchParams.get("range") ?? "30d";

  const [dateRange, setDateRange] =
    useState(initialRange);

  useEffect(() => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("range", dateRange);

    router.replace(`${pathname}?${params.toString()}`);
  }, [
    dateRange,
    pathname,
    router,
    searchParams,
  ]);

  function handleExportPdf() {
    exportReportPdf({
      dashboard,
      dateRange,
    });
  }

  function handleExportExcel() {
    alert("Excel export is coming in the next update.");
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <PageHeader
        title="Reports"
        description="Analyze your business performance, revenue, jobs, invoices, customers, and payments."
      />

      <ReportFilters
        value={dateRange}
        onChange={setDateRange}
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
      />

      <ReportOverview
        revenue={dashboard.overview.revenue}
        payments={dashboard.overview.payments}
        outstanding={dashboard.overview.outstanding}
        jobs={dashboard.overview.jobs}
        customers={dashboard.overview.customers}
        invoices={dashboard.overview.invoices}
      />

      <RevenueAnalytics
        totalRevenue={dashboard.revenue.totalRevenue}
        totalPayments={dashboard.revenue.totalPayments}
        outstandingBalance={
          dashboard.revenue.outstandingBalance
        }
        monthlyRevenue={
          dashboard.revenue.monthlyRevenue
        }
      />

      <JobsAnalytics
        totalJobs={dashboard.jobs.totalJobs}
        completedJobs={
          dashboard.jobs.completedJobs
        }
        scheduledJobs={
          dashboard.jobs.scheduledJobs
        }
        inProgressJobs={
          dashboard.jobs.inProgressJobs
        }
        cancelledJobs={
          dashboard.jobs.cancelledJobs
        }
      />

      <CustomerAnalytics
        totalCustomers={
          dashboard.customers.totalCustomers
        }
        activeCustomers={
          dashboard.customers.activeCustomers
        }
        inactiveCustomers={
          dashboard.customers.inactiveCustomers
        }
        averageJobsPerCustomer={
          dashboard.customers.averageJobsPerCustomer
        }
      />

      <InvoiceAnalytics
        totalInvoices={
          dashboard.invoices.totalInvoices
        }
        paidInvoices={
          dashboard.invoices.paidInvoices
        }
        overdueInvoices={
          dashboard.invoices.overdueInvoices
        }
        draftInvoices={
          dashboard.invoices.draftInvoices
        }
        sentInvoices={
          dashboard.invoices.sentInvoices
        }
        partiallyPaidInvoices={
          dashboard.invoices.partiallyPaidInvoices
        }
        cancelledInvoices={
          dashboard.invoices.cancelledInvoices
        }
        collectionRate={
          dashboard.invoices.collectionRate
        }
        outstandingBalance={
          dashboard.invoices.outstandingBalance
        }
        averageInvoiceValue={
          dashboard.invoices.averageInvoiceValue
        }
      />

      <PaymentAnalytics
        totalPayments={
          dashboard.payments.totalPayments
        }
        totalCollected={
          dashboard.payments.totalCollected
        }
        averagePayment={
          dashboard.payments.averagePayment
        }
        invoicesPaid={
          dashboard.payments.invoicesPaid
        }
        outstandingInvoices={
          dashboard.payments.outstandingInvoices
        }
        collectionRate={
          dashboard.payments.collectionRate
        }
      />
    </div>
  );
}