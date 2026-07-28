import Card from "@/components/ui/Card";

const technicians = [
  "Mike",
  "Ahmad",
  "David",
];

export default function DispatchPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Dispatch Board
        </h1>

        <p className="text-slate-600">
          Assign and manage technician schedules.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {technicians.map((tech) => (
          <Card
            key={tech}
            title={tech}
          >
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
              No jobs assigned
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}