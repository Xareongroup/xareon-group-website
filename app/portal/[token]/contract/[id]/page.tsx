import Link from "next/link";
import { notFound } from "next/navigation";

import ContractSignature from "@/components/public/ContractSignature";
import { getPortalContract } from "@/lib/portal/data";

export default async function PortalContractPage({ params }: { params: Promise<{ token: string; id: string }> }) {
  const { token, id } = await params;
  const data = await getPortalContract(token, id);
  if (!data) notFound();

  return <main className="customer-portal min-h-screen bg-slate-50 py-8"><article className="mx-auto max-w-4xl space-y-6 px-4"><Link href={`/portal/${token}`} className="text-sm font-medium text-blue-700">← Back to portal</Link><section className="rounded-2xl bg-white p-7 shadow-sm"><p className="text-sm font-semibold tracking-[0.15em] text-blue-700">XAREON GROUP</p><h1 className="mt-2 text-3xl font-bold">Service Contract #{data.contract.contract_number ?? "Pending"}</h1><p className="mt-2 text-slate-600">{data.customer.first_name} {data.customer.last_name} · {data.contract.status}</p></section><section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Contract Terms</h2><p className="mt-3 whitespace-pre-line text-slate-600">{data.contract.terms || "No terms provided."}</p>{data.contract.notes && <><h3 className="mt-6 font-semibold">Additional Notes</h3><p className="mt-2 whitespace-pre-line text-slate-600">{data.contract.notes}</p></>}</section>{data.contract.signed_at ? <section className="rounded-2xl bg-green-50 p-6 text-green-800">Signed by {data.contract.signed_by_name ?? "Customer"} on {new Date(data.contract.signed_at).toLocaleString()}.</section> : <ContractSignature contract={{ signature_token: data.contract.signature_token }} />}</article></main>;
}
