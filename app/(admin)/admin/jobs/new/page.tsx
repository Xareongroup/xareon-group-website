"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { getNextDocumentNumber } from "@/lib/documentNumbers";

import JobForm, {
  JobFormValues,
} from "@/components/admin/JobForm";

interface Estimate {
  id: string;
  estimate_number: string;
}

interface CustomerOption {
  id: string;
  name: string;
}

interface EmployeeOption {
  id: string;
  full_name: string;
}

export default function NewJobPage() {
  const router = useRouter();
  const supabase = createClient();

  const [customers, setCustomers] =
    useState<CustomerOption[]>([]);

  const [estimates, setEstimates] =
    useState<Estimate[]>([]);

  const [employees, setEmployees] =
    useState<EmployeeOption[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadData() {
      setPageLoading(true);

      const [
        customersResult,
        estimatesResult,
        employeesResult,
      ] = await Promise.all([
        supabase
          .from("customers")
          .select("id, first_name, last_name")
          .order("first_name"),

        supabase
          .from("estimates")
          .select("id, estimate_number")
          .order("estimate_number"),

        supabase
          .from("employees")
          .select("id, first_name, last_name")
          .eq("status", "Active")
          .order("first_name"),
      ]);

      if (customersResult.error) {
        setError(customersResult.error.message);
      } else {
        setCustomers(
          (customersResult.data ?? []).map(
            (customer) => ({
              id: customer.id,
              name: `${customer.first_name} ${customer.last_name}`,
            })
          )
        );
      }

      if (estimatesResult.error) {
        setError(estimatesResult.error.message);
      } else {
        setEstimates(estimatesResult.data ?? []);
      }

      if (employeesResult.error) {
        setError(employeesResult.error.message);
      } else {
        setEmployees(
  (employeesResult.data ?? []).map(
    (employee) => ({
      id: employee.id,
      full_name: `${employee.first_name} ${employee.last_name}`,
    })
  )
);
      }

      setPageLoading(false);
    }

    void loadData();
  }, [supabase]);

  async function handleSubmit(
    values: JobFormValues
  ) {
    setLoading(true);
    setError("");

    try {
      const jobNumber =
        await getNextDocumentNumber(
          supabase,
          "job"
        );

      const { error } =
        await supabase
          .from("jobs")
          .insert({
            job_number: jobNumber,
            customer_id: values.customer_id,
            estimate_id:
              values.estimate_id || null,
            title: values.title,
            description: values.description,
            status: values.status,
            priority: values.priority,
            scheduled_date:
  values.scheduled_date || null,
assigned_employee_id:
  values.assigned_employee_id || null,
service_address:
  values.service_address,
            customer_phone:
              values.customer_phone,
            notes: values.notes,
          });

      if (error) throw error;

      router.push("/admin/jobs");
      router.refresh();
    } catch (err: any) {
      console.error(err);

      setError(
        err?.message ??
          "Unable to create job."
      );
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <h2 className="text-lg font-semibold">
            Loading...
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Fetching data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Create Job
        </h1>

        <p className="mt-2 text-slate-600">
          Create a new work order and assign it to a customer.
        </p>
      </div>

      <JobForm
        title="New Job"
        description="Complete the information below to create a new work order."
        submitText="Create Job"
        initialValues={{}}
        customers={customers}
        estimates={estimates}
        employees={employees}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
      />
    </div>
  );
}