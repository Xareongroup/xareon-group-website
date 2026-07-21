"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import JobForm, {
  JobFormValues,
} from "@/components/admin/JobForm";

interface Estimate {
  id: string;
  estimate_number: string;
}

export default function NewJobPage() {
  const router = useRouter();
  const supabase = createClient();

  interface CustomerOption {
  id: string;
  name: string;
}

const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [error, setError] = useState("");

    useEffect(() => {
    async function loadData() {
      setPageLoading(true);

      const [
        customersResult,
        estimatesResult,
      ] = await Promise.all([

        supabase
          .from("customers")
          .select("id, first_name, last_name")
          .order("first_name"),

        supabase
          .from("estimates")
          .select("id, estimate_number")
          .order("estimate_number"),

      ]);

      if (customersResult.error) {
  setError(customersResult.error.message);
} else {
  const customerOptions =
    (customersResult.data ?? []).map((customer) => ({
      id: customer.id,
      name: `${customer.first_name} ${customer.last_name}`,
    }));

  setCustomers(customerOptions);
}

      if (estimatesResult.error) {
        setError(estimatesResult.error.message);
      } else {
        setEstimates(estimatesResult.data ?? []);
      }

      setPageLoading(false);
    }

    void loadData();
  }, [supabase]);

    async function handleSubmit(values: JobFormValues) {
    setLoading(true);
    setError("");

    const { data: jobNumber, error: numberError } =
      await supabase.rpc("generate_job_number");

    if (numberError || !jobNumber) {
      setLoading(false);
      setError(
        numberError?.message ??
          "Unable to generate a job number."
      );
      return;
    }

    const { error } = await supabase
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

        technician: values.technician,

        service_address:
          values.service_address,

        customer_phone:
          values.customer_phone,

        notes: values.notes,
      });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/admin/jobs");
    router.refresh();
  }

    if (pageLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Loading...
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Fetching customers and estimates...
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
  loading={loading}
  error={error}
  onSubmit={handleSubmit}
/>
    </div>
  );
}