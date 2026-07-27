"use client";

import { useState } from "react";

interface ConvertToJobButtonProps {
  estimateId: string;
}

export default function ConvertToJobButton({
  estimateId,
}: ConvertToJobButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleConvert() {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/estimates/${estimateId}/convert-to-job`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to convert estimate.");
      }

      const data = await response.json();

      window.location.href = "/admin/jobs";
    } catch (error) {
      console.error(error);
      alert("Unable to convert estimate.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleConvert}
      disabled={loading}
      className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Converting..." : "Convert to Job"}
    </button>
  );
}