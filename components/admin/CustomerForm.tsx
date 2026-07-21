"use client";

import { useState } from "react";

export interface CustomerFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

interface CustomerFormProps {
  title: string;
  description: string;
  submitText: string;
  initialValues: CustomerFormValues;
  loading?: boolean;
  error?: string;
  onSubmit: (values: CustomerFormValues) => Promise<void>;
}

export default function CustomerForm({
  title,
  description,
  submitText,
  initialValues,
  loading = false,
  error = "",
  onSubmit,
}: CustomerFormProps) {
  const [values, setValues] = useState<CustomerFormValues>(initialValues);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    await onSubmit(values);
  }

  function update<K extends keyof CustomerFormValues>(
    key: K,
    value: CustomerFormValues[K]
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div>

            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              First Name
            </label>

            <input
              value={values.first_name}
              onChange={(e) =>
                update("first_name", e.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              required
            />

          </div>

          <div>

            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Last Name
            </label>

            <input
              value={values.last_name}
              onChange={(e) =>
                update("last_name", e.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              required
            />

          </div>

                </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div>

            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Email
            </label>

            <input
              type="email"
              value={values.email}
              onChange={(e) =>
                update("email", e.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
            />

          </div>

          <div>

            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Phone
            </label>

            <input
              value={values.phone}
              onChange={(e) =>
                update("phone", e.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
            />

          </div>

        </div>

        <div>

          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Address
          </label>

          <input
            value={values.address}
            onChange={(e) =>
              update("address", e.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
          />

        </div>

        <div>

          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Notes
          </label>

          <textarea
            rows={5}
            value={values.notes}
            onChange={(e) =>
              update("notes", e.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
          />

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