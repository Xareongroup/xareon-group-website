"use client";

import {
  ShieldCheck,
  BadgeCheck,
  Clock3,
  Wrench,
  MapPin,
  Smile,
} from "lucide-react";

import FadeIn from "@/components/ui/FadeIn";

const features = [
  {
    title: "Fully Insured",
    description:
      "Your home and business are protected. We complete every project with professionalism and care.",
    icon: ShieldCheck,
  },
  {
    title: "Honest Pricing",
    description:
      "Upfront estimates with no hidden fees. We believe in transparency and fairness.",
    icon: BadgeCheck,
  },
  {
    title: "Fast Response",
    description:
      "Quick scheduling and dependable service to get your project completed on time.",
    icon: Clock3,
  },
  {
    title: "Experienced Craftsmanship",
    description:
      "From repairs to installations, every project is completed with attention to detail.",
    icon: Wrench,
  },
  {
    title: "Serving MD • DC • VA",
    description:
      "Local professionals proudly serving homeowners and businesses throughout the region.",
    icon: MapPin,
  },
  {
    title: "Customer Satisfaction",
    description:
      "Our goal is simple: quality work, excellent communication, and happy customers.",
    icon: Smile,
  },
];

export default function WhyChoose() {
  return (
    <FadeIn>
      <section
        id="about"
        className="bg-slate-50 py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          {/* Heading */}
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
              Why Choose Us
            </span>

            <h2 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
              Trusted Home Service Professionals
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              XAREON GROUP is committed to delivering dependable
              workmanship, honest pricing, and exceptional customer
              service on every project.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 transition group-hover:scale-110">
                    <Icon size={28} className="text-white" />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}