import { ReactNode } from "react";

interface DashboardGridProps {
  stats: ReactNode;
  main: ReactNode;
  side: ReactNode;
  bottom?: ReactNode;
}

export default function DashboardGrid({
  stats,
  main,
  side,
  bottom,
}: DashboardGridProps) {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <section>{stats}</section>

      {/* Main Dashboard */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {main}
        </div>

        <div>
          {side}
        </div>
      </section>

      {/* Optional Bottom Section */}
      {bottom && (
        <section>
          {bottom}
        </section>
      )}
    </div>
  );
}