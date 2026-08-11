import DocumentPdfShell from "@/components/pdf/DocumentPdfShell";
import type { InvoicePdfData, InvoicePdfItem } from "@/types/invoicePdf";
import InvoicePDFCustomer from "./InvoicePDFCustomer";
import InvoicePDFFooter from "./InvoicePDFFooter";
import InvoicePDFHeader from "./InvoicePDFHeader";
import InvoicePDFItems from "./InvoicePDFItems";
import InvoicePDFTotals from "./InvoicePDFTotals";

export default function InvoicePDF({ invoice, items }: { invoice: InvoicePdfData; items: InvoicePdfItem[] }) {
  return <DocumentPdfShell title="INVOICE" metadata={<InvoicePDFHeader invoice={invoice} />}><InvoicePDFCustomer invoice={invoice} /><InvoicePDFItems items={items} /><InvoicePDFTotals invoice={invoice} /><InvoicePDFFooter invoice={invoice} /></DocumentPdfShell>;
}
