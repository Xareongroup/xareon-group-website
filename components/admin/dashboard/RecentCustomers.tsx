import Link from "next/link";
import { ChevronRight, User } from "lucide-react";

import Card from "@/components/ui/Card";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
}

interface RecentCustomersProps {
  customers: Customer[];
}

export default function RecentCustomers({
  customers,
}: RecentCustomersProps) {
  return (
    <Card
      title="Recent Customers"
      description="Newest customers added to your CRM"
    >
      {customers.length === 0 ? (

        <div className="flex flex-col items-center justify-center py-12">

          <User className="mb-4 h-10 w-10 text-slate-300" />

          <p className="font-medium text-slate-700">
            No customers yet
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Your newest customers will appear here.
          </p>

        </div>

      ) : (

        <div className="divide-y divide-slate-200">

          {customers.slice(0, 5).map((customer) => (

            <Link
              key={customer.id}
              href={`/admin/customers/${customer.id}`}
              className="flex items-center justify-between py-4 transition hover:bg-slate-50"
            >

              <div>

                <h3 className="font-semibold text-slate-900">
                  {customer.first_name} {customer.last_name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {customer.email || "No email"}
                </p>

                <p className="text-sm text-slate-400">
                  {customer.phone || "No phone"}
                </p>

              </div>

              <ChevronRight className="h-5 w-5 text-slate-400" />

            </Link>

          ))}

        </div>

      )}

    </Card>
  );
}