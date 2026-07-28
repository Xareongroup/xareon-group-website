"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Job {
  id: string;
  job_number: string;
  title: string;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
}

export default function JobSchedulerForm() {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [form, setForm] = useState({
    job_id: "",
    assigned_employee_id: "",
    scheduled_date: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    try {
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("id, job_number, title")
        .order("created_at", { ascending: false });

      if (jobsError) throw jobsError;

      const { data: employeeData, error: employeeError } =
        await supabase
          .from("employees")
          .select("id, first_name, last_name")
          .order("first_name");

      if (employeeError) throw employeeError;

      setJobs(jobsData ?? []);
      setEmployees(employeeData ?? []);
    } catch (err) {
      console.error(err);

      setMessage({
        type: "error",
        text: "Unable to load jobs and employees.",
      });
    }
  }

  function update(
    field: keyof typeof form,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setMessage(null);

    if (
      !form.job_id ||
      !form.assigned_employee_id ||
      !form.scheduled_date ||
      !form.start_time
    ) {
      setMessage({
        type: "error",
        text: "Please complete all required fields.",
      });
      return;
    }

    if (
      form.end_time &&
      form.end_time <= form.start_time
    ) {
      setMessage({
        type: "error",
        text: "End time must be after the start time.",
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("jobs")
        .update({
          assigned_employee_id:
            form.assigned_employee_id,
          scheduled_date:
            form.scheduled_date,
          start_time:
            form.start_time,
          end_time:
            form.end_time || null,
          status: "Scheduled",
        })
        .eq("id", form.job_id);

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Job scheduled successfully.",
      });

      setForm({
        job_id: "",
        assigned_employee_id: "",
        scheduled_date: "",
        start_time: "",
        end_time: "",
      });

      await loadData();

      window.dispatchEvent(
        new CustomEvent("jobScheduled")
      );
    } catch (err) {
      console.error(err);

      setMessage({
        type: "error",
        text: "Unable to schedule the job.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold">
        Schedule Job
      </h2>

      {message && (
        <div
          className={`rounded-xl p-3 text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <select
        className="w-full rounded-xl border p-3"
        value={form.job_id}
        onChange={(e) =>
          update("job_id", e.target.value)
        }
        required
      >
        <option value="">
          Select Job
        </option>

        {jobs.map((job) => (
          <option
            key={job.id}
            value={job.id}
          >
            {job.job_number} — {job.title}
          </option>
        ))}
      </select>

      <select
        className="w-full rounded-xl border p-3"
        value={form.assigned_employee_id}
        onChange={(e) =>
          update(
            "assigned_employee_id",
            e.target.value
          )
        }
        required
      >
        <option value="">
          Assign Employee
        </option>

        {employees.map((employee) => (
          <option
            key={employee.id}
            value={employee.id}
          >
            {employee.first_name}{" "}
            {employee.last_name}
          </option>
        ))}
      </select>

      <input
        type="date"
        className="w-full rounded-xl border p-3"
        value={form.scheduled_date}
        onChange={(e) =>
          update(
            "scheduled_date",
            e.target.value
          )
        }
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="time"
          className="rounded-xl border p-3"
          value={form.start_time}
          onChange={(e) =>
            update(
              "start_time",
              e.target.value
            )
          }
          required
        />

        <input
          type="time"
          className="rounded-xl border p-3"
          value={form.end_time}
          onChange={(e) =>
            update(
              "end_time",
              e.target.value
            )
          }
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Scheduling..."
          : "Schedule Job"}
      </button>
    </form>
  );
}