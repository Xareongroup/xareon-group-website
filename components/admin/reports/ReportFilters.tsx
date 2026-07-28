"use client";

interface ReportFiltersProps {
  value: string;
  onChange: (value: string) => void;
  onExportPdf: () => void;
  onExportExcel?: () => void;
}

const ranges = [
  {
    label: "Today",
    value: "today",
  },
  {
    label: "7 Days",
    value: "7d",
  },
  {
    label: "30 Days",
    value: "30d",
  },
  {
    label: "90 Days",
    value: "90d",
  },
  {
    label: "This Year",
    value: "year",
  },
];

export default function ReportFilters({
  value,
  onChange,
  onExportPdf,
  onExportExcel,
}: ReportFiltersProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Report Period
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select the reporting period for all analytics below.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {ranges.map((range) => {
            const active = value === range.value;

            return (
              <button
                key={range.value}
                type="button"
                onClick={() => onChange(range.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {range.label}
              </button>
            );
          })}

          <div className="mx-2 hidden h-8 w-px bg-slate-300 lg:block" />

          <button
            type="button"
            onClick={onExportPdf}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Export PDF
          </button>

          <button
            type="button"
            onClick={onExportExcel}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Export Excel
          </button>
        </div>
      </div>
    </div>
  );
}