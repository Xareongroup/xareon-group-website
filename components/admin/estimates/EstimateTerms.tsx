"use client";

import { Estimate } from "@/types/estimate";

interface EstimateTermsProps {
  estimate: Estimate;
  setEstimate: React.Dispatch<React.SetStateAction<Estimate>>;
}

export default function EstimateTerms({
  estimate,
  setEstimate,
}: EstimateTermsProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Terms & Conditions
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          These terms will appear at the bottom of the estimate.
          You can customize them for each customer if needed.
        </p>
      </div>

      <textarea
        rows={10}
        value={estimate.terms}
        onChange={(e) =>
          setEstimate((prev) => ({
            ...prev,
            terms: e.target.value,
          }))
        }
        className="w-full rounded-lg border border-slate-300 p-4 resize-y focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        placeholder="Enter your estimate terms and conditions..."
      />
    </div>
  );
}