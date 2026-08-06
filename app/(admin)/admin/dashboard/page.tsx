import Link from "next/link";

import {
  DollarSign,
  Wallet,
  TrendingUp,
  Briefcase,
  Users,
  FileText,
  UserPlus,
  ClipboardList,
  Hammer,
  Receipt,
  CreditCard,
} from "lucide-react";

import Card from "@/components/ui/Card";
import DashboardGrid from "@/components/admin/dashboard/DashboardGrid";
import StatCard from "@/components/admin/dashboard/StatCard";
import RevenueChart from "@/components/admin/dashboard/RevenueChart";
import RecentActivity from "@/components/admin/dashboard/RecentActivity";
import UpcomingJobs from "@/components/admin/dashboard/UpcomingJobs";

import { getDashboardStats } from "@/lib/dashboard/getDashboardStats";
import { getDashboardActivity } from "@/lib/dashboard/getDashboardActivity";

import { formatCurrency } from "@/lib/utils/currency";
import { adminSupabase } from "@/lib/supabase/admin";

export default async function AdminDashboard() {
  const [stats, activity] = await Promise.all([
    getDashboardStats(),
    getDashboardActivity(),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const weekday = new Date(`${today}T12:00:00`).getDay();
  const [todayJobsResult, availabilityResult, upcomingResult] = await Promise.all([
    adminSupabase.from("jobs").select("id,status,assigned_employee_id,job_number,title,start_time,scheduled_date,employee:employees(first_name,last_name)").eq("scheduled_date", today).neq("status", "Cancelled"),
    adminSupabase.from("employee_availability").select("employee_id,is_available,employee:employees(first_name,last_name,status)").eq("weekday", weekday).eq("is_available", true),
    adminSupabase.from("jobs").select("id,job_number,title,scheduled_date,start_time,employee:employees(first_name,last_name)").gte("scheduled_date", today).neq("status", "Cancelled").order("scheduled_date").order("start_time").limit(5),
  ]);
  const todayJobs = todayJobsResult.data ?? [];
  const busyEmployeeIds = new Set(todayJobs.map((job) => job.assigned_employee_id).filter(Boolean));
  const availableTechnicians = (availabilityResult.data ?? []).filter((row) => row.employee && !busyEmployeeIds.has(row.employee_id));
  const upcomingDispatchJobs = upcomingResult.data ?? [];

  const upcomingJobs = activity.upcomingJobs.map((job: any) => ({
    id: job.id,
    customer: job.title,
    service: job.status,
    scheduledFor: job.scheduled_date
      ? new Date(job.scheduled_date).toLocaleDateString()
      : "Not Scheduled",
  }));

  const activities = [
    ...activity.recentCustomers.map((customer: any) => ({
      id: `customer-${customer.id}`,
      type: "customer" as const,
      title: `${customer.first_name} ${customer.last_name}`,
      description: "New customer added",
      time: customer.created_at
        ? new Date(customer.created_at).toLocaleDateString()
        : "",
    })),

    ...activity.recentInvoices.map((invoice: any) => ({
      id: `invoice-${invoice.id}`,
      type: "invoice" as const,
      title: invoice.invoice_number,
      description: invoice.status,
      time: invoice.created_at
        ? new Date(invoice.created_at).toLocaleDateString()
        : "",
    })),

    ...activity.recentPayments.map((payment: any) => ({
      id: `payment-${payment.id}`,
      type: "payment" as const,
      title: formatCurrency(payment.amount),
      description: payment.payment_method,
      time: payment.payment_date
        ? new Date(payment.payment_date).toLocaleDateString()
        : "",
    })),
  ];

  return (
    <div className="space-y-10">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Welcome back to XAREON CRM.
        </p>

      </div>

      <DashboardGrid

        stats={

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            <StatCard
  title="Total Revenue"
  value={formatCurrency(stats.totalRevenue)}
  icon={DollarSign}
  color="green"
  change="Business Lifetime"
  href="/admin/reports?range=365d"
/>

            <StatCard
  title="Outstanding Balance"
  value={formatCurrency(stats.outstandingBalance)}
  icon={Wallet}
  color="red"
  change="Awaiting payment"
  changeType="negative"
  href="/admin/invoices?status=Sent"
/>

            <StatCard
  title="Paid This Month"
  value={formatCurrency(stats.paidThisMonth)}
  icon={TrendingUp}
  color="blue"
  change="Current month"
  changeType="positive"
  href="/admin/payments?range=month"
/>

            <StatCard
  title="Active Jobs"
  value={stats.activeJobs}
  icon={Briefcase}
  color="orange"
  change="In progress"
  href="/admin/jobs?status=In%20Progress"
/>

            <StatCard
  title="Customers"
  value={stats.customerCount}
  icon={Users}
  color="blue"
  change="Total customers"
  href="/admin/customers"
/>

            <StatCard
  title="Pending Estimates"
  value={stats.pendingEstimates}
  icon={FileText}
  color="purple"
  change="Waiting approval"
  href="/admin/estimates?status=Draft"
/>

          </div>

        }

        main={

          <div className="space-y-6">

            <Card title="Today’s Operations" description="Live dispatch status for today."><div className="grid gap-3 sm:grid-cols-2"><div><p className="text-sm text-slate-500">Jobs today</p><p className="text-2xl font-bold">{todayJobs.length}</p></div><div><p className="text-sm text-slate-500">Completed</p><p className="text-2xl font-bold text-emerald-600">{todayJobs.filter((job) => job.status === "Completed").length}</p></div><div><p className="text-sm text-slate-500">In progress</p><p className="text-2xl font-bold text-amber-600">{todayJobs.filter((job) => job.status === "In Progress").length}</p></div><div><p className="text-sm text-slate-500">Unassigned</p><p className="text-2xl font-bold text-red-600">{todayJobs.filter((job) => !job.assigned_employee_id).length}</p></div></div><div className="mt-5 border-t pt-4"><p className="text-sm font-semibold">Available technicians</p><p className="mt-1 text-sm text-slate-600">{availableTechnicians.length ? availableTechnicians.map((row) => { const employee = Array.isArray(row.employee) ? row.employee[0] : row.employee; return employee ? `${employee.first_name} ${employee.last_name}` : null; }).filter(Boolean).join(" · ") : "No availability records for today."}</p></div></Card>

            <RevenueChart
  monthlyRevenue={stats.monthlyRevenue}
  monthlyInvoices={stats.monthlyInvoices}
  outstandingBalance={stats.outstandingBalance}
  revenueData={stats.revenueData}
/>

            <Card
              title="Recent Payments"
              description="Latest recorded payments"
            >

              <div className="space-y-4">

                {activity.recentPayments.length === 0 ? (

                  <p className="text-slate-500">
                    No recent payments.
                  </p>

                ) : (

                  activity.recentPayments.map((payment: any) => {

                    const customer =
                      Array.isArray(payment.invoice?.customer)
                        ? payment.invoice.customer[0]
                        : payment.invoice?.customer;

                    return (

                      <div
                        key={payment.id}
                        className="flex items-center justify-between border-b pb-3 last:border-none"
                      >

                        <div>

                          <p className="font-medium">

                            {customer
                              ? `${customer.first_name} ${customer.last_name}`
                              : "Unknown"}

                          </p>

                          <p className="text-sm text-slate-500">
                            {payment.payment_method}
                          </p>

                        </div>

                        <p className="font-semibold text-emerald-600">
                          {formatCurrency(payment.amount)}
                        </p>

                      </div>

                    );

                  })

                )}

              </div>

            </Card>

            <Card
              title="Recent Invoices"
              description="Recently created invoices"
            >
                            <div className="space-y-4">

                {activity.recentInvoices.length === 0 ? (

                  <p className="text-slate-500">
                    No invoices.
                  </p>

                ) : (

                  activity.recentInvoices.map((invoice: any) => (

                    <div
                      key={invoice.id}
                      className="flex items-center justify-between border-b pb-3 last:border-none"
                    >

                      <div>

                        <p className="font-medium">
                          {invoice.invoice_number}
                        </p>

                        <p className="text-sm text-slate-500">
                          {invoice.status}
                        </p>

                      </div>

                      <p className="font-semibold">
                        {formatCurrency(invoice.total)}
                      </p>

                    </div>

                  ))

                )}

              </div>

            </Card>

          </div>

        }

        side={

          <div className="space-y-6">

            <UpcomingJobs
              jobs={upcomingJobs}
            />

            <Card title="Upcoming Schedule" description="Next scheduled jobs.">{upcomingDispatchJobs.length ? <div className="space-y-3">{upcomingDispatchJobs.map((job) => { const employee = Array.isArray(job.employee) ? job.employee[0] : job.employee; return <Link key={job.id} href={`/admin/jobs/${job.id}`} className="block rounded-lg border p-3 hover:bg-slate-50"><p className="font-medium">{job.job_number} · {job.title}</p><p className="text-sm text-slate-500">{job.scheduled_date} {job.start_time?.slice(0, 5) ?? ""} · {employee ? `${employee.first_name} ${employee.last_name}` : "Unassigned"}</p></Link>; })}</div> : <p className="text-sm text-slate-500">No upcoming jobs.</p>}</Card>

            <RecentActivity
              activities={activities}
            />

          </div>

        }

        bottom={
  <Card
    title="Quick Actions"
    description="Create and manage your business faster."
  >
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">

      <Link
        href="/admin/customers/new"
        className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
      >
        <div className="mb-4 inline-flex rounded-xl bg-blue-100 p-3 text-blue-600">
          <UserPlus className="h-6 w-6" />
        </div>

        <h3 className="font-semibold text-slate-900">
          New Customer
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Add a new customer profile.
        </p>
      </Link>

      <Link
        href="/admin/estimates/new"
        className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500 hover:shadow-lg"
      >
        <div className="mb-4 inline-flex rounded-xl bg-indigo-100 p-3 text-indigo-600">
          <ClipboardList className="h-6 w-6" />
        </div>

        <h3 className="font-semibold text-slate-900">
          New Estimate
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Create a quote for a customer.
        </p>
      </Link>

      <Link
        href="/admin/jobs/new"
        className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500 hover:shadow-lg"
      >
        <div className="mb-4 inline-flex rounded-xl bg-amber-100 p-3 text-amber-600">
          <Hammer className="h-6 w-6" />
        </div>

        <h3 className="font-semibold text-slate-900">
          New Job
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Schedule a new service job.
        </p>
      </Link>

      <Link
        href="/admin/invoices/new"
        className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg"
      >
        <div className="mb-4 inline-flex rounded-xl bg-emerald-100 p-3 text-emerald-600">
          <Receipt className="h-6 w-6" />
        </div>

        <h3 className="font-semibold text-slate-900">
          New Invoice
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Generate an invoice instantly.
        </p>
      </Link>

      <Link
        href="/admin/payments"
        className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-500 hover:shadow-lg"
      >
        <div className="mb-4 inline-flex rounded-xl bg-green-100 p-3 text-green-600">
          <CreditCard className="h-6 w-6" />
        </div>

        <h3 className="font-semibold text-slate-900">
          Payments
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          View and manage payments.
        </p>
      </Link>

    </div>
  </Card>
}

      />

    </div>

  );
}
