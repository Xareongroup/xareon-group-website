import AppointmentForm from "../../../../components/admin/calendar/AppointmentForm";

export default function CalendarPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Calendar
          </h1>

          <p className="mt-2 text-slate-500">
            Schedule jobs, appointments, estimates and technician visits.
          </p>
        </div>

        <button className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow transition hover:bg-blue-700">
          + New Appointment
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Calendar */}

        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <button className="rounded-lg border px-3 py-2 transition hover:bg-slate-100">
              ←
            </button>

            <h2 className="text-xl font-semibold">
              July 2026
            </h2>

            <button className="rounded-lg border px-3 py-2 transition hover:bg-slate-100">
              →
            </button>

          </div>

          <div className="grid grid-cols-7 gap-3 text-center text-sm font-semibold text-slate-500">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-3">
            {Array.from({ length: 35 }).map((_, index) => (
              <div
                key={index}
                className="flex h-24 items-start justify-start rounded-xl border border-slate-200 p-2 transition hover:border-blue-500 hover:bg-blue-50"
              >
                <span className="text-sm font-medium text-slate-700">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Appointment Form */}

        <div>
          <AppointmentForm />
        </div>

      </div>
    </div>
  );
}