"use client";

import { useState } from "react";

export interface CustomerOption {
  id: string;
  first_name: string;
  last_name: string;
}

export interface EstimateOption {
  id: string;
  estimate_number: string;
}

export interface JobOption {
  id: string;
  job_number: string;
}

export interface ContractFormValues {
  title: string;
  customer_id: string;
  estimate_id: string;
  job_id: string;
  status: string;
  scope_of_work: string;
  payment_terms: string;
  warranty: string;
  notes: string;
}

interface ContractFormProps {
  title: string;
  description: string;
  submitText: string;

  customers: CustomerOption[];
  estimates: EstimateOption[];
  jobs: JobOption[];

  initialValues: ContractFormValues;

  loading?: boolean;
  error?: string;

  onSubmit: (
    values: ContractFormValues
  ) => Promise<void>;
}

export default function ContractForm({
  title,
  description,
  submitText,

  customers,
  estimates,
  jobs,

  initialValues,

  loading = false,
  error = "",

  onSubmit,
}: ContractFormProps) {
  const [values, setValues] =
    useState(initialValues);

  function update<
    K extends keyof ContractFormValues
  >(
    key: K,
    value: ContractFormValues[K]
  ) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    await onSubmit(values);
  }

  return (
    <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div className="border-b border-slate-200 pb-6">

        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-2 text-slate-500">
          {description}
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-8"
      >
        {/* ================================================= */}
        {/* Contract Information */}
        {/* ================================================= */}

        <section className="space-y-6">

          <div>

            <h2 className="text-xl font-semibold text-slate-900">
              Contract Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Basic information about this customer agreement.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Contract Title
              </label>

              <input
                type="text"
                value={values.title}
                onChange={(e) =>
                  update("title", e.target.value)
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
                value={values.status}
                onChange={(e) =>
                  update("status", e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Signed">Signed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Expired">Expired</option>
              </select>

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* Customer / Estimate / Job */}
        {/* ================================================= */}

        <section className="space-y-6">

          <div>

            <h2 className="text-xl font-semibold text-slate-900">
              Related Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Link this contract to an existing customer, estimate and job.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Customer
              </label>

              <select
                value={values.customer_id}
                onChange={(e) =>
                  update("customer_id", e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select Customer
                </option>

                {customers.map((customer) => (

                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.first_name} {customer.last_name}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Estimate
              </label>

              <select
                value={values.estimate_id}
                onChange={(e) =>
                  update("estimate_id", e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                value={values.job_id}
                onChange={(e) =>
                  update("job_id", e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

        </section>

        {/* ================================================= */}
        {/* Scope of Work */}
        {/* ================================================= */}

        <section className="space-y-6">

          <div>

            <h2 className="text-xl font-semibold text-slate-900">
              Scope of Work
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Describe exactly what work will be performed for the customer.
            </p>

          </div>

          <textarea
            rows={10}
            value={values.scope_of_work}
            onChange={(e) =>
              update(
                "scope_of_work",
                e.target.value
              )
            }
            placeholder="Describe the project, labor, materials, schedule, exclusions, permits, cleanup responsibilities, and any special requirements..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </section>

        {/* ================================================= */}
        {/* Terms & Warranty */}
        {/* ================================================= */}

        <section className="space-y-6">

          <div>

            <h2 className="text-xl font-semibold text-slate-900">
              Terms & Warranty
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Define payment expectations, warranty coverage, and internal notes.
            </p>

          </div>
                    <div className="grid gap-6">

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Payment Terms
              </label>

              <textarea
                rows={4}
                value={values.payment_terms}
                onChange={(e) =>
                  update(
                    "payment_terms",
                    e.target.value
                  )
                }
                placeholder="Example: 50% deposit due before work begins. Remaining balance due upon project completion."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Warranty
              </label>

              <textarea
                rows={4}
                value={values.warranty}
                onChange={(e) =>
                  update(
                    "warranty",
                    e.target.value
                  )
                }
                placeholder="Example: All workmanship is warranted for one year from the completion date."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Internal Notes
              </label>

              <textarea
                rows={5}
                value={values.notes}
                onChange={(e) =>
                  update(
                    "notes",
                    e.target.value
                  )
                }
                placeholder="Internal notes visible only to staff..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

        </section>

        {error && (

          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>

        )}

        <div className="flex justify-end border-t border-slate-200 pt-8">

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Saving Contract..."
              : submitText}
          </button>

        </div>

      </form>

    </div>

  );

}