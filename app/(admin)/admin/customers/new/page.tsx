"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { getNextDocumentNumber } from "@/lib/documentNumbers";

import CustomerForm, {
  CustomerFormValues,
} from "@/components/admin/CustomerForm";

export default function NewCustomerPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(values: CustomerFormValues) {
    setLoading(true);
    setError("");

    try {
      // Generate the next customer number
      const customerNumber = await getNextDocumentNumber(
        supabase,
        "customer"
      );

      console.log("Generated Customer Number:", customerNumber);

      // Insert the customer
      const { data, error } = await supabase
        .from("customers")
        .insert({
          customer_number: customerNumber,

          first_name: values.first_name,
          last_name: values.last_name,

          email: values.email || null,
          phone: values.phone || null,

          address: values.address || null,

          notes: values.notes || null,
        })
        .select();

      console.log("Insert Result:", data);
      console.log("Insert Error:", error);

      if (error) {
        throw error;
      }

      router.push("/admin/customers");
      router.refresh();
    } catch (err: any) {
      console.error("Create Customer Error:", err);

      setError(
        err?.message ||
          err?.details ||
          err?.hint ||
          JSON.stringify(err, null, 2)
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <CustomerForm
      title="New Customer"
      description="Create a new customer profile."
      submitText="Save Customer"
      loading={loading}
      error={error}
      initialValues={{
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
      }}
      onSubmit={handleSubmit}
    />
  );
}