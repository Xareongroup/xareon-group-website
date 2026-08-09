import Link from "next/link";

import CustomerSearch from "@/components/customers/CustomerSearch";
import CustomerStatusFilter from "@/components/customers/CustomerStatusFilter";
import { getCustomers } from "@/app/actions/customers";
import RestoreCustomerButton from "@/components/admin/customers/RestoreCustomerButton";
import MobileRecordCard from "@/components/admin/MobileRecordCard";


export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}) {

  const params = await searchParams;


  const search = params.search ?? "";

  const status = params.status ?? "Active";


  const customers = await getCustomers(
    search,
    status
  );


  return (
    <div className="mx-auto max-w-7xl px-6 py-8">


      {/* Header */}

      <div className="mb-8 flex flex-col gap-6 border-b border-slate-200 pb-6">


        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">


          <div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Customers
            </h1>


            <p className="mt-2 text-slate-500">
              Manage your customer database and contact information.
            </p>


            <p className="mt-1 text-sm text-slate-400">
              {customers.length} customer{customers.length !== 1 ? "s" : ""}
            </p>

          </div>



          <Link
            href="/admin/customers/new"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            + New Customer
          </Link>


        </div>



        {/* Filters + Search */}

        <div className="flex flex-col gap-4">

          <CustomerStatusFilter />

          <CustomerSearch />

        </div>


      </div>



      {/* Customers Table */}


      <div className="space-y-3 md:hidden">
        {customers.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-500 shadow-sm">
            No customers found.
          </div>
        ) : (
          customers.map((customer) => (
            <MobileRecordCard
              key={customer.id}
              title={`${customer.first_name} ${customer.last_name}`}
              subtitle={customer.status}
              fields={[
                { label: "Email", value: customer.email || "Not provided" },
                { label: "Phone", value: customer.phone || "Not provided" },
              ]}
              actions={
                <>
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/customers/${customer.id}/edit`}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Edit
                  </Link>
                  {customer.status === "Archived" ? (
                    <RestoreCustomerButton customerId={customer.id} />
                  ) : null}
                </>
              }
            />
          ))
        )}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">


        <table className="min-w-full">


          <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">


            <tr>

              <th className="px-6 py-4 text-left">
                Customer
              </th>


              <th className="px-6 py-4 text-left">
                Email
              </th>


              <th className="px-6 py-4 text-left">
                Phone
              </th>


              <th className="px-6 py-4 text-center">
                Actions
              </th>


            </tr>


          </thead>



          <tbody>


            {customers.length === 0 ? (

              <tr>

                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No customers found.
                </td>

              </tr>


            ) : (


              customers.map((customer) => (


                <tr
                  key={customer.id}
                  className="border-t border-slate-100 transition-colors hover:bg-slate-50"
                >


                  <td className="px-6 py-4">

                    <div>

                      <p className="font-semibold text-slate-900">
                        {customer.first_name} {customer.last_name}
                      </p>


                      <p className="text-xs text-slate-400">
                        {customer.status}
                      </p>


                    </div>

                  </td>



                  <td className="px-6 py-4 text-slate-600">
                    {customer.email || "—"}
                  </td>



                  <td className="px-6 py-4 text-slate-600">
                    {customer.phone || "—"}
                  </td>



                  <td className="px-6 py-4">


                    <div className="flex flex-wrap justify-center gap-2">


                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        View
                      </Link>



                      <Link
                        href={`/admin/customers/${customer.id}/edit`}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100"
                      >
                        Edit
                      </Link>



                      {customer.status === "Archived" && (
                        <RestoreCustomerButton
                          customerId={customer.id}
                        />
                      )}


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
