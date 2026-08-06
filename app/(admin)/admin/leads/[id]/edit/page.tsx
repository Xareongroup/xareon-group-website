import Link from "next/link";
import { notFound } from "next/navigation";

import LeadEditForm from "@/components/admin/leads/LeadEditForm";
import { createClient } from "@/lib/supabase/server";

export default async function EditLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: lead, error } = await supabase.from("leads").select("id,first_name,last_name,email,phone,address,service_type,message,status,source").eq("id", id).single();
  if (error || !lead) notFound();
  return <div className="mx-auto max-w-4xl space-y-6 px-6 py-8"><div><Link href={`/admin/leads/${id}`} className="text-sm font-medium text-blue-600">← Lead Details</Link><h1 className="mt-2 text-3xl font-bold">Edit Lead</h1><p className="mt-1 text-slate-600">Update the service request and sales pipeline information.</p></div><LeadEditForm lead={lead}/></div>;
}
