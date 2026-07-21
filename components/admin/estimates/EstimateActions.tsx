"use client";

import { Estimate } from "@/types/estimate";

interface EstimateActionsProps {
  estimate: Estimate;
  loading?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  onPreview?: () => void;
  onEmail?: () => void;
}

export default function EstimateActions({
  loading = false,
  onSave,
  onCancel,
  onPreview,
  onEmail,
}: EstimateActionsProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Actions
      </h2>

      <div className="space-y-3">

        <button
          type="button"
          onClick={onSave}
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Saving..." : "Save Estimate"}
        </button>

        <button
          type="button"
          onClick={onPreview}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 font-medium transition hover:bg-slate-50"
        >
          Preview PDF
        </button>

        <button
          type="button"
          onClick={onEmail}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 font-medium transition hover:bg-slate-50"
        >
          Email Estimate
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-lg border border-red-300 px-4 py-3 font-medium text-red-600 transition hover:bg-red-50"
        >
          Cancel
        </button>

      </div>

    </div>
  );
}