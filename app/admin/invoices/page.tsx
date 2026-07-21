"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils/currency";

interface Invoice {
  id: string;
  invoice_number: string | null;
  status: string;
  issue_date: string | null;
  due_date: string | null;
  total: number | null;

  customer: {
    first_name: string;
    last_name: string;
  } | null;
}

function getStatusColor(status: string) {
  switch (status) {
    case "Draft":
      return "bg-slate-100 text-slate-700";

    case "Sent":
      return "bg-blue-100 text-blue-700";

    case "Paid":
      return "bg-green-100 text-green-700";

    case "Overdue":
      return "bg-red-100 text-red-700";

    case "Cancelled":
      return "bg-orange-100 text-orange-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function InvoicesPage() {
  const supabase = createClient();

  const [invoices, setInvoices] =
    useState<Invoice[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  async function loadInvoices() {
    setLoading(true);

    const { data, error } = await supabase
      .from("invoices")
      .select(`
        id,
        invoice_number,
        status,
        issue_date,
        due_date,
        total,
        customer:customers(
          first_name,
          last_name
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      setError(error.message);
    } else {

      const formatted: Invoice[] =
        (data ?? []).map((invoice: any) => ({
          ...invoice,
          customer: Array.isArray(invoice.customer)
            ? invoice.customer[0] ?? null
            : invoice.customer,
        }));

      setInvoices(formatted);
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadInvoices();
  }, []);

  const filteredInvoices =
    useMemo(() => {

      return invoices.filter((invoice) => {

        const matchesSearch =
          invoice.invoice_number
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||

          `${invoice.customer?.first_name ?? ""} ${invoice.customer?.last_name ?? ""}`
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesStatus =
          statusFilter === "All" ||
          invoice.status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );

      });

    }, [invoices, search, statusFilter]);

  const totalInvoices =
    invoices.length;

  const paidInvoices =
    invoices.filter(
      (i) => i.status === "Paid"
    ).length;

  const sentInvoices =
    invoices.filter(
      (i) => i.status === "Sent"
    ).length;

  const overdueInvoices =
    invoices.filter(
      (i) => i.status === "Overdue"
    ).length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">

      {/* Header */}

      <div className="mb-8 flex flex-col gap-6 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Invoices
          </h1>

          <p className="mt-2 text-base text-slate-500">
            Manage invoices, payments, and billing.
          </p>

        </div>

        <Link
          href="/admin/invoices/new"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          + New Invoice
        </Link>

      </div>

      {/* Statistics */}

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Invoices
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {totalInvoices}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Paid
          </p>

          <h2 className="mt-3 text-3xl font-bold text-green-600">
            {paidInvoices}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Sent
          </p>

          <h2 className="mt-3 text-3xl font-bold text-blue-600">
            {sentInvoices}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Overdue
          </p>

          <h2 className="mt-3 text-3xl font-bold text-red-600">
            {overdueInvoices}
          </h2>
        </div>

      </div>
            {/* Search & Filter */}

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="grid gap-4 lg:grid-cols-[1fr_240px]">

          <input
            type="text"
            placeholder="Search invoice number or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
          >
            <option>All</option>
            <option>Draft</option>
            <option>Sent</option>
            <option>Paid</option>
            <option>Overdue</option>
            <option>Cancelled</option>
          </select>

        </div>

      </div>

      {/* Invoice Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {loading ? (

          <div className="p-12 text-center text-slate-500">
            Loading invoices...
          </div>

        ) : error ? (

          <div className="p-12 text-center text-red-600">
            {error}
          </div>

        ) : filteredInvoices.length === 0 ? (

          <div className="p-12 text-center">

            <div className="mb-4 text-5xl">
              💳
            </div>

            <h3 className="text-xl font-semibold">
              No Invoices Found
            </h3>

            <p className="mt-2 text-slate-500">
              Create your first invoice to get started.
            </p>

            <Link
              href="/admin/invoices/new"
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Create Invoice
            </Link>

          </div>

        ) : (

          <table className="min-w-full">

            <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">

              <tr>

                <th className="px-6 py-3 text-left">
                  Invoice #
                </th>

                <th className="px-6 py-3 text-left">
                  Customer
                </th>

                <th className="px-6 py-3 text-left">
                  Status
                </th>

                <th className="px-6 py-3 text-left">
                  Issue Date
                </th>

                <th className="px-6 py-3 text-left">
                  Due Date
                </th>

                <th className="px-6 py-3 text-right">
                  Total
                </th>

                <th className="px-6 py-3 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredInvoices.map((invoice) => (

                <tr
                  key={invoice.id}
                  className="border-t border-slate-100 transition hover:bg-slate-50"
                >

                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {invoice.invoice_number ?? "Pending"}
                  </td>

                  <td className="px-6 py-4">

                    {invoice.customer
                      ? `${invoice.customer.first_name} ${invoice.customer.last_name}`
                      : "Unknown Customer"}

                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {invoice.status}
                    </span>

                  </td>

                  <td className="px-6 py-4">

                    {invoice.issue_date
                      ? new Date(invoice.issue_date).toLocaleDateString()
                      : "-"}

                  </td>

                  <td className="px-6 py-4">

                    {invoice.due_date
                      ? new Date(invoice.due_date).toLocaleDateString()
                      : "-"}

                  </td>

                  <td className="px-6 py-4 text-right font-semibold">

                    {formatCurrency(invoice.total ?? 0)}

                  </td>

                  <td className="px-6 py-4">

                    <div className="flex justify-center gap-2">

                      <Link
                        href={`/admin/invoices/${invoice.id}`}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm transition hover:bg-slate-100"
                      >
                        View
                      </Link>

                      <Link
                        href={`/admin/invoices/${invoice.id}/edit`}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm transition hover:bg-slate-100"
                      >
                        Edit
                      </Link>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}