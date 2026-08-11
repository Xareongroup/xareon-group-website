interface DataTableProps {
  loading: boolean;
  error?: string;

  isEmpty: boolean;

  emptyState: React.ReactNode;

  headers: React.ReactNode;

  children: React.ReactNode;
  mobileCards?: React.ReactNode;
}

export default function DataTable({
  loading,
  error,
  isEmpty,
  emptyState,
  headers,
  children,
  mobileCards,
}: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {loading ? (

        <div className="flex items-center justify-center p-16 text-slate-500">
          Loading...
        </div>

      ) : error ? (

        <div className="flex items-center justify-center p-16 text-red-600">
          {error}
        </div>

      ) : isEmpty ? (

        emptyState

      ) : (
        <>
          {mobileCards ? (
            <div className="space-y-3 p-3 md:hidden">{mobileCards}</div>
          ) : null}

          <div className={mobileCards ? "hidden overflow-x-auto md:block" : "overflow-x-auto"}>
            <table className="min-w-full">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
                {headers}
              </thead>

              <tbody>{children}</tbody>
            </table>
          </div>
        </>

      )}

    </div>
  );
}
