import Link from "next/link";

const steps = ["Review the scope of work", "Confirm customer access and service area", "Document before photos", "Complete work and quality check", "Document after photos", "Collect customer signature or completion notes"];

export default async function JobChecklistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="mx-auto max-w-3xl space-y-6 px-6 py-8"><Link href={`/admin/jobs/${id}`} className="text-sm font-medium text-blue-600">← Back to job</Link><div className="rounded-2xl border bg-white p-6 shadow-sm"><h1 className="text-3xl font-bold">Job Checklist</h1><p className="mt-2 text-slate-500">Use this operational checklist while completing the assigned job.</p><ol className="mt-6 space-y-3">{steps.map((step, index) => <li key={step} className="flex gap-3 rounded-xl border p-4"><span className="font-bold text-blue-700">{index + 1}</span><span>{step}</span></li>)}</ol></div></div>;
}
