"use client";

import {
  House,
  Tv,
  Wrench,
  Lightbulb,
  Paintbrush,
  Hammer,
} from "lucide-react";

import FadeIn from "@/components/ui/FadeIn";
export default function Services() {
  const services = [
    {
      title: "Home Repairs",
      icon: House,
      description:
        "Drywall, doors, windows, trim, caulking and general home repairs.",
    },
    {
      title: "TV Mounting",
      icon: Tv,
      description:
        "TV mounting, soundbars, shelves, curtain rods and more.",
    },
    {
      title: "Assembly",
      icon: Hammer,
      description:
        "Furniture assembly, gazebos, office furniture and fitness equipment.",
    },
    {
      title: "Smart Home",
      icon: Lightbulb,
      description:
        "Ring Doorbells, Smart Locks, Nest Thermostats, Cameras and Wi-Fi setup.",
    },
    {
      title: "Painting",
      icon: Paintbrush,
      description:
        "Interior painting, drywall patching and professional finishing.",
    },
    {
      title: "Plumbing & Electrical",
      icon: Wrench,
      description:
        "Minor plumbing repairs, fixture replacement and electrical repairs.",
    },
  ];

  return (
    <FadeIn>
      <section
        id="services"
        className="bg-white py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          {/* Section Heading */}
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
              Our Services
            </span>

            <h2 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
              Professional Home Services You Can Trust
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              From small repairs to complete installations, XAREON GROUP
              delivers dependable workmanship with honesty, precision,
              and exceptional customer service.
            </p>
          </div>

          {/* Services Grid */}
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 transition group-hover:bg-blue-600">
                    <Icon
                      size={30}
                      className="text-blue-600 transition group-hover:text-white"
                    />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-slate-900">
                    {service.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {service.description}
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