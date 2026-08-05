"use client";

import { useState } from "react";

export interface JobFormValues {
  job_number: string;
  customer_id: string;
  estimate_id: string;

  title: string;
  description: string;

  status: string;
  priority: string;

  scheduled_date: string;

  assigned_employee_id: string;

  service_address: string;

  customer_phone: string;

  notes: string;
}

interface CustomerOption {
  id: string;
  first_name: string;
  last_name: string;
}

interface EstimateOption {
  id: string;
  estimate_number: string;
}

interface EmployeeOption {
  id: string;
  full_name: string;
}

interface JobFormProps {
  title: string;
  description: string;
  submitText: string;

  initialValues?: Partial<JobFormValues>;

  customers: CustomerOption[];
  estimates: EstimateOption[];
  employees: EmployeeOption[];

  loading?: boolean;
  error?: string;

  onSubmit: (values: JobFormValues) => Promise<void>;
}

export default function JobForm({
  title,
  description,
  submitText,
  initialValues,
  customers,
  estimates,
  employees,
  loading = false,
  error = "",
  onSubmit,
}: JobFormProps) {
  const [values, setValues] = useState<JobFormValues>({
    job_number: "",
    customer_id: "",
    estimate_id: "",

    title: "",
    description: "",

    status: "Scheduled",
    priority: "Normal",

    scheduled_date: "",

    assigned_employee_id: "",

    service_address: "",

    customer_phone: "",

    notes: "",

    ...initialValues,
  });

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    await onSubmit(values);
  }

  function update<K extends keyof JobFormValues>(
    key: K,
    value: JobFormValues[K]
  ) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      {/* ====================================================== */}
      {/* Header */}
      {/* ====================================================== */}

      <div className="border-b border-slate-200 pb-6">

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
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
             {/* ====================================================== */}
        {/* Job Information */}
        {/* ====================================================== */}

        <div>

          <h2 className="text-xl font-semibold text-slate-900">
            Job Information
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Job Number */}

            <div>

              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Job Number
              </label>

              <input
                value={values.job_number}
                onChange={(e) =>
                  update("job_number", e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                required
              />

            </div>

            {/* Job Title */}

            <div>

              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Job Title
              </label>

              <input
                value={values.title}
                onChange={(e) =>
                  update("title", e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                required
              />

            </div>

            {/* Customer */}

            <div>

              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Customer
              </label>

              <select
                value={values.customer_id}
                onChange={(e) =>
                  update("customer_id", e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                required
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

            {/* Estimate */}

            <div>

              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Related Estimate
              </label>

              <select
                value={values.estimate_id}
                onChange={(e) =>
                  update("estimate_id", e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >

                <option value="">
                  None
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

          </div>

        </div>

        {/* ====================================================== */}
        {/* Scheduling & Assignment */}
        {/* ====================================================== */}

        <div>

          <h2 className="text-xl font-semibold text-slate-900">
            Scheduling & Assignment
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Status */}

            <div>

              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Status
              </label>

              <select
                value={values.status}
                onChange={(e) =>
                  update("status", e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >

                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Waiting on Parts">
                  Waiting on Parts
                </option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>

              </select>

            </div>

            {/* Priority */}

            <div>

              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Priority
              </label>

              <select
                value={values.priority}
                onChange={(e) =>
                  update("priority", e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >

                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>

              </select>

            </div>

            {/* Scheduled Date */}

            <div>

              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Scheduled Date
              </label>

              <input
                type="datetime-local"
                value={values.scheduled_date}
                onChange={(e) =>
                  update("scheduled_date", e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              />

            </div>

            {/* Assigned Employee */}

            <div>

              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Assigned Employee
              </label>

              <select
                value={values.assigned_employee_id}
                onChange={(e) =>
                  update("assigned_employee_id", e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >

                <option value="">
                  Select Employee
                </option>

                {employees.map((employee) => (

                  <option
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.full_name}
                  </option>

                ))}

              </select>

            </div>

          </div>

        </div>

        {/* ====================================================== */}
        {/* Service Details */}
        {/* ====================================================== */}

        <div>

          <h2 className="text-xl font-semibold text-slate-900">
            Service Details
          </h2>

          <div className="mt-6 space-y-6">
                        {/* Service Address */}

            <div>

              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Service Address
              </label>

              <input
                value={values.service_address}
                onChange={(e) =>
                  update("service_address", e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              />

            </div>

            {/* Customer Phone */}

            <div>

              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Customer Phone
              </label>

              <input
                value={values.customer_phone}
                onChange={(e) =>
                  update("customer_phone", e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              />

            </div>

            {/* Job Description */}

            <div>

              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Job Description
              </label>

              <textarea
                rows={6}
                value={values.description}
                onChange={(e) =>
                  update("description", e.target.value)
                }
                placeholder="Describe the work to be performed..."
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              />

            </div>

            {/* Internal Notes */}

            <div>

              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Internal Notes
              </label>

              <textarea
                rows={5}
                value={values.notes}
                onChange={(e) =>
                  update("notes", e.target.value)
                }
                placeholder="Internal notes (not visible to customer)..."
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              />

            </div>

          </div>

        </div>

        {error && (

          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>

        )}

        <div className="flex justify-end border-t border-slate-200 pt-6">

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : submitText}
          </button>

        </div>

      </form>

    </div>
  );
}
