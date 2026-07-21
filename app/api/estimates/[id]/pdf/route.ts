import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderEstimatePdf } from "@/lib/pdf/renderEstimatePdf";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteProps
) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: estimate } = await supabase
    .from("estimates")
    .select(
      `
      *,
      customer:customers(*)
    `
    )
    .eq("id", id)
    .single();

  if (!estimate) {
    return NextResponse.json(
      { error: "Estimate not found" },
      { status: 404 }
    );
  }

  const { data: items } = await supabase
    .from("estimate_items")
    .select("*")
    .eq("estimate_id", id)
    .order("sort_order");

  const pdfBuffer = await renderEstimatePdf({
    estimate,
    customer: estimate.customer,
    items: items ?? [],
  });

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Estimate-${estimate.estimate_number}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}