"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

interface Job {
  id: string;
  job_number: string | null;
  title: string;
  status: string;
  priority: string;
  technician: string | null;
  scheduled_date: string | null;
  customer: {
    first_name: string;
    last_name: string;
  } | null;
}

function getStatusColor(status: string) {
  switch (status) {
    case "Scheduled":
      return "bg-blue-100 text-blue-700";

    case "In Progress":
      return "bg-amber-100 text-amber-700";

    case "Completed":
      return "bg-green-100 text-green-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "Low":
      return "bg-slate-100 text-slate-700";

    case "Normal":
      return "bg-blue-100 text-blue-700";

    case "High":
      return "bg-orange-100 text-orange-700";

    case "Urgent":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function JobsPage() {
  const supabase = createClient();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  async function loadJobs() {
    setLoading(true);

    const { data, error } = await supabase
      .from("jobs")
      .select(`
        id,
        job_number,
        title,
        status,
        priority,
        technician,
        scheduled_date,
        customer:customers(
          first_name,
          last_name
        )
      `)
      .order("scheduled_date", {
        ascending: true,
      });

    if (error) {
      console.error(error);
      setError(error.message);
    } else {
      const formatted: Job[] =
        (data ?? []).map((job: any) => ({
          ...job,
          customer: Array.isArray(job.customer)
            ? job.customer[0] ?? null
            : job.customer,
        }));

      setJobs(formatted);
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.job_number?.toLowerCase().includes(search.toLowerCase()) ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        `${job.customer?.first_name ?? ""} ${job.customer?.last_name ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        job.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        job.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [jobs, search, statusFilter, priorityFilter]);

  const totalJobs = jobs.length;

  const scheduledJobs =
    jobs.filter(
      (j) => j.status === "Scheduled"
    ).length;

  const inProgressJobs =
    jobs.filter(
      (j) => j.status === "In Progress"
    ).length;

  const completedJobs =
    jobs.filter(
      (j) => j.status === "Completed"
    ).length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">

      {/* Header */}

      <div className="mb-8 flex flex-col gap-6 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Jobs
          </h1>

          <p className="mt-2 text-base text-slate-500">
            Manage work orders, technicians, and job scheduling.
          </p>

        </div>

        <Link
          href="/admin/jobs/new"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          + New Job
        </Link>

      </div>

      {/* Statistics */}

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Jobs
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {totalJobs}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Scheduled
          </p>

          <h2 className="mt-3 text-3xl font-bold text-blue-600">
            {scheduledJobs}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            In Progress
          </p>

          <h2 className="mt-3 text-3xl font-bold text-amber-600">
            {inProgressJobs}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Completed
          </p>

          <h2 className="mt-3 text-3xl font-bold text-green-600">
            {completedJobs}
          </h2>
        </div>

      </div>
            {/* Search & Filters */}

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="grid gap-4 lg:grid-cols-3">

          <input
            type="text"
            placeholder="Search by Job #, customer or title..."
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
            <option>Scheduled</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
          >
            <option>All</option>
            <option>Low</option>
            <option>Normal</option>
            <option>High</option>
            <option>Urgent</option>
          </select>

        </div>

      </div>

      {/* Jobs Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {loading ? (

          <div className="p-12 text-center text-slate-500">
            Loading jobs...
          </div>

        ) : error ? (

          <div className="p-12 text-center text-red-600">
            {error}
          </div>

        ) : filteredJobs.length === 0 ? (

          <div className="p-12 text-center">

            <div className="mb-4 text-5xl">
              🛠️
            </div>

            <h3 className="text-xl font-semibold">
              No Jobs Found
            </h3>

            <p className="mt-2 text-slate-500">
              Create your first work order to get started.
            </p>

            <Link
              href="/admin/jobs/new"
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Create Job
            </Link>

          </div>

        ) : (

          <table className="min-w-full">

            <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">

              <tr>

                <th className="px-6 py-3 text-left">
                  Job #
                </th>

                <th className="px-6 py-3 text-left">
                  Customer
                </th>

                <th className="px-6 py-3 text-left">
                  Title
                </th>

                <th className="px-6 py-3 text-left">
                  Status
                </th>

                <th className="px-6 py-3 text-left">
                  Priority
                </th>

                <th className="px-6 py-3 text-left">
                  Scheduled
                </th>

                <th className="px-6 py-3 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredJobs.map((job) => (

                <tr
                  key={job.id}
                  className="border-t border-slate-100 transition hover:bg-slate-50"
                >

                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {job.job_number ?? "Pending"}
                  </td>

                  <td className="px-6 py-4">
                    {job.customer
                      ? `${job.customer.first_name} ${job.customer.last_name}`
                      : "Unknown Customer"}
                  </td>

                  <td className="px-6 py-4">
                    {job.title}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>

                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getPriorityColor(
                        job.priority
                      )}`}
                    >
                      {job.priority}
                    </span>

                  </td>

                  <td className="px-6 py-4">

                    {job.scheduled_date
                      ? new Date(
                          job.scheduled_date
                        ).toLocaleDateString()
                      : "-"}

                  </td>

                  <td className="px-6 py-4">

                    <div className="flex justify-center gap-2">

                      <Link
                        href={`/admin/jobs/${job.id}`}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm transition hover:bg-slate-100"
                      >
                        View
                      </Link>

                      <Link
                        href={`/admin/jobs/${job.id}/edit`}
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