import { notFound } from "next/navigation";

import { adminSupabase } from "@/lib/supabase/admin";
import InvoicePreview from "@/components/invoices/InvoicePreview";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InvoicePreviewPage({
  params,
}: PageProps) {
  const { id } = await params;

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

  return (
    <InvoicePreview
      invoice={invoice}
      customer={customer}
      items={items ?? []}
    />
  );
}
