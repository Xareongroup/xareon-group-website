import Link from "next/link";
import { notFound } from "next/navigation";
import CompleteJobButton from "@/components/admin/jobs/CompleteJobButton";
import { createClient } from "@/lib/supabase/server";
import CreateInvoiceButton from "@/components/admin/jobs/CreateInvoiceButton";
import JobPhotos from "@/components/admin/jobs/JobPhotos";
import JobProfitabilityCard from "@/components/admin/financials/JobProfitabilityCard";
import CancelJobButton from "@/components/admin/jobs/CancelJobButton";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function getStatusColor(status: string) {
  switch (status) {
    case "Scheduled":
      return "bg-blue-100 text-blue-700";

    case "In Progress":
      return "bg-amber-100 text-amber-700";

    case "Completed":
      return "bg-green-100 text-green-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "Low":
      return "bg-slate-100 text-slate-700";

    case "Normal":
      return "bg-blue-100 text-blue-700";

    case "High":
      return "bg-orange-100 text-orange-700";

    case "Urgent":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default async function JobDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: job, error } = await supabase
  .from("jobs")
  .select(`
    *,
    customer:customers(
      id,
      first_name,
      last_name,
      email,
      phone,
      address
    ),
    estimate:estimates(
      id,
      estimate_number
    ),
    technician:employees(
      first_name,
      last_name
    )
  `)
  .eq("id", id)
  .single();

console.log("Job:", job);
console.log("Error:", error);

  if (error || !job) {
  console.error("Job query failed:", error);
  console.error("Job returned:", job);

  throw new Error(
    error?.message ?? "Job not found."
  );
}

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">

      {/* Header */}

      <div className="mb-8 flex flex-col gap-6 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            {job.job_number}
          </h1>

          <p className="mt-2 text-base text-slate-500">
            View job details, technician information and scheduling.
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          <Link
            href="/admin/jobs"
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-100"
          >
            Back
          </Link>

          <Link
            href={`/admin/jobs/${job.id}/edit`}
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-100"
          >
            Edit
          </Link>

          {job.status !== "Completed" ? (
  <CompleteJobButton jobId={job.id} />
) : (
  <span className="rounded-lg bg-green-100 px-4 py-2 font-medium text-green-700">
    ✓ Job Completed
  </span>
)}

          {job.status !== "Completed" && job.status !== "Cancelled" && (
            <CancelJobButton jobId={job.id} />
          )}

          {job.invoice_id ? (
  <Link
    href={`/admin/invoices/${job.invoice_id}`}
    className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
  >
    View Invoice
  </Link>
) : job.status === "Completed" ? (
  <CreateInvoiceButton jobId={job.id} />
) : (
  <button
    disabled
    className="cursor-not-allowed rounded-lg bg-slate-300 px-4 py-2 font-medium text-white"
  >
    Create Invoice
  </button>
)}

        </div>

      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_380px]">

  {/* Left Column */}

  <div className="space-y-6">

    {/* Customer */}

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-5 text-lg font-semibold text-slate-900">
        Customer
      </h2>

      <div className="space-y-4">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Name
          </p>

          <p className="mt-1 text-base font-medium text-slate-900">
            {job.customer
              ? `${job.customer.first_name} ${job.customer.last_name}`
              : "Unknown Customer"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Email
          </p>

          <p className="mt-1">
            {job.customer?.email || "—"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Phone
          </p>

          <p className="mt-1">
            {job.customer?.phone || "—"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Address
          </p>

          <p className="mt-1 whitespace-pre-line">
            {job.customer?.address || "—"}
          </p>
        </div>

      </div>

    </div>

    {/* Job Information */}

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-5 text-lg font-semibold text-slate-900">
        Job Information
      </h2>

      <div className="grid gap-5 md:grid-cols-2">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Status
          </p>

          <span
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(job.status ?? "")}`}
          >
            {job.status ?? "—"}
          </span>

        </div>

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Priority
          </p>

          <span
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getPriorityColor(job.priority ?? "")}`}
          >
            {job.priority ?? "—"}
          </span>

        </div>

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Technician
          </p>

          <p className="mt-1">
            {typeof job.technician === "object" && job.technician
              ? `${job.technician.first_name} ${job.technician.last_name}`
              : "Not Assigned"}
          </p>

        </div>

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Scheduled Date
          </p>

          <p className="mt-1">
            {job.scheduled_date
              ? new Date(job.scheduled_date).toLocaleDateString()
              : "-"}
          </p>

        </div>

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Completed Date
          </p>

          <p className="mt-1">
            {job.completed_date
              ? new Date(job.completed_date).toLocaleDateString()
              : "-"}
          </p>

        </div>

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Estimate
          </p>

          <p className="mt-1">
            {job.estimate?.estimate_number || "-"}
          </p>

        </div>

      </div>

    </div>

    {/* Description */}

<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

  <h2 className="mb-4 text-lg font-semibold text-slate-900">
    Description
  </h2>

  <p className="whitespace-pre-wrap leading-7 text-slate-700">
    {job.description || "No description provided."}
  </p>

</div>

{/* Job Photos */}

<JobPhotos jobId={job.id} />

</div>

  {/* Right Sidebar */}

<div className="space-y-6 xl:sticky xl:top-6 xl:self-start">

  {/* Job Summary */}

  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

    <h2 className="mb-5 text-lg font-semibold text-slate-900">
      Job Summary
    </h2>

    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <span className="text-slate-500">Job Number</span>

        <span className="font-semibold">
          {job.job_number ?? "—"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-slate-500">Status</span>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
             job.status ?? ""
          )}`}
        >
           {job.status ?? "—"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-slate-500">Priority</span>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${getPriorityColor(
             job.priority ?? ""
          )}`}
        >
           {job.priority ?? "—"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-slate-500">Technician</span>

        <span className="font-medium">
           {typeof job.technician === "object" && job.technician
             ? `${job.technician.first_name} ${job.technician.last_name}`
             : "Unassigned"}
        </span>
      </div>

    </div>

  </div>

  {/* Service Address */}

  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

    <h2 className="mb-4 text-lg font-semibold text-slate-900">
      Service Address
    </h2>

    <p className="whitespace-pre-line text-slate-700">
      {job.service_address || "No service address available."}
    </p>

  </div>

  {/* Notes */}

  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

    <h2 className="mb-4 text-lg font-semibold text-slate-900">
      Notes
    </h2>

    <p className="whitespace-pre-wrap leading-7 text-slate-700">
      {job.notes || "No notes have been added."}
    </p>

  </div>

  <JobProfitabilityCard jobId={job.id} />

  {/* Quick Actions */}

  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

    <h2 className="mb-5 text-lg font-semibold text-slate-900">
      Quick Actions
    </h2>

    <div className="space-y-3">

      {job.status !== "Completed" ? (
  <CompleteJobButton jobId={job.id} />
) : (
  <div className="w-full rounded-lg bg-green-100 px-4 py-3 text-center font-medium text-green-700">
    ✓ Job Completed
  </div>
)}

      {job.status === "Completed" ? (
  <div className="w-full">
    {job.invoice_id ? (
  <Link
    href={`/admin/invoices/${job.invoice_id}`}
    className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
  >
    View Invoice
  </Link>
) : job.status === "Completed" ? (
  <CreateInvoiceButton jobId={job.id} />
) : (
  <button
    disabled
    className="cursor-not-allowed rounded-lg bg-slate-300 px-4 py-2 font-medium text-white"
  >
    Create Invoice
  </button>
)}
  </div>
) : (

  <button
    disabled
    className="w-full cursor-not-allowed rounded-lg bg-slate-300 px-4 py-3 font-medium text-white"
  >
    Create Invoice
  </button>
)}

    </div>

  </div>

</div>
      {/* End Grid */}
      </div>

    </div>
  );
}
