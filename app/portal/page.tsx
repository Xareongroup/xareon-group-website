import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function CustomerPortalPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 py-10">
      <div>
        <h1 className="text-4xl font-bold">
          Customer Portal
        </h1>

        <p className="mt-2 text-slate-600">
          Welcome back! View your projects, invoices, estimates, and upcoming appointments.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Open Estimates">
          <p className="text-4xl font-bold">0</p>
        </Card>

        <Card title="Upcoming Jobs">
          <p className="text-4xl font-bold">0</p>
        </Card>

        <Card title="Outstanding Balance">
          <p className="text-4xl font-bold">$0.00</p>
        </Card>

        <Card title="Completed Projects">
          <p className="text-4xl font-bold">0</p>
        </Card>
      </div>

      <Card title="Quick Actions">
        <div className="flex flex-wrap gap-4">
          <Button>Approve Estimate</Button>
          <Button>View Invoices</Button>
          <Button>Pay Invoice</Button>
          <Button>Request Service</Button>
          <Button>Contact XAREON</Button>
        </div>
      </Card>
    </div>
  );
}