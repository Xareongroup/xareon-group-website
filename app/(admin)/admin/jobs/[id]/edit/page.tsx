"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import JobForm, {
  JobFormValues,
} from "@/components/admin/JobForm";

interface CustomerOption {
  id: string;
  first_name: string;
  last_name: string;
}

interface EstimateOption {
  id: string;
  estimate_number: number;
}

interface EmployeeOption {
  id: string;
  full_name: string;
}

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();

  const router = useRouter();
  const supabase = createClient();

  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [estimates, setEstimates] = useState<EstimateOption[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);

  const [initialValues, setInitialValues] =
    useState<Partial<JobFormValues>>();

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      setPageLoading(true);

      const [
        customersResult,
        estimatesResult,
        employeesResult,
        jobResult,
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
          .order("first_name"),

        supabase
          .from("jobs")
          .select("*")
          .eq("id", id)
          .single(),
      ]);

      if (customersResult.error) {
        setError(customersResult.error.message);
        setPageLoading(false);
        return;
      }

      if (estimatesResult.error) {
        setError(estimatesResult.error.message);
        setPageLoading(false);
        return;
      }

      if (employeesResult.error) {
        setError(employeesResult.error.message);
        setPageLoading(false);
        return;
      }

      if (jobResult.error) {
        setError(jobResult.error.message);
        setPageLoading(false);
        return;
      }

      setCustomers(customersResult.data ?? []);

      setEstimates(estimatesResult.data ?? []);

      setEmployees(
        (employeesResult.data ?? []).map((employee) => ({
          id: employee.id,
          full_name: `${employee.first_name} ${employee.last_name}`,
        }))
      );

      setInitialValues({
        job_number: jobResult.data.job_number ?? "",
        customer_id: jobResult.data.customer_id ?? "",
        estimate_id: jobResult.data.estimate_id ?? "",
        title: jobResult.data.title ?? "",
        description: jobResult.data.description ?? "",
        status: jobResult.data.status ?? "Scheduled",
        priority: jobResult.data.priority ?? "Normal",
        scheduled_date: jobResult.data.scheduled_date ?? "",
        assigned_employee_id:
          jobResult.data.assigned_employee_id ?? "",
        service_address: jobResult.data.service_address ?? "",
        customer_phone: jobResult.data.customer_phone ?? "",
        notes: jobResult.data.notes ?? "",
      });

      setPageLoading(false);
    }

    void loadData();
  }, [id, supabase]);

  async function handleSubmit(values: JobFormValues) {
    setLoading(true);
    setError("");

    const { error } = await supabase
      .from("jobs")
      .update({
        customer_id: values.customer_id,
        estimate_id: values.estimate_id || null,
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        scheduled_date: values.scheduled_date || null,
        assigned_employee_id: values.assigned_employee_id,
        service_address: values.service_address,
        customer_phone: values.customer_phone,
        notes: values.notes,
      })
      .eq("id", id);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/admin/jobs");
    router.refresh();
  }

  if (pageLoading || !initialValues) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <JobForm
        title="Edit Job"
        description="Update this work order."
        submitText="Save Changes"
        initialValues={initialValues}
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
