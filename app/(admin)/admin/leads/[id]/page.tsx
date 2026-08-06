import Link from "next/link";
import { notFound } from "next/navigation";

import ConvertLeadButton from "@/components/admin/leads/ConvertLeadButton";
import LeadActions from "@/components/admin/leads/LeadActions";
import StatusBadge from "@/components/admin/StatusBadge";
import { createClient } from "@/lib/supabase/server";
import { adminSupabase } from "@/lib/supabase/admin";

type Photo = { path?: string; name?: string };

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: lead, error } = await supabase.from("leads").select("*").eq("id", id).single();
  if (error || !lead) notFound();
  const { data: activities } = await supabase.from("lead_activities").select("id,activity_type,description,created_at").eq("lead_id", id).order("created_at", { ascending: false });
  const photos = Array.isArray(lead.photos) ? lead.photos as Photo[] : [];
  const photoLinks = await Promise.all(photos.map(async (photo) => {
    const path = photo.path;
    const signed = path ? await adminSupabase.storage.from("lead-photos").createSignedUrl(path, 3600) : null;
    return {
      name: photo.name ?? "Uploaded photo",
      url: signed?.data?.signedUrl ?? null,
    };
  }));
  const estimateHref = lead.converted_customer_id ? `/admin/estimates/new?customer=${lead.converted_customer_id}&service=${encodeURIComponent(lead.service_type ?? "")}&description=${encodeURIComponent(lead.message ?? "")}&photos=${encodeURIComponent(photos.map((photo) => photo.name ?? "Uploaded photo").join(", "))}` : null;
  return <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between"><div><Link href="/admin/leads" className="text-sm font-medium text-blue-600 hover:underline">← Leads</Link><h1 className="mt-2 text-3xl font-bold">{lead.lead_number}</h1><p className="mt-1 text-slate-600">Lead for {lead.first_name} {lead.last_name}</p></div><div className="flex flex-wrap gap-2"><Link href={`/admin/leads/${id}/edit`} className="rounded-lg border px-4 py-2 font-medium hover:bg-slate-50">Edit Lead</Link>{estimateHref && <Link href={estimateHref} className="rounded-lg border px-4 py-2 font-medium hover:bg-slate-50">Create Estimate</Link>}<ConvertLeadButton leadId={id} convertedCustomerId={lead.converted_customer_id}/></div></div>
    <LeadActions leadId={id} status={lead.status}/>
    <div className="grid gap-6 lg:grid-cols-2"><Section title="Lead Information"><Row label="Lead Number" value={lead.lead_number}/><Row label="Status" value={<StatusBadge status={lead.status}/>}/><Row label="Source" value={lead.source}/><Row label="Created Date" value={new Date(lead.created_at).toLocaleString()}/></Section><Section title="Customer Information"><Row label="First Name" value={lead.first_name}/><Row label="Last Name" value={lead.last_name}/><Row label="Email" value={lead.email}/><Row label="Phone" value={lead.phone}/><Row label="Address" value={lead.address ?? "—"}/></Section></div>
    <Section title="Request Details"><Row label="Service Type" value={lead.service_type ?? "—"}/><div className="mt-4"><p className="text-sm text-slate-500">Customer Message</p><p className="mt-1 whitespace-pre-wrap text-slate-800">{lead.message ?? "No message provided."}</p></div>{photoLinks.length > 0 && <div className="mt-5"><p className="text-sm text-slate-500">Uploaded Photos</p><ul className="mt-2 space-y-2">{photoLinks.map((photo, index) => <li key={`${photo.name}-${index}`}>{photo.url ? <a href={photo.url} target="_blank" className="text-sm font-medium text-blue-600 hover:underline">{photo.name}</a> : <span className="text-sm text-slate-500">{photo.name}</span>}</li>)}</ul></div>}</Section>
    <Section title="Activity Timeline">{(activities ?? []).length === 0 ? <p className="text-sm text-slate-500">No activity recorded yet.</p> : <ol className="space-y-4">{activities?.map((activity) => <li key={activity.id} className="border-l-2 border-blue-200 pl-4"><p className="font-medium capitalize">{activity.activity_type.replaceAll("_", " ")}</p>{activity.description && <p className="mt-1 text-sm text-slate-600">{activity.description}</p>}<p className="mt-1 text-xs text-slate-400">{new Date(activity.created_at).toLocaleString()}</p></li>)}</ol>}</Section>
  </div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="mb-4 text-lg font-semibold">{title}</h2><div className="space-y-3">{children}</div></section>; }
function Row({ label, value }: { label: string; value: React.ReactNode }) { return <div><p className="text-sm text-slate-500">{label}</p><div className="mt-1 text-slate-800">{value}</div></div>; }
