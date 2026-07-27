"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import PageHeader from "@/components/admin/PageHeader";
import FormSection from "@/components/admin/FormSection";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
}

interface Estimate {
  id: string;
  estimate_number: string;
}

interface Job {
  id: string;
  job_number: string;
}

export default function NewContractPage() {

  const router = useRouter();

  const supabase = createClient();

  const [loading, setLoading] =
    useState(false);

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [estimates, setEstimates] =
    useState<Estimate[]>([]);

  const [jobs, setJobs] =
    useState<Job[]>([]);

  const [title, setTitle] =
    useState("");

  const [customerId, setCustomerId] =
    useState("");

  const [estimateId, setEstimateId] =
    useState("");

  const [jobId, setJobId] =
    useState("");

  const [status, setStatus] =
    useState("Draft");

  const [scopeOfWork, setScopeOfWork] =
    useState("");

  const [paymentTerms, setPaymentTerms] =
    useState("");

  const [warranty, setWarranty] =
    useState("");

  const [notes, setNotes] =
    useState("");

  async function loadData() {

    const [

      customersResult,

      estimatesResult,

      jobsResult,

    ] = await Promise.all([
              supabase
        .from("customers")
        .select("id, first_name, last_name")
        .order("first_name"),

      supabase
        .from("estimates")
        .select("id, estimate_number")
        .order("estimate_number"),

      supabase
        .from("jobs")
        .select("id, job_number")
        .order("job_number"),

    ]);

    if (customersResult.data)
      setCustomers(customersResult.data);

    if (estimatesResult.data)
      setEstimates(estimatesResult.data);

    if (jobsResult.data)
      setJobs(jobsResult.data);

  }

  useEffect(() => {
    void loadData();
  }, []);

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    const { error } = await supabase

      .from("contracts")

      .insert({

        title,

        customer_id:
          customerId || null,

        estimate_id:
          estimateId || null,

        job_id:
          jobId || null,

        status,

        scope_of_work:
          scopeOfWork,

        payment_terms:
          paymentTerms,

        warranty,

        notes,

      });

    setLoading(false);

    if (error) {

      alert(error.message);

      return;

    }

    router.push("/admin/contracts");

    router.refresh();

  }

  return (

    <div className="mx-auto max-w-6xl px-6 py-8">

      <PageHeader
        title="New Contract"
        description="Create a new customer contract."
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
                <FormSection
          title="Contract Information"
          description="Basic information about this agreement."
        >

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Contract Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Kitchen Renovation Agreement"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              >
                <option>Draft</option>
                <option>Sent</option>
                <option>Signed</option>
                <option>Cancelled</option>
              </select>

            </div>

          </div>

        </FormSection>

        <FormSection
          title="Customer Information"
          description="Select the customer and related records."
        >

          <div className="grid gap-6 md:grid-cols-3">

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Customer
              </label>

              <select
                value={customerId}
                onChange={(e) =>
                  setCustomerId(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              >
                <option value="">
                  Select Customer
                </option>

                {customers.map((customer) => (

                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.first_name}{" "}
                    {customer.last_name}
                  </option>

                ))}

              </select>

            </div>
                        <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Estimate
              </label>

              <select
                value={estimateId}
                onChange={(e) =>
                  setEstimateId(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              >
                <option value="">
                  Select Estimate
                </option>

                {estimates.map((estimate) => (

                  <option
                    key={estimate.id}
                    value={estimate.id}
                  >
                    {estimate.estimate_number}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Job
              </label>

              <select
                value={jobId}
                onChange={(e) =>
                  setJobId(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              >
                <option value="">
                  Select Job
                </option>

                {jobs.map((job) => (

                  <option
                    key={job.id}
                    value={job.id}
                  >
                    {job.job_number}
                  </option>

                ))}

              </select>

            </div>

          </div>

        </FormSection>

        <FormSection
          title="Scope of Work"
          description="Describe the work that will be performed for the customer."
        >

          <textarea
            value={scopeOfWork}
            onChange={(e) =>
              setScopeOfWork(e.target.value)
            }
            rows={10}
            placeholder="Describe the project, materials, labor, responsibilities, exclusions, schedule, and any special requirements..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </FormSection>

        <FormSection
  title="Terms & Warranty"
  description="Payment terms, warranty information, and additional notes."
>

  <div className="grid gap-6">

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Payment Terms
              </label>

              <textarea
                value={paymentTerms}
                onChange={(e) =>
                  setPaymentTerms(e.target.value)
                }
                rows={4}
                placeholder="Example: 50% deposit due before work begins. Remaining balance due upon project completion."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Warranty
              </label>

              <textarea
                value={warranty}
                onChange={(e) =>
                  setWarranty(e.target.value)
                }
                rows={4}
                placeholder="Example: All workmanship is warranted for one year from the date of project completion."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Internal Notes
              </label>

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                rows={5}
                placeholder="Internal notes visible only to staff..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

        </FormSection>

        <div className="flex flex-col-reverse gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() =>
              router.push("/admin/contracts")
            }
            className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating Contract..."
              : "Create Contract"}
          </button>

        </div>

      </form>

    </div>

  );

}