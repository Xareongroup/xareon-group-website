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
    <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">

      <h1 className="text-3xl font-bold">
        {title}
      </h1>

      <p className="mt-2 text-slate-500">
        {description}
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div>
            <label className="block font-medium">
              First Name
            </label>

            <input
              value={values.first_name}
              onChange={(e) =>
                update("first_name", e.target.value)
              }
              className="mt-2 w-full rounded-lg border p-3"
              required
            />
          </div>

          <div>
            <label className="block font-medium">
              Last Name
            </label>

            <input
              value={values.last_name}
              onChange={(e) =>
                update("last_name", e.target.value)
              }
              className="mt-2 w-full rounded-lg border p-3"
              required
            />
          </div>

        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div>
            <label className="block font-medium">
              Email
            </label>

            <input
              type="email"
              value={values.email}
              onChange={(e) =>
                update("email", e.target.value)
              }
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="block font-medium">
              Phone
            </label>

            <input
              value={values.phone}
              onChange={(e) =>
                update("phone", e.target.value)
              }
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

        </div>

        <div>
          <label className="block font-medium">
            Address
          </label>

          <input
            value={values.address}
            onChange={(e) =>
              update("address", e.target.value)
            }
            className="mt-2 w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="block font-medium">
            Notes
          </label>

          <textarea
            rows={5}
            value={values.notes}
            onChange={(e) =>
              update("notes", e.target.value)
            }
            className="mt-2 w-full rounded-lg border p-3"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end">

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : submitText}
          </button>

        </div>

      </form>

    </div>
  );
}