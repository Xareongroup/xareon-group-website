import Link from "next/link";
import {
  Navigation,
  Phone,
  Camera,
  ClipboardCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function TechnicianPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">
          Technician Workspace
        </h1>

        <p className="mt-2 text-slate-600">
          Everything needed to complete today's jobs.
        </p>
      </div>

      <Card title="Current Job">
        <div className="space-y-4">
          <div>
            <p className="text-lg font-semibold">
              TV Mount Installation
            </p>

            <p className="text-slate-500">
              John Smith
            </p>

            <p className="text-sm text-slate-500">
              123 Main Street
            </p>

            <div className="mt-2 flex items-center gap-2 text-amber-600">
              <Clock className="h-4 w-4" />
              Scheduled Today • 9:00 AM
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button className="justify-center">
              <Navigation className="mr-2 h-4 w-4" />
              Directions
            </Button>

            <Button variant="secondary" className="justify-center">
              <Phone className="mr-2 h-4 w-4" />
              Call
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/jobs/current/photos">
              <Button
                variant="outline"
                className="w-full justify-center"
              >
                <Camera className="mr-2 h-4 w-4" />
                Photos
              </Button>
            </Link>

            <Link href="/admin/jobs/current/checklist">
              <Button
                variant="outline"
                className="w-full justify-center"
              >
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Checklist
              </Button>
            </Link>
          </div>

          <Button
            variant="success"
            className="w-full justify-center"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Complete Job
          </Button>
        </div>
      </Card>

      <Card title="Today's Queue">
        <div className="space-y-3">
          {[
            "TV Mount",
            "Drywall Repair",
            "Camera Installation",
          ].map((job) => (
            <div
              key={job}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{job}</span>

                <Button size="sm">
                  Open
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}