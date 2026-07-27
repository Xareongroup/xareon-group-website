import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";

export default function InvoicePage() {
  return (
    <div className="h-screen w-full">

      <PDFViewer
        width="100%"
        height="100%"
      >
        <InvoicePDF />
      </PDFViewer>

    </div>
  );
}