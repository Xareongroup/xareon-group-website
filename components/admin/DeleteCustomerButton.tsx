"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function DeleteCustomerButton({
  customerId,
}: {
  customerId: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this customer?"
    );

    if (!confirmed) return;

    setLoading(true);

    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", customerId);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/admin/customers");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}