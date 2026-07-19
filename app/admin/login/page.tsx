import LoginForm from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center">
          XAREON Business Portal
        </h1>

        <p className="mt-2 text-center text-slate-500">
          Sign in to continue
        </p>

        <LoginForm />
      </div>
    </div>
  );
}