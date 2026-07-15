"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 flex h-20 max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-8 shadow-2xl backdrop-blur-xl">

        {/* ================= Logo ================= */}
        <Link
          href="/"
          className="flex items-center gap-4 transition-transform duration-300 hover:scale-[1.02]"
        >
<Image
  src="/logo/xareon1-logo.png"
  alt="XAREON GROUP"
  width={70}
  height={70}
  priority
  className="rounded-full"
/>

          <div className="leading-tight">
            <h1 className="text-xl font-bold tracking-wide text-white">
              XAREON GROUP
            </h1>

            <p className="text-xs uppercase tracking-[0.35em] text-blue-300">
              Shield of Integrity
            </p>
          </div>
        </Link>

        {/* ================= Desktop Navigation ================= */}
        <nav className="hidden items-center gap-10 lg:flex">
          <Link
            href="/"
            className="text-base font-semibold text-white transition duration-300 hover:text-blue-400"
          >
            Home
          </Link>

          <Link
            href="#services"
            className="text-base font-semibold text-white transition duration-300 hover:text-blue-400"
          >
            Services
          </Link>

          <Link
            href="#portfolio"
            className="text-base font-semibold text-white transition duration-300 hover:text-blue-400"
          >
            Portfolio
          </Link>

          <Link
            href="#reviews"
            className="text-base font-semibold text-white transition duration-300 hover:text-blue-400"
          >
            Reviews
          </Link>

          <Link
            href="#contact"
            className="text-base font-semibold text-white transition duration-300 hover:text-blue-400"
          >
            Contact
          </Link>
        </nav>

        {/* ================= Right Side ================= */}
        <div className="flex items-center gap-4">

          <a
            href="tel:+12022868497"
            className="hidden h-12 items-center rounded-xl bg-blue-600 px-7 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 lg:inline-flex"
          >
            Call Now
          </a>

          {/* Mobile Menu Button */}
          <button
            className="rounded-xl border border-white/10 p-3 text-white transition hover:bg-white/10 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={26} />
          </button>

        </div>
      </div>
    </header>
  );
}