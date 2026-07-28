import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function CustomerRegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <Card title="Create Customer Account">
        <div className="space-y-4">
          <input
            placeholder="Full Name"
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />

          <Button className="w-full">
            Create Account
          </Button>
        </div>
      </Card>
    </div>
  );
}