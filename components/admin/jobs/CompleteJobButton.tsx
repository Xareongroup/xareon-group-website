"use client";

import { useState } from "react";

interface Props {
  jobId: string;
}

export default function CompleteJobButton({
  jobId,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function completeJob() {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/jobs/${jobId}/complete`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      window.location.reload();

    } catch {
      alert("Unable to complete job.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={completeJob}
      disabled={loading}
      className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? "Completing..." : "Complete Job"}
    </button>
  );
}