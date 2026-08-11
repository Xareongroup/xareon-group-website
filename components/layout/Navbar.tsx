"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-2 flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-4 shadow-2xl backdrop-blur-xl md:mt-4 md:h-20 md:px-8">

        {/* Logo */}

        <Link
          href="/"
          className="flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
        >
          <Image
            src="/logo/xareon1-logo.png"
            alt="XAREON GROUP"
            width={70}
            height={70}
            priority
            style={{
              width: "56px",
              height: "56px",
            }}
            className="rounded-full md:h-[70px] md:w-[70px]"
          />

          <div className="leading-tight">

            <h1 className="text-base font-bold tracking-wide text-white md:text-xl">
              XAREON GROUP
            </h1>

            <p className="hidden text-xs uppercase tracking-[0.35em] text-blue-300 md:block">
              Shield of Integrity
            </p>

          </div>

        </Link>

        {/* Desktop Navigation */}

        <nav className="hidden items-center gap-10 lg:flex">

          <Link
            href="/"
            className="text-base font-semibold text-white transition hover:text-blue-400"
          >
            Home
          </Link>

          <Link
            href="#services"
            className="text-base font-semibold text-white transition hover:text-blue-400"
          >
            Services
          </Link>

          <Link
            href="#portfolio"
            className="text-base font-semibold text-white transition hover:text-blue-400"
          >
            Portfolio
          </Link>

          <Link
            href="#reviews"
            className="text-base font-semibold text-white transition hover:text-blue-400"
          >
            Reviews
          </Link>

          <Link
            href="/blog"
            className="text-base font-semibold text-white transition hover:text-blue-400"
          >
            Blog
          </Link>

          <Link
            href="#contact"
            className="text-base font-semibold text-white transition hover:text-blue-400"
          >
            Contact
          </Link>

        </nav>

        {/* Right Side */}

        <div className="flex items-center gap-4">

          <a
            href="tel:+12022868497"
            className="hidden h-12 items-center rounded-xl bg-blue-600 px-7 text-base font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-blue-700 lg:inline-flex"
          >
            Call Now
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-white/10 p-3 text-white transition hover:bg-white/10 lg:hidden"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

      </div>

      {/* Mobile Navigation */}

      {mobileMenuOpen && (

        <div className="mx-4 mt-2 rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl lg:hidden">

          <nav className="flex flex-col gap-2">

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-white transition hover:bg-blue-600"
            >
              Home
            </Link>

            <Link
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-white transition hover:bg-blue-600"
            >
              Services
            </Link>

            <Link
              href="#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-white transition hover:bg-blue-600"
            >
              Portfolio
            </Link>

            <Link
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-white transition hover:bg-blue-600"
            >
              Reviews
            </Link>

            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-white transition hover:bg-blue-600"
            >
              Blog
            </Link>

            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-white transition hover:bg-blue-600"
            >
              Contact
            </Link>

            <a
              href="tel:+12022868497"
              className="mt-3 rounded-xl bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
            >
              📞 Call Now
            </a>

          </nav>

        </div>

      )}

    </header>
  );
}
