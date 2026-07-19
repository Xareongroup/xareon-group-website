"use client";

export default function AdminHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8">
      <h2 className="text-2xl font-semibold">
        XAREON Business Portal
      </h2>

      <div className="text-sm text-slate-500">
        Administrator
      </div>
    </header>
  );
}