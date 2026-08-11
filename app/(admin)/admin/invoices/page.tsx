"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils/currency";

import PageHeader from "@/components/admin/PageHeader";
import StatsCard from "@/components/admin/StatsCard";
import SearchBar from "@/components/admin/SearchBar";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import DataTable from "@/components/admin/DataTable";
import MobileRecordCard from "@/components/admin/MobileRecordCard";
import DocumentDeleteButton from "@/components/documents/DocumentDeleteButton";

import {
  Receipt,
  CheckCircle,
  Clock,
} from "lucide-react";

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
      setLoading(false);
      return;
    }

    const formatted: Invoice[] =
      (data ?? []).map((invoice: any) => ({
        ...invoice,
        customer: Array.isArray(invoice.customer)
          ? invoice.customer[0] ?? null
          : invoice.customer,
      }));

    setInvoices(formatted);

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
      (invoice) => invoice.status === "Paid"
    ).length;

  const sentInvoices =
    invoices.filter(
      (invoice) => invoice.status === "Sent"
    ).length;

  const overdueInvoices =
    invoices.filter(
      (invoice) => invoice.status === "Overdue"
    ).length;

  return (

    <div className="mx-auto max-w-7xl px-6 py-8">

      <PageHeader
        title="Invoices"
        description="Manage invoices, payments, and billing."
        buttonText="New Invoice"
        buttonHref="/admin/invoices/new"
      />

      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatsCard
          title="Total Invoices"
          value={totalInvoices}
          color="blue"
          icon={
            <Receipt className="h-8 w-8 text-blue-600" />
          }
        />

        <StatsCard
          title="Paid"
          value={paidInvoices}
          color="green"
          icon={
            <CheckCircle className="h-8 w-8 text-green-600" />
          }
        />

        <StatsCard
          title="Sent"
          value={sentInvoices}
          color="blue"
          icon={
            <Receipt className="h-8 w-8 text-blue-600" />
          }
        />

        <StatsCard
          title="Overdue"
          value={overdueInvoices}
          color="red"
          icon={
            <Clock className="h-8 w-8 text-red-600" />
          }
        />

      </div>

      <SearchBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search invoice number or customer..."
        status={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={[
          "All",
          "Draft",
          "Sent",
          "Paid",
          "Overdue",
          "Cancelled",
        ]}
      />

      <DataTable
        loading={loading}
        error={error}
               isEmpty={filteredInvoices.length === 0}
        emptyState={
          <EmptyState
            icon={
              <Receipt className="mx-auto h-16 w-16 text-slate-400" />
            }
            title="No Invoices Found"
            description="Create your first invoice to get started."
            buttonText="Create Invoice"
            buttonHref="/admin/invoices/new"
          />
        }
        mobileCards={
          filteredInvoices.map((invoice) => (
            <MobileRecordCard
              key={invoice.id}
              title={invoice.invoice_number ?? "Pending invoice"}
              subtitle={invoice.customer ? `${invoice.customer.first_name} ${invoice.customer.last_name}` : "Unknown customer"}
              badge={<StatusBadge status={invoice.status} />}
              fields={[
                { label: "Issue date", value: invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : "Not issued" },
                { label: "Due date", value: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "Not set" },
                { label: "Total", value: formatCurrency(invoice.total ?? 0) },
              ]}
              actions={<><Link href={`/admin/invoices/${invoice.id}`} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white">View</Link><Link href={`/admin/invoices/${invoice.id}/edit`} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700">Edit</Link><DocumentDeleteButton kind="invoices" id={invoice.id} label="invoice" onDeleted={() => setInvoices((current) => current.filter((item) => item.id !== invoice.id))} /></>}
            />
          ))
        }
        headers={
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
        }
      >
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
              <StatusBadge
                status={invoice.status}
              />
            </td>

            <td className="px-6 py-4">
              {invoice.issue_date
                ? new Date(
                    invoice.issue_date
                  ).toLocaleDateString()
                : "-"}
            </td>

            <td className="px-6 py-4">
              {invoice.due_date
                ? new Date(
                    invoice.due_date
                  ).toLocaleDateString()
                : "-"}
            </td>

            <td className="px-6 py-4 text-right font-semibold">
              {formatCurrency(
                invoice.total ?? 0
              )}
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
                <DocumentDeleteButton kind="invoices" id={invoice.id} label="invoice" onDeleted={() => setInvoices((current) => current.filter((item) => item.id !== invoice.id))} />

              </div>
            </td>

          </tr>

        ))}

      </DataTable>

    </div>

  );
}
