import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import { TrackedEstimateLink, TrackedPhoneLink } from "@/components/analytics/TrackedLinks";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
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
      <div className="relative z-10 mx-auto max-w-6xl px-5 pt-24 pb-10 text-center text-white sm:px-6 md:pt-28 lg:pt-24">
        <FadeIn>
          {/* Badge */}
          <span className="mb-6 inline-flex rounded-full border border-blue-400/40 bg-blue-500/10 px-4 py-2 text-xs font-semibold tracking-[0.25em] text-blue-300 backdrop-blur-sm md:mb-8 md:px-5 md:text-sm">
            SHIELD OF INTEGRITY
          </span>

          {/* Heading */}
          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl md:mt-6 md:text-6xl lg:text-7xl">
            Professional Home Repair
            <br />
            <span className="text-blue-400">
              & Installation Services
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-3xl px-1 text-base leading-7 text-slate-200 sm:text-lg md:mt-8 md:text-xl">
            Serving homeowners and businesses throughout
            <strong> Maryland</strong>,
            <strong> Washington DC</strong>, and
            <strong> Northern Virginia</strong> with dependable
            craftsmanship, honest pricing, and exceptional customer
            service.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <TrackedEstimateLink
              href="#contact"
              placement="homepage_hero"
              className="w-full rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:bg-blue-700 sm:w-auto"
            >
              Get a Free Quote
            </TrackedEstimateLink>

            <TrackedPhoneLink
              placement="homepage_hero"
              className="w-full rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-slate-900 sm:w-auto"
            >
              Call (202) 286-8497
            </TrackedPhoneLink>
          </div>

          {/* Trust Badges */}
          <div className="mt-10 flex flex-wrap justify-center gap-3 text-xs font-medium text-slate-200 sm:mt-16 sm:gap-6 sm:text-sm">
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
