"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import EstimateForm, {
  EstimateFormValues,
} from "@/components/admin/EstimateForm.old";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
}

export default function NewEstimatePage() {
  const router = useRouter();
  const supabase = createClient();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      console.log("Loading customers...");

      const { data, error } = await supabase
        .from("customers")
        .select("id, first_name, last_name")
        .order("first_name");

      console.log("Customers:", data);
      console.log("Customer Error:", error);

      if (error) {
        setError(error.message);
      } else {
        setCustomers(data ?? []);
      }

      setPageLoading(false);
    }

    loadCustomers();
  }, [supabase]);

  async function handleSubmit(values: EstimateFormValues) {
    alert("handleSubmit started");

    console.log("VALUES:", values);

    if (!values.customer_id) {
      alert("No customer selected");
      setError("Please select a customer.");
      return;
    }

    setLoading(true);
    setError("");

    alert("About to insert into Supabase");

    const result = await supabase
      .from("estimates")
      .insert({
        customer_id: values.customer_id,
        status: "Draft",
        notes: values.notes,
      });

    console.log("Insert Result:", result);

    alert("Insert completed");

    setLoading(false);

    if (result.error) {
      alert(result.error.message);
      setError(result.error.message);
      return;
    }

    alert("Redirecting");

    router.push("/admin/estimates");
    router.refresh();
  }

  if (pageLoading) {
    return (
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          New Estimate
        </h1>

        <p className="mt-2 text-slate-500">
          Create a new estimate for a customer.
        </p>
      </div>

      <div className="rounded-xl bg-white p-8 shadow">
        <EstimateForm
          customers={customers}
          initialValues={{
            customer_id: "",
            notes: "",
          }}
          submitText="Save Estimate"
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}