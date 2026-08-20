"use client";

import {
  House,
  Tv,
  Wrench,
  Lightbulb,
  Paintbrush,
  Hammer,
} from "lucide-react";
import Link from "next/link";

import FadeIn from "@/components/ui/FadeIn";

export default function Services() {
  const services = [
    {
      title: "Home Repairs",
      icon: House,
      description:
        "Drywall, doors, windows, trim, caulking and general home repairs.",
      links: [
        { label: "Explore General Home Repairs", href: "/services/general-home-repairs" },
        { label: "Explore Drywall Repair", href: "/services/drywall-repair" },
        { label: "Explore Door Installation & Repair", href: "/services/door-installation-repair" },
      ],
    },
    {
      title: "TV Mounting",
      icon: Tv,
      description:
        "TV mounting, soundbars, shelves, curtain rods and more.",
      links: [
        { label: "Explore TV Mounting", href: "/services/tv-mounting" },
      ],
    },
    {
      title: "Assembly",
      icon: Hammer,
      description:
        "Furniture assembly, gazebos, office furniture and fitness equipment.",
      links: [
        { label: "Explore Furniture Assembly", href: "/services/furniture-assembly" },
      ],
    },
    {
      title: "Smart Home",
      icon: Lightbulb,
      description:
        "Video doorbells, smart locks, thermostats, cameras and basic device setup.",
      links: [
        { label: "Explore Smart Home Installation", href: "/services/smart-home-installation" },
      ],
    },
    {
      title: "Painting",
      icon: Paintbrush,
      description:
        "Interior painting, drywall patching and professional finishing.",
      links: [
        { label: "Explore Interior Painting", href: "/services/interior-painting" },
      ],
    },
    {
      title: "Minor Plumbing & Electrical",
      icon: Wrench,
      description:
        "Minor fixture-level plumbing work, existing-location electrical issues and compatible fixture replacement.",
      links: [
        { label: "Explore Minor Plumbing Repairs", href: "/services/minor-plumbing-repairs" },
        { label: "Explore Minor Electrical Repairs", href: "/services/minor-electrical-repairs" },
        { label: "Explore Fixture Installation", href: "/services/fixture-installation" },
      ],
    },
  ];

  return (
    <FadeIn>
      <section
        id="services"
        className="bg-white py-16 md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Section Heading */}
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 md:text-sm">
              Our Services
            </span>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
              Professional Home Services You Can Trust
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 md:mt-6 md:text-lg">
              From small repairs to complete installations, XAREON GROUP
              delivers dependable workmanship with honesty, precision,
              and exceptional customer service.
            </p>
          </div>

          {/* Services Grid */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl md:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 transition group-hover:bg-blue-600 md:h-14 md:w-14">
                    <Icon
                      size={26}
                      className="text-blue-600 transition group-hover:text-white md:h-8 md:w-8"
                    />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-900 md:mt-6 md:text-2xl">
                    {service.title}
                  </h3>

                  <p className="mt-3 flex-grow text-sm leading-7 text-slate-600 md:mt-4 md:text-base">
                    {service.description}
                  </p>

                  {service.links?.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="mt-4 inline-flex min-h-11 items-center font-semibold text-blue-700 hover:text-blue-900"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/services" className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-blue-600 px-7 py-3 font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white">
              View All Services
            </Link>
            <Link href="/service-areas" className="inline-flex min-h-12 items-center justify-center px-4 py-3 font-semibold text-blue-700 transition hover:text-blue-900">
              View Service Areas
            </Link>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
