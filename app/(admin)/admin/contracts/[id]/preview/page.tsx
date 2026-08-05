import "../../../estimates/[id]/preview/print.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PrintButton from "@/components/admin/estimates/PrintButton";
import DownloadContractPDFButton from "@/components/admin/contracts/DownloadContractPDFButton";

export default async function ContractPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: contract, error } = await supabase.from("contracts").select("*,customer:customers(first_name,last_name,email,phone,address),estimate:estimates(estimate_number,total),job:jobs(job_number)").eq("id", id).single();
  if (error || !contract) notFound();
  const customer = Array.isArray(contract.customer) ? contract.customer[0] : contract.customer;
  const estimate = Array.isArray(contract.estimate) ? contract.estimate[0] : contract.estimate;
  const job = Array.isArray(contract.job) ? contract.job[0] : contract.job;
  return <div className="mx-auto max-w-[8.5in] space-y-4 p-3">
    <div className="flex justify-between print:hidden"><Link href={`/admin/contracts/${id}`} className="rounded-lg border border-slate-300 px-5 py-2 font-medium hover:bg-slate-100">← Back</Link><div className="flex gap-3"><PrintButton /><DownloadContractPDFButton id={id} /></div></div>
    <article className="estimate-print relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center"><img src="/logo/xareon1-logo.png" alt="" aria-hidden="true" className="w-[520px] object-contain opacity-[0.035]" /></div>
      <header className="relative z-10 mb-6 flex items-start justify-between border-b-2 border-slate-200 pb-5"><div className="flex items-start gap-8"><img src="/logo/xareon1-logo.png" alt="XAREON Group" className="h-36 w-36 object-contain" /><div><h1 className="text-3xl font-extrabold tracking-wide text-blue-700">XAREON GROUP</h1><p className="mt-1 text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Shield of Integrity</p><div className="mt-5 space-y-0.5 text-sm text-slate-600"><p>Professional Home Repair &amp; Installation Services</p><p>Serving the Greater DMV Metro Area</p><p>(202) 286-8497</p><p>info@xareongroup.com</p><p>www.xareongroup.com</p></div></div></div><div className="min-w-[220px] rounded-xl border border-blue-200 bg-blue-50 p-3.5"><h2 className="mb-3 text-right text-2xl font-extrabold tracking-[0.25em] text-blue-700">CONTRACT</h2><div className="space-y-1.5 text-sm"><Row label="Number" value={contract.contract_number ?? "—"} /><Row label="Status" value={contract.status ?? "Draft"} /><Row label="Created" value={contract.created_at ? new Date(contract.created_at).toLocaleDateString() : "—"} /><Row label="Related" value={job?.job_number ? `Job #${job.job_number}` : estimate?.estimate_number ? `Estimate #${estimate.estimate_number}` : "—"} /></div></div></header>
      <section className="relative z-10 mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4"><h3 className="mb-4 text-lg font-bold text-slate-800">Prepared For</h3><div className="grid gap-x-8 gap-y-3 md:grid-cols-2"><Field label="Customer" value={`${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`.trim() || "—"} /><Field label="Email" value={customer?.email ?? "—"} /><Field label="Phone" value={customer?.phone ?? "—"} /><Field label="Address" value={customer?.address ?? "—"} /></div></section>
      <section className="relative z-10 rounded-2xl border border-slate-200 p-5"><h3 className="text-lg font-bold text-slate-800">Agreement Terms</h3><p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-700">{contract.terms || "No terms have been provided."}</p>{contract.notes && <><h3 className="mt-6 text-lg font-bold text-slate-800">Notes</h3><p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{contract.notes}</p></>}</section>
      <section className="relative z-10 mt-6 rounded-2xl border border-slate-200 p-5"><h3 className="text-lg font-bold text-slate-800">Signature</h3><div className="mt-5 grid gap-6 sm:grid-cols-2"><div className="border-b border-slate-300 pb-2 text-sm">Customer: {contract.signed_by_name ?? "Pending signature"}</div><div className="border-b border-slate-300 pb-2 text-sm">Date: {contract.signed_at ? new Date(contract.signed_at).toLocaleDateString() : "Pending"}</div></div></section>
      <footer className="relative z-10 mt-8 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">XAREON GROUP · Shield of Integrity · (202) 286-8497 · info@xareongroup.com</footer>
    </article>
  </div>;
}
function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-3"><span className="font-semibold text-slate-600">{label}</span><span className="text-right">{value}</span></div>; }
function Field({ label, value }: { label: string; value: string }) { return <div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p><p className="mt-0.5 text-sm text-slate-800">{value}</p></div>; }
