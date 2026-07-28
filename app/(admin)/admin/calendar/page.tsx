"use client";

import DispatchCalendar from "../../../../components/admin/calendar/DispatchCalendar";
import JobSchedulerForm from "../../../../components/admin/calendar/JobSchedulerForm";

export default function CalendarPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Dispatch Calendar
          </h1>

          <p className="mt-2 text-slate-500">
            Schedule, manage, and dispatch jobs across your team.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Interactive Calendar */}
        <div className="lg:col-span-2">
          <DispatchCalendar />
        </div>

        {/* Job Scheduler */}
        <div>
          <JobSchedulerForm />
        </div>
      </div>
    </div>
  );
}