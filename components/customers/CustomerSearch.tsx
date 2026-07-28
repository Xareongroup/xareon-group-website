"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function CustomerSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch =
    searchParams.get("search") ?? "";

  function handleSearch(value: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.push(
      `/admin/customers?${params.toString()}`
    );
  }

  return (
    <div className="relative w-full md:w-96">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

      <input
        defaultValue={currentSearch}
        onChange={(e) =>
          handleSearch(e.target.value)
        }
        placeholder="Search customers..."
        className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}