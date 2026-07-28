"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { archiveCustomer } from "@/app/actions/customers";


interface Props {
  customerId: string;
}


export default function ArchiveCustomerButton({
  customerId,
}: Props) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);


  async function handleArchive() {

    const confirmed = window.confirm(
      "Archive this customer?\n\nCustomer history, invoices, jobs, and payments will be preserved."
    );


    if (!confirmed) {
      return;
    }


    setLoading(true);


    try {

      await archiveCustomer(customerId);

      router.push("/admin/customers");
      router.refresh();


    } catch (error) {

      alert(
        error instanceof Error
          ? error.message
          : "Failed to archive customer."
      );

    } finally {

      setLoading(false);

    }
  }


  return (
    <button
      onClick={handleArchive}
      disabled={loading}
      className="rounded-xl bg-red-600 px-5 py-3 text-white transition hover:bg-red-700 disabled:opacity-50"
    >
      {loading
        ? "Archiving..."
        : "Archive Customer"}
    </button>
  );
}