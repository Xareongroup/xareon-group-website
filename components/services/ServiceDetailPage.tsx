import Link from "next/link";
import { CheckCircle2, MapPin, Phone } from "lucide-react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import JsonLd from "@/components/seo/JsonLd";
import { TrackedEstimateLink, TrackedPhoneLink } from "@/components/analytics/TrackedLinks";
import type { ServicePageContent } from "@/lib/services";
import { BUSINESS } from "@/lib/site-metadata";
import { createServicePageSchema } from "@/lib/structured-data";

const processSteps = [
  "Tell us about the project",
  "Share photos and details if available",
  "Receive an estimate",
  "Schedule the work",
  "The agreed work is completed and finished",
];

const reasons = [
  "Clear estimates based on the reviewed project scope",
  "Professional workmanship and attention to detail",
  "Straightforward communication before and during the project",
  "Careful, clean completion of the agreed work area",
  "Service for homeowners and businesses across the DMV region",
];

export default function ServiceDetailPage({ service }: { service: ServicePageContent }) {
  const structuredData = createServicePageSchema({
    path: service.path,
    name: service.name,
    serviceType: service.serviceType,
    description: service.description,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.name, path: service.path },
    ],
  });

  return (
    <>
      <JsonLd data={structuredData} />
      <Navbar />
      <main className="bg-white text-slate-900">
        <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 pb-20 pt-32 text-white md:pb-24 md:pt-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <nav aria-label="Breadcrumb" className="text-sm text-blue-200">
              <Link href="/" className="hover:text-white">Home</Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <Link href="/services" className="hover:text-white">Services</Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <span aria-current="page">{service.name}</span>
            </nav>

            <div className="mt-10 max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
                {service.eyebrow}
              </p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
                {service.name} for Homes and Businesses
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
                {service.heroCopy}
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <TrackedEstimateLink
                  href="/#contact"
                  placement="service_detail_hero"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get a Free Estimate
                </TrackedEstimateLink>
                <TrackedPhoneLink
                  placement="service_detail_hero"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-7 py-3 font-semibold text-white transition hover:bg-white hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Phone aria-hidden="true" size={19} />
                  Call {BUSINESS.telephoneDisplay}
                </TrackedPhoneLink>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="service-overview">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Service overview</p>
              <h2 id="service-overview" className="mt-3 text-3xl font-bold md:text-4xl">
                Practical help for a clearly defined project
              </h2>
              <div className="mt-6 space-y-5 text-lg leading-8 text-slate-600">
                {service.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </div>
            <aside className="rounded-3xl border border-blue-100 bg-blue-50 p-7 md:p-9">
              <h2 className="text-2xl font-bold">A useful estimate request includes</h2>
              <ul className="mt-6 space-y-4 text-slate-700">
                {["The location and type of property", "A description of the work", "Photos of each project area", "Any relevant product or access details"].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-blue-600" size={21} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-24" aria-labelledby="common-projects">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Common projects</p>
            <h2 id="common-projects" className="mt-3 max-w-3xl text-3xl font-bold md:text-4xl">
              Examples of {service.name.toLowerCase()} work
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {service.commonProjects.map((project) => (
                <article key={project.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{project.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="service-process">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Our process</p>
              <h2 id="service-process" className="mt-3 text-3xl font-bold md:text-4xl">A straightforward path from request to completion</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">{service.processNote}</p>
            </div>
            <ol className="mt-10 grid gap-5 md:grid-cols-5">
              {processSteps.map((step, index) => (
                <li key={step} className="rounded-2xl border border-slate-200 p-5">
                  <span className="text-sm font-bold text-blue-600">STEP {index + 1}</span>
                  <p className="mt-3 font-semibold leading-6">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-slate-950 py-16 text-white md:py-24" aria-labelledby="why-xareon">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Why XAREON GROUP</p>
              <h2 id="why-xareon" className="mt-3 text-3xl font-bold md:text-4xl">Professional service built around the actual scope</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Our goal is to make the requested work clear, communicate throughout the project, and complete the agreed details with care.
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {reasons.map((reason) => (
                <li key={reason} className="flex gap-3 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-blue-400" size={21} />
                  <span className="leading-6 text-slate-200">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="service-area">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <MapPin aria-hidden="true" className="mx-auto text-blue-600" size={38} />
            <h2 id="service-area" className="mt-4 text-3xl font-bold md:text-4xl">Serving Maryland, Washington, DC, and Northern Virginia</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              XAREON GROUP serves homeowners and businesses across the broader DMV region. Include your city and project details so we can review the location with the requested scope.
            </p>
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-24" aria-labelledby="service-faqs">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Frequently asked questions</p>
            <h2 id="service-faqs" className="mt-3 text-3xl font-bold md:text-4xl">Planning your {service.name.toLowerCase()} project</h2>
            <div className="mt-9 space-y-4">
              {service.faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white p-6">
                  <summary className="cursor-pointer list-none pr-6 text-lg font-bold marker:hidden">{faq.question}</summary>
                  <p className="mt-4 leading-7 text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20" aria-labelledby="related-services">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Related services</p>
                <h2 id="related-services" className="mt-3 text-3xl font-bold">Continue planning your project</h2>
              </div>
              <Link href="/services" className="font-semibold text-blue-700 hover:text-blue-900">View all services</Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {service.relatedServices.map((related) => (
                <Link key={related.href} href={related.href} className="rounded-3xl border border-slate-200 p-7 transition hover:border-blue-300 hover:shadow-lg">
                  <h3 className="text-xl font-bold">{related.name}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{related.description}</p>
                  <span className="mt-5 inline-block font-semibold text-blue-700">Explore {related.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-blue-600 py-16 text-white md:py-20" aria-labelledby="service-final-cta">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 id="service-final-cta" className="text-3xl font-bold md:text-4xl">Ready to discuss your {service.name.toLowerCase()} project?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">Share the project details and available photos to request a free estimate from XAREON GROUP.</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <TrackedEstimateLink href="/#contact" placement="service_detail_final" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-white px-7 py-3 font-semibold text-blue-700 hover:bg-slate-100">Get a Free Estimate</TrackedEstimateLink>
              <TrackedPhoneLink placement="service_detail_final" className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white px-7 py-3 font-semibold text-white hover:bg-white hover:text-blue-700">Call {BUSINESS.telephoneDisplay}</TrackedPhoneLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
