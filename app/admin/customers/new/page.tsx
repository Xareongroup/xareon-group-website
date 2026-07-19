"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
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

    const { error } = await supabase.from("customers").insert({
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone: values.phone,
      address: values.address,
      notes: values.notes,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/admin/customers");
    router.refresh();
  }

  return (
    <CustomerForm
      title="Add New Customer"
      description="Create a new customer profile for XAREON Group."
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