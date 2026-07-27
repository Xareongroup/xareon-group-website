interface StatsCardProps {
  title: string;
  value: string | number;

  color?:
    | "blue"
    | "green"
    | "red"
    | "orange"
    | "purple"
    | "slate";

  icon?: React.ReactNode;

  subtitle?: string;
}

export default function StatsCard({
  title,
  value,
  color = "slate",
  icon,
  subtitle,
}: StatsCardProps) {
  const colors = {
    slate: "text-slate-900",
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2
            className={`mt-3 text-3xl font-bold ${colors[color]}`}
          >
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-400">
              {subtitle}
            </p>
          )}

        </div>

        {icon && (
          <div className="text-3xl">
            {icon}
          </div>
        )}

      </div>

    </div>
  );
}