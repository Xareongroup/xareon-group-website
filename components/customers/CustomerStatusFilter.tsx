"use client";

import { useRouter, useSearchParams } from "next/navigation";


const filters = [
  {
    label: "Active",
    value: "Active",
  },
  {
    label: "Archived",
    value: "Archived",
  },
  {
    label: "All",
    value: "All",
  },
];


export default function CustomerStatusFilter() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const current =
    searchParams.get("status") ?? "Active";


  function changeStatus(value: string) {

    const params = new URLSearchParams(
      searchParams.toString()
    );


    params.set(
      "status",
      value
    );


    router.push(
      `/admin/customers?${params.toString()}`
    );
  }


  return (
    <div className="flex flex-wrap gap-2">

      {filters.map((filter) => {

        const active =
          current === filter.value;


        return (
          <button
            key={filter.value}
            onClick={() =>
              changeStatus(filter.value)
            }
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              active
                ? "bg-blue-600 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {filter.label}
          </button>
        );

      })}

    </div>
  );
}