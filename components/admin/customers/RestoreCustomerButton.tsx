"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { restoreCustomer } from "@/app/actions/customers";


interface Props {
  customerId: string;
}


export default function RestoreCustomerButton({
  customerId,
}: Props) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);


  async function handleRestore() {

    setLoading(true);


    try {

      await restoreCustomer(customerId);

      router.refresh();


    } catch (error) {

      alert(
        error instanceof Error
          ? error.message
          : "Failed to restore customer."
      );


    } finally {

      setLoading(false);

    }

  }


  return (
    <button
      onClick={handleRestore}
      disabled={loading}
      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
    >
      {loading
        ? "Restoring..."
        : "Restore"}
    </button>
  );
}