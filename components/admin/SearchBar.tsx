interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;

  placeholder?: string;

  status?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: string[];

  children?: React.ReactNode;
}

export default function SearchBar({
  search,
  onSearchChange,
  placeholder = "Search...",

  status,
  onStatusChange,
  statusOptions,

  children,
}: SearchBarProps) {
  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="grid gap-4 lg:grid-cols-[1fr_240px_auto]">

        <input
          type="text"
          value={search}
          placeholder={placeholder}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {statusOptions &&
          status &&
          onStatusChange && (

            <select
              value={status}
              onChange={(e) =>
                onStatusChange(e.target.value)
              }
              className="rounded-xl border border-slate-300 px-4 py-3"
            >
              {statusOptions.map((option) => (

                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>

              ))}
            </select>

        )}

        {children}

      </div>

    </div>
  );
}