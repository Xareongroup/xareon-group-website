"use client";

import { Invoice } from "@/types/invoice";

interface CustomerOption {
  id: string;
  name: string;
}

interface EstimateOption {
  id: string;
  estimate_code: string;
}

interface JobOption {
  id: string;
  job_number: string;
}

interface Props {
  invoice: Invoice;

  setInvoice: React.Dispatch<
    React.SetStateAction<Invoice>
  >;

  customers: CustomerOption[];

  estimates: EstimateOption[];

  jobs: JobOption[];
}

export default function InvoiceHeader({
  invoice,
  setInvoice,
  customers,
  estimates,
  jobs,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-xl font-bold text-slate-900">
          Invoice Details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Customer, project and invoice information.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Customer
          </label>

          <select
            value={invoice.customerId}
            onChange={(e) =>
              setInvoice((prev) => ({
                ...prev,
                customerId: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">
              Select Customer
            </option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.name}
              </option>
            ))}
          </select>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select
            value={invoice.status}
            onChange={(e) =>
              setInvoice((prev) => ({
                ...prev,
                status: e.target.value as any,
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >

            <option>Draft</option>
            <option>Sent</option>
            <option>Viewed</option>
            <option>Paid</option>
            <option>Partially Paid</option>
            <option>Overdue</option>
            <option>Cancelled</option>

          </select>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Estimate
          </label>

          <select
            value={invoice.estimateId}
            onChange={(e) =>
              setInvoice((prev) => ({
                ...prev,
                estimateId: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >

            <option value="">
              None
            </option>

            {estimates.map((estimate) => (
              <option
                key={estimate.id}
                value={estimate.id}
              >
                {estimate.estimate_code}
              </option>
            ))}

          </select>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Job
          </label>

          <select
            value={invoice.jobId}
            onChange={(e) =>
              setInvoice((prev) => ({
                ...prev,
                jobId: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >

            <option value="">
              None
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
             <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Issue Date
          </label>

          <input
            type="date"
            value={invoice.issueDate}
            onChange={(e) =>
              setInvoice((prev) => ({
                ...prev,
                issueDate: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Due Date
          </label>

          <input
            type="date"
            value={invoice.dueDate}
            onChange={(e) =>
              setInvoice((prev) => ({
                ...prev,
                dueDate: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />

        </div>

      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm font-medium text-slate-500">
              Invoice Number
            </p>

            <p className="mt-1 text-2xl font-bold tracking-wide text-slate-900">
              {invoice.invoiceNumber || "Will be generated automatically"}
            </p>

          </div>

          <div className="text-right">

            <p className="text-sm text-slate-500">
              XAREON Group
            </p>

            <p className="text-lg font-semibold text-slate-900">
              Professional Invoice
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}   