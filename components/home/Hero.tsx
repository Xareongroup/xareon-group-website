import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
export default function Hero() {
  return (
    <section className="relative flex min-h-[100vh] items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/hero/hero.jpg"
        alt="XAREON GROUP Professional Home Services"
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-slate-900/60 to-blue-950/70" />

      {/* Content */}
<div className="relative z-10 mx-auto max-w-6xl px-6 pt-32 text-center text-white lg:pt-24">
          <FadeIn>
          {/* Badge */}
          <span className="mb-8 inline-flex rounded-full border border-blue-400/40 bg-blue-500/10 px-5 py-2 text-sm font-semibold tracking-widest text-blue-300 backdrop-blur-sm">
            SHIELD OF INTEGRITY
          </span>

          {/* Heading */}
          <h1 className="mt-6 text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
            Professional Home Repair
            <br />
            <span className="text-blue-400">
              & Installation Services
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
            Serving homeowners and businesses throughout
            <strong> Maryland</strong>,
            <strong> Washington DC</strong>, and
            <strong> Northern Virginia</strong> with dependable
            craftsmanship, honest pricing, and exceptional customer
            service.
          </p>

          {/* Buttons */}
          <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <a
              href="#contact"
              className="rounded-2xl bg-blue-600 px-10 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700"
            >
              Get a Free Quote
            </a>

            <a
              href="tel:+12022868497"
              className="rounded-2xl border border-white/30 bg-white/10 px-10 py-4 text-lg font-semibold backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-slate-900"
            >
              Call (202) 286-8497
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-200">
            <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              ⭐ 24 Customer Reviews
            </span>

            <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              ✔ Fully Insured
            </span>

            <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              ✔ 24/7 Service
            </span>

            <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              ✔ Serving MD • DC • VA
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}