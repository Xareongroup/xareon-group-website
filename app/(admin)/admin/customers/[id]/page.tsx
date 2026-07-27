import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Hammer,
  Receipt,
  ScrollText,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import PageHeader from "@/components/admin/PageHeader";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

import CustomerTimeline from "@/components/admin/customers/CustomerTimeline";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: customer,
    error,
  } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !customer) {
    notFound();
  }

  const [
    estimatesResponse,
    jobsResponse,
    invoicesResponse,
  ] = await Promise.all([
    supabase
      .from("estimates")
      .select("*")
      .eq("customer_id", id)
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("jobs")
      .select("*")
      .eq("customer_id", id)
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("invoices")
      .select("*")
      .eq("customer_id", id)
      .order("created_at", {
        ascending: false,
      }),
  ]);

  const estimates = estimatesResponse.data ?? [];
  const jobs = jobsResponse.data ?? [];
  const invoices = invoicesResponse.data ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">

      <PageHeader
        title={`${customer.first_name} ${customer.last_name}`}
        description="Customer profile and account history."
      />

      <Link href="/admin/customers">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">

              <Card
          title="Customer Information"
          className="lg:col-span-2"
        >

          <div className="grid gap-6 md:grid-cols-2">

            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-blue-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Full Name
                </p>

                <p className="font-semibold text-slate-900">
                  {customer.first_name} {customer.last_name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-blue-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="font-medium text-slate-900">
                  {customer.email || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-1 h-5 w-5 text-blue-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Phone
                </p>

                <p className="font-medium text-slate-900">
                  {customer.phone || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-blue-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Address
                </p>

                <p className="font-medium text-slate-900">
                  {customer.address || "—"}
                </p>

                {(customer.city ||
                  customer.state ||
                  customer.zip_code) && (

                  <p className="text-sm text-slate-500">
                    {customer.city}
                    {customer.city && customer.state ? ", " : ""}
                    {customer.state}{" "}
                    {customer.zip_code}
                  </p>

                )}

              </div>
            </div>

            <div className="md:col-span-2">

              <p className="mb-2 text-sm text-slate-500">
                Notes
              </p>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                  {customer.notes || "No customer notes available."}
                </p>

              </div>

            </div>

          </div>

        </Card>

                <Card title="Quick Actions">

          <div className="space-y-3">

            <Link
              href={`/admin/estimates/new?customer=${customer.id}`}
            >
              <Button className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Create Estimate
              </Button>
            </Link>

            <Link
              href={`/admin/jobs/new?customer=${customer.id}`}
            >
              <Button
                variant="secondary"
                className="w-full justify-start"
              >
                <Hammer className="mr-2 h-4 w-4" />
                Create Job
              </Button>
            </Link>

            <Link
              href={`/admin/invoices/new?customer=${customer.id}`}
            >
              <Button
                variant="success"
                className="w-full justify-start"
              >
                <Receipt className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full justify-start"
              disabled
            >
              <ScrollText className="mr-2 h-4 w-4" />
              Contracts Coming Soon
            </Button>

          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">

            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Customer Summary
            </h3>

            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <span className="text-slate-600">
                  Estimates
                </span>

                <Badge variant="secondary">
                  {estimates.length}
                </Badge>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-slate-600">
                  Jobs
                </span>

                <Badge variant="secondary">
                  {jobs.length}
                </Badge>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-slate-600">
                  Invoices
                </span>

                <Badge variant="secondary">
                  {invoices.length}
                </Badge>

              </div>

            </div>

          </div>

        </Card>

      </div>

             <div className="grid gap-6 xl:grid-cols-2">

        <Card
          title="Recent Estimates"
          description={`${estimates.length} estimate${estimates.length !== 1 ? "s" : ""}`}
        >

          {estimates.length === 0 ? (

            <p className="text-sm text-slate-500">
              No estimates have been created yet.
            </p>

          ) : (

            <div className="space-y-3">

              {estimates.slice(0, 5).map((estimate) => (

                <div
                  key={estimate.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition"
                >

                  <div>

                    <p className="font-semibold">
                      Estimate #{estimate.estimate_number}
                    </p>

                    <p className="text-sm text-slate-500">
                      Issued: {estimate.issue_date ?? "—"}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="font-semibold">
                      ${Number(estimate.total ?? 0).toFixed(2)}
                    </p>

                    <Badge variant="warning">
                      {estimate.status}
                    </Badge>

                  </div>

                </div>

              ))}

            </div>

          )}

        </Card>

        <Card
          title="Recent Jobs"
          description={`${jobs.length} job${jobs.length !== 1 ? "s" : ""}`}
        >

          {jobs.length === 0 ? (

            <p className="text-sm text-slate-500">
              No jobs have been created yet.
            </p>

          ) : (

            <div className="space-y-3">

              {jobs.slice(0, 5).map((job) => (

                <div
                  key={job.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition"
                >

                                 <div>

                    <p className="font-semibold">
                      {job.title || "Untitled Job"}
                    </p>

                    <p className="text-sm text-slate-500">
                      Job #{job.job_number || "—"}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Scheduled: {job.scheduled_date ?? "Not Scheduled"}
                    </p>

                  </div>

                  <Badge variant="info">
                    {job.status}
                  </Badge>

                </div>

              ))}

            </div>

          )}

        </Card>

      </div>

      <div className="grid gap-6">

        <Card
          title="Recent Invoices"
          description={`${invoices.length} invoice${invoices.length !== 1 ? "s" : ""}`}
        >

          {invoices.length === 0 ? (

            <p className="text-sm text-slate-500">
              No invoices have been created yet.
            </p>

          ) : (

            <div className="space-y-3">

              {invoices.slice(0, 5).map((invoice) => (

                <div
                  key={invoice.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition"
                >

                  <div>

                    <p className="font-semibold">
                      Invoice #{invoice.invoice_number}
                    </p>

                    <p className="text-sm text-slate-500">
                      Due: {invoice.due_date ?? "—"}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="font-semibold">
                      ${Number(invoice.total ?? 0).toFixed(2)}
                    </p>

                    <Badge variant="success">
                      {invoice.status}
                    </Badge>

                  </div>

                </div>

              ))}

            </div>

          )}

        </Card>

                  <Card
        title="Contracts"
        description="Linked through customer jobs"
      >

        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-12">

          <ScrollText className="mb-4 h-12 w-12 text-slate-400" />

          <h3 className="text-lg font-semibold text-slate-800">
            Contracts
          </h3>

          <p className="mt-2 max-w-md text-center text-sm text-slate-500">
            This customer's contracts will appear here after the
            Contracts module is connected to Jobs.
          </p>
          <Link
            href={`/admin/contracts/new?customer=${customer.id}`}
            className="mt-6"
          >
            <Button variant="outline">
              <ScrollText className="mr-2 h-4 w-4" />
              Create Contract
            </Button>
          </Link>

        </div>

            </Card>

      </div>

      {/* Customer Activity Timeline */}

      <div className="mt-8">
        <CustomerTimeline />
      </div>

    </div>

  );
}