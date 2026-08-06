"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ConvertLeadButton({ leadId, convertedCustomerId }: { leadId: string; convertedCustomerId: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function convert() {
    if (!window.confirm("Convert this lead into a customer?")) return;
    setLoading(true);
    let response = await fetch(`/api/leads/${leadId}/convert`, { method: "POST" });
    let result = await response.json();
    if (response.status === 409 && result.code === "existing_customer") {
      const customerName = `${result.customer.first_name} ${result.customer.last_name}`.trim();
      if (!window.confirm(`Existing customer found: ${customerName}. Link this lead to that customer instead?`)) {
        setLoading(false);
        return;
      }
      response = await fetch(`/api/leads/${leadId}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkExistingCustomer: true }),
      });
      result = await response.json();
    }
    setLoading(false);
    if (!response.ok) return window.alert(result.error ?? "Unable to convert lead.");
    router.push(`/admin/customers/${result.customerId}`);
    router.refresh();
  }

  if (convertedCustomerId) return <a href={`/admin/customers/${convertedCustomerId}`} className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white">View Customer</a>;
  return <button type="button" onClick={convert} disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60">{loading ? "Converting…" : "Convert Lead"}</button>;
}
