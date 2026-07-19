import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function CustomersPage() {
  const supabase = await createClient();

  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-red-600">
          Failed to load customers
        </h1>

        <p className="mt-2 text-slate-600">
          {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Customers
          </h1>

          <p className="mt-2 text-slate-500">
            {customers.length} customer(s)
          </p>
        </div>

        <Link
          href="/admin/customers/new"
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          + New Customer
        </Link>

      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Name
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Email
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Phone
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-slate-500"
                >
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-6 py-4 font-medium">
                    {customer.first_name} {customer.last_name}
                  </td>

                  <td className="px-6 py-4">
                    {customer.email || "—"}
                  </td>

                  <td className="px-6 py-4">
                    {customer.phone || "—"}
                  </td>

                  <td className="px-6 py-4">

                    <div className="flex justify-center gap-3">

                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                      >
                        View
                      </Link>

                      <Link
  href={`/admin/customers/${customer.id}/edit`}
  className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-100"
>
  Edit
</Link>

                    </div>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}