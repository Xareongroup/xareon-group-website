"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import CustomerForm, {
  CustomerFormValues,
} from "@/components/admin/CustomerForm";

export default function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [customer, setCustomer] = useState<CustomerFormValues>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    async function loadCustomer() {
      const { id } = await params;

      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setError("Customer not found.");
        setLoading(false);
        return;
      }

      setCustomer({
        first_name: data.first_name ?? "",
        last_name: data.last_name ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        address: data.address ?? "",
        notes: data.notes ?? "",
      });

      setLoading(false);
    }

    loadCustomer();
  }, [params, supabase]);

  async function handleSubmit(values: CustomerFormValues) {
    const { id } = await params;

    setSaving(true);
    setError("");

    const { error } = await supabase
      .from("customers")
      .update({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        notes: values.notes,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push(`/admin/customers/${id}`);
    router.refresh();
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">
        Loading customer...
      </div>
    );
  }

  return (
    <CustomerForm
      title="Edit Customer"
      description="Update customer information."
      submitText="Update Customer"
      initialValues={customer}
      loading={saving}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}