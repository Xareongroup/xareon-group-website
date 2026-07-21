"use client";

import { Estimate } from "@/types/estimate";

interface EstimateNotesProps {
  estimate: Estimate;
  setEstimate: React.Dispatch<React.SetStateAction<Estimate>>;
}

export default function EstimateNotes({
  estimate,
  setEstimate,
}: EstimateNotesProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">
        Notes
      </h2>

      <p className="mb-4 text-sm text-slate-500">
        Internal or customer-facing notes that will appear on the estimate.
      </p>

      <textarea
        rows={8}
        value={estimate.notes}
        onChange={(e) =>
          setEstimate((prev) => ({
            ...prev,
            notes: e.target.value,
          }))
        }
        placeholder="Enter any notes for the customer..."
        className="w-full rounded-lg border border-slate-300 p-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-y"
      />
    </div>
  );
}