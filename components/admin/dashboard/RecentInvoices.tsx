import Link from "next/link";
import { ChevronRight, Receipt } from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface Invoice {
  id: string;
  invoice_number: string;
  status: string;
  total: number | null;
  balance_due: number | null;
  due_date: string | null;

  customers: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
}

interface RecentInvoicesProps {
  invoices: Invoice[];
}

export default function RecentInvoices({
  invoices,
}: RecentInvoicesProps) {
  return (
    <Card
      title="Recent Invoices"
      description="Latest invoices in your business"
    >
      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Receipt className="mb-4 h-10 w-10 text-slate-300" />

          <p className="font-medium text-slate-700">
            No invoices found
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Your latest invoices will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {invoices.slice(0, 5).map((invoice) => (
            <Link
              key={invoice.id}
              href={`/admin/invoices/${invoice.id}`}
              className="flex items-center justify-between py-4 transition hover:bg-slate-50"
            >
              <div>
                <h3 className="font-semibold text-slate-900">
                  Invoice #{invoice.invoice_number}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {invoice.customers
                    ? `${invoice.customers.first_name} ${invoice.customers.last_name}`
                    : "Unknown Customer"}
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  Total: ${Number(invoice.total ?? 0).toFixed(2)}
                </p>

                {(invoice.balance_due ?? 0) > 0 && (
                  <p className="text-sm text-red-600">
                    Balance Due: $
                    {Number(invoice.balance_due ?? 0).toFixed(2)}
                  </p>
                )}

                <p className="mt-1 text-xs text-slate-400">
                  Due: {invoice.due_date ?? "No due date"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="success">
                  {invoice.status}
                </Badge>

                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}