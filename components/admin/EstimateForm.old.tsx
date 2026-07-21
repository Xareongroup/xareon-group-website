"use client";

import { useState } from "react";

export interface EstimateFormValues {
  customer_id: string;
  notes: string;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
}

interface EstimateFormProps {
  customers: Customer[];
  initialValues: EstimateFormValues;
  submitText: string;
  loading: boolean;
  error: string;
  onSubmit: (values: EstimateFormValues) => Promise<void>;
}

export default function EstimateForm({
  customers,
  initialValues,
  submitText,
  loading,
  error,
  onSubmit,
}: EstimateFormProps) {
  const [values, setValues] = useState(initialValues);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    await onSubmit(values);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Customer
        </label>

        <select
          required
          value={values.customer_id}
          onChange={(e) =>
            setValues({
              ...values,
              customer_id: e.target.value,
            })
          }
          className="w-full rounded-lg border border-slate-300 bg-white p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            Select a customer...
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
          Notes
        </label>

        <textarea
          rows={6}
          placeholder="Enter estimate notes, scope of work, materials, or special instructions..."
          value={values.notes}
          onChange={(e) =>
            setValues({
              ...values,
              notes: e.target.value,
            })
          }
          className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
}