import XareonDocumentHeader from "./XareonDocumentHeader";

import {
  InvoicePdfData,
} from "@/types/invoicePdf";


interface Props {

  invoice: InvoicePdfData;

}



export default function InvoicePDFHeader({

  invoice,

}: Props) {


  return (

    <XareonDocumentHeader

      title="INVOICE"

      details={[

        {
          label: "Invoice #",
          value: invoice.invoice_number,
        },

        {
          label: "Status",
          value: invoice.status,
        },

        {
          label: "Issue",
          value: invoice.issue_date,
        },

        {
          label: "Due",
          value: invoice.due_date,
        },

      ]}

    />

  );

}