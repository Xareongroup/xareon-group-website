import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function CustomerLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <Card title="Customer Login">
        <div className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />

          <Button className="w-full">
            Sign In
          </Button>

          <div className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/portal/register"
              className="font-semibold text-blue-600 hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}