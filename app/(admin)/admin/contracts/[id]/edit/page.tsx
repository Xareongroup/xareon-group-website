"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import ContractForm, {
  ContractFormValues,
  CustomerOption,
  EstimateOption,
  JobOption,
} from "@/components/admin/ContractForm";

export default function EditContractPage() {

  const params = useParams();

  const router = useRouter();

  const supabase = createClient();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [customers, setCustomers] =
    useState<CustomerOption[]>([]);

  const [estimates, setEstimates] =
    useState<EstimateOption[]>([]);

  const [jobs, setJobs] =
    useState<JobOption[]>([]);

  const [values, setValues] =
    useState<ContractFormValues | null>(null);

  async function loadData() {

    const [

      contractResult,

      customersResult,

      estimatesResult,

      jobsResult,

    ] = await Promise.all([

      supabase

        .from("contracts")

        .select("*")

        .eq("id", params.id)

        .single(),

      supabase

        .from("customers")

        .select("id, first_name, last_name")

        .order("first_name"),

      supabase

        .from("estimates")

        .select("id, estimate_number")

        .order("estimate_number"),

      supabase

        .from("jobs")

        .select("id, job_number")

        .order("job_number"),

    ]);

    if (customersResult.data)
      setCustomers(customersResult.data);

    if (estimatesResult.data)
      setEstimates(estimatesResult.data);

    if (jobsResult.data)
      setJobs(jobsResult.data);

    if (contractResult.data) {

      setValues({

        title:
          contractResult.data.title ?? "",

        customer_id:
          contractResult.data.customer_id ?? "",

        estimate_id:
          contractResult.data.estimate_id ?? "",

        job_id:
          contractResult.data.job_id ?? "",

        status:
          contractResult.data.status ?? "Draft",

        scope_of_work:
          contractResult.data.scope_of_work ?? "",

        payment_terms:
          contractResult.data.payment_terms ?? "",

        warranty:
          contractResult.data.warranty ?? "",

        terms:
          contractResult.data.terms ?? "",

        notes:
          contractResult.data.notes ?? "",

      });

    }

    setLoading(false);

  }

  useEffect(() => {

    void loadData();

  }, []);
    async function handleSubmit(
    updatedValues: ContractFormValues
  ) {

    setSaving(true);

    setError("");

    const { error } = await supabase

      .from("contracts")

      .update({

        title: updatedValues.title,

        customer_id:
          updatedValues.customer_id || null,

        estimate_id:
          updatedValues.estimate_id || null,

        job_id:
          updatedValues.job_id || null,

        status:
          updatedValues.status,

        scope_of_work:
          updatedValues.scope_of_work,

        payment_terms:
          updatedValues.payment_terms,

        warranty:
          updatedValues.warranty,

        notes:
          updatedValues.notes,

      })

      .eq("id", params.id);

    setSaving(false);

    if (error) {

      setError(error.message);

      return;

    }

    router.push(`/admin/contracts/${params.id}`);

    router.refresh();

  }

  if (loading || !values) {

    return (

      <div className="flex h-64 items-center justify-center">

        <div className="text-slate-500">

          Loading contract...

        </div>

      </div>

    );

  }

  return (

    <ContractForm

      title="Edit Contract"

      description="Update this customer contract."

      submitText="Save Changes"

      customers={customers}

      estimates={estimates}

      jobs={jobs}

      initialValues={values}

      loading={saving}

      error={error}

      onSubmit={handleSubmit}

    />

  );

}
