import Link from "next/link";
import { notFound } from "next/navigation";

import { EstimateChangeRequest } from "@/components/portal/EstimateChangeRequest";
import EstimateSignature from "@/components/public/EstimateSignature";
import { logCustomerActivity } from "@/lib/activity/logActivity";
import { getPortalEstimate } from "@/lib/portal/data";
import { adminSupabase } from "@/lib/supabase/admin";

export default async function PortalEstimatePage({ params }: { params: Promise<{ token: string; id: string }> }) {
  const { token, id } = await params;
  const data = await getPortalEstimate(token, id);
  if (!data) notFound();

  await logCustomerActivity(adminSupabase, data.customer.id, "estimate_viewed", "Estimate viewed", `Customer viewed Estimate #${data.estimate.estimate_number}.`, { type: "estimate", id });
  const money = (value: number | null) => `$${Number(value ?? 0).toFixed(2)}`;

  return <main className="customer-portal min-h-screen bg-slate-50 py-8"><article className="mx-auto max-w-4xl space-y-6 px-4"><Link href={`/portal/${token}`} className="text-sm font-medium text-blue-700">← Back to portal</Link><section className="rounded-2xl bg-white p-7 shadow-sm"><p className="text-sm font-semibold tracking-[0.15em] text-blue-700">XAREON GROUP</p><h1 className="mt-2 text-3xl font-bold">Estimate #{data.estimate.estimate_number}</h1><p className="mt-2 text-slate-600">{data.customer.first_name} {data.customer.last_name} · {data.estimate.status}</p></section><section className="overflow-hidden rounded-2xl bg-white shadow-sm"><table className="w-full text-sm"><thead className="bg-slate-100 text-left"><tr><th className="p-4">Service</th><th className="p-4">Qty</th><th className="p-4 text-right">Total</th></tr></thead><tbody>{data.items.map((item) => <tr key={item.id} className="border-t"><td className="p-4">{item.description}</td><td className="p-4">{item.quantity} {item.unit}</td><td className="p-4 text-right">{money(item.total)}</td></tr>)}</tbody></table><div className="ml-auto max-w-sm space-y-2 p-5"><div className="flex justify-between"><span>Subtotal</span><span>{money(data.estimate.subtotal)}</span></div><div className="flex justify-between"><span>Tax</span><span>{money(data.estimate.tax)}</span></div><div className="flex justify-between border-t pt-2 text-lg font-bold"><span>Total</span><span>{money(data.estimate.total)}</span></div></div></section><section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Terms</h2><p className="mt-3 whitespace-pre-line text-slate-600">{data.estimate.terms || "No additional terms were provided."}</p></section>{data.estimate.signed_at ? <section className="rounded-2xl bg-green-50 p-6 text-green-800">Approved and signed by {data.estimate.signed_by_name ?? "Customer"} on {new Date(data.estimate.signed_at).toLocaleString()}.</section> : <section className="space-y-4"><EstimateSignature estimate={{ signature_token: data.estimate.signature_token }} portalToken={token} /><EstimateChangeRequest estimateId={data.estimate.id} token={token} /></section>}</article></main>;
}
