"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import MobileBottomNav from "./MobileBottomNav";

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({
  children,
}: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  useEffect(() => {
    if (!sidebarOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sidebarOpen]);

  return (
    <div className="admin-shell flex min-h-screen bg-slate-100 text-slate-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div
            id="admin-mobile-navigation"
            className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Administration navigation"
          >
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-3 z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-slate-800 text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-slate-800 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Open menu"
            aria-controls="admin-mobile-navigation"
            aria-expanded={sidebarOpen}
          >
            <Menu className="h-6 w-6" />
          </button>

          <h1 className="min-w-0 flex-1 truncate px-3 text-center text-lg font-bold text-slate-900">
            XAREON
          </h1>

          <div className="h-11 w-11 shrink-0" aria-hidden="true" />
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <AdminHeader />
        </div>

        {/* Page Content */}
        <main className="flex-1 px-4 py-5 pb-24 sm:px-6 lg:p-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav onOpenMenu={() => setSidebarOpen(true)} />
      </div>
    </div>
  );
}
