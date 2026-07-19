import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !customer) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">

      <h1 className="text-4xl font-bold">
        {customer.first_name} {customer.last_name}
      </h1>

      <div className="mt-8 rounded-xl bg-white p-8 shadow">

        <div className="space-y-5">

          <div>
            <p className="text-sm font-semibold text-slate-500">
              Email
            </p>

            <p>{customer.email || "—"}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-500">
              Phone
            </p>

            <p>{customer.phone || "—"}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-500">
              Address
            </p>

            <p>{customer.address || "—"}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-500">
              Notes
            </p>

            <p className="whitespace-pre-wrap">
              {customer.notes || "No notes"}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}