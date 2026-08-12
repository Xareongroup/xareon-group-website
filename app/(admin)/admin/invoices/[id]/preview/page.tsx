import { notFound } from "next/navigation";

import { adminSupabase } from "@/lib/supabase/admin";
import InvoicePreview from "@/components/invoices/InvoicePreview";
import PrintOnLoad from "@/components/documents/PrintOnLoad";
import "../../../estimates/[id]/preview/print.css";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ print?: string }>;
}

export default async function InvoicePreviewPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { print: shouldPrint } = await searchParams;

  const supabase = adminSupabase;

  // Load invoice
  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !invoice) {
    notFound();
  }
  if (!invoice.customer_id) notFound();

  // Load customer
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", invoice.customer_id)
    .single();

  // Load invoice items
  const { data: items } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", id)
    .order("sort_order");

  return <>
    {shouldPrint === "1" && <PrintOnLoad />}
    <InvoicePreview
      invoice={invoice}
      customer={customer}
      items={items ?? []}
    />
  </>;
}
