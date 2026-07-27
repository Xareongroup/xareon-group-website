import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "../InvoicePDF";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InvoicePDFPage({
  params,
}: PageProps) {
  const { id } = await params;

  // We'll use this in the next step
  console.log("Invoice ID:", id);

  return (
    <div className="h-screen w-full">
      <PDFViewer width="100%" height="100%">
        <InvoicePDF />
      </PDFViewer>
    </div>
  );
}