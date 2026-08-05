import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import EstimateForm from "@/components/admin/estimates/EstimateForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEstimatePage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  // Load estimate
  const { data: estimate, error } = await supabase
    .from("estimates")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !estimate) {
    notFound();
  }

  // Load estimate items
  const { data: items } = await supabase
    .from("estimate_items")
    .select("*")
    .eq("estimate_id", id)
    .order("sort_order");

  const formattedItems =
    (items ?? []).map((item: any) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unit_price,
      discount: item.discount,
      taxable: item.taxable,
      total: item.total,
    }));

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">

      {/* ====================================================== */}
      {/* Page Header */}
      {/* ====================================================== */}

      <div className="mb-8 border-b border-slate-200 pb-6">

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Edit Estimate
        </h1>

        <p className="mt-2 text-base text-slate-500">
          Update estimate information, line items, pricing, and customer details.
        </p>

      </div>

      <EstimateForm
        estimate={{
          id: estimate.id,
          customerId: estimate.customer_id,
          estimateNumber: String(estimate.estimate_number),
          issueDate: estimate.issue_date,
          expirationDate: estimate.expiration_date ?? "",
          status: estimate.status as any,
          items: formattedItems,
          subtotal: estimate.subtotal,
          taxRate: estimate.tax_rate ?? 0,
          tax: estimate.tax,
          discount: estimate.discount ?? 0,
          total: estimate.total,
          notes: estimate.notes ?? "",
          terms: estimate.terms ?? "",
        }}
        items={formattedItems}
        isEditing
      />

    </div>
  );
}
