import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { ReportDashboardData } from "@/types/report-dashboard";

interface ExportPdfOptions {
  dashboard: ReportDashboardData;
  dateRange: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function exportReportPdf({
  dashboard,
  dateRange,
}: ExportPdfOptions) {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("XAREON Business Suite CRM", 14, 20);

  doc.setFontSize(12);
  doc.text("Business Performance Report", 14, 30);

  doc.setFontSize(10);
  doc.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    14,
    38
  );

  doc.text(
    `Reporting Period: ${dateRange}`,
    14,
    44
  );

  autoTable(doc, {
    startY: 52,
    head: [["Executive Summary", "Value"]],
    body: [
      [
        "Revenue",
        formatCurrency(dashboard.overview.revenue),
      ],
      [
        "Payments",
        formatCurrency(dashboard.overview.payments),
      ],
      [
        "Outstanding",
        formatCurrency(dashboard.overview.outstanding),
      ],
      ["Jobs", dashboard.overview.jobs.toString()],
      [
        "Customers",
        dashboard.overview.customers.toString(),
      ],
      [
        "Invoices",
        dashboard.overview.invoices.toString(),
      ],
    ],
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 12,
    head: [["Invoice Status", "Count"]],
    body: [
      ["Paid", dashboard.invoices.paidInvoices],
      ["Sent", dashboard.invoices.sentInvoices],
      ["Draft", dashboard.invoices.draftInvoices],
      [
        "Partially Paid",
        dashboard.invoices.partiallyPaidInvoices,
      ],
      ["Overdue", dashboard.invoices.overdueInvoices],
      [
        "Cancelled",
        dashboard.invoices.cancelledInvoices,
      ],
    ],
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 12,
    head: [["Jobs", "Count"]],
    body: [
      [
        "Completed",
        dashboard.jobs.completedJobs,
      ],
      [
        "Scheduled",
        dashboard.jobs.scheduledJobs,
      ],
      [
        "In Progress",
        dashboard.jobs.inProgressJobs,
      ],
      [
        "Cancelled",
        dashboard.jobs.cancelledJobs,
      ],
    ],
  });

  doc.save(
    `XAREON_Report_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`
  );
}