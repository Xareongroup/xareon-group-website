import { Text } from "@react-pdf/renderer";

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

    <><Text>Invoice #: {invoice.invoice_number}</Text><Text>Status: {invoice.status}</Text><Text>Issue: {invoice.issue_date ?? "-"}</Text><Text>Due: {invoice.due_date ?? "-"}</Text></>

  );

}
