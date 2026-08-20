import Link from "next/link";
import { CheckCircle2, Phone } from "lucide-react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import JsonLd from "@/components/seo/JsonLd";
import { TrackedEstimateLink, TrackedPhoneLink } from "@/components/analytics/TrackedLinks";
import { coreExpansionServices } from "@/lib/services-core-expansion";
import { featuredServices } from "@/lib/services";
import { phase2BServices } from "@/lib/services-phase-2b";
import { BUSINESS, createPublicPageMetadata } from "@/lib/site-metadata";
import { createPublicPageSchema } from "@/lib/structured-data";

const title = "Home Repair & Installation Services | XAREON GROUP";
const description =
  "Explore home repair, drywall, painting, mounting, assembly, smart-home, minor plumbing and electrical, kitchen, bathroom, and installation services across the DMV.";

export const metadata = createPublicPageMetadata({
  path: "/services",
  title,
  description,
});

const structuredData = createPublicPageSchema({
  path: "/services",
  name: title,
  description,
  type: "CollectionPage",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ],
});

export default function ServicesPage() {
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
              <span aria-current="page">Services</span>
            </nav>
            <div className="mt-10 max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Our Services</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">Home repair and installation services for practical projects</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
                XAREON GROUP helps homeowners and businesses complete repairs, installations, painting, and finishing work across Maryland, Washington, DC, and Northern Virginia.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <TrackedEstimateLink href="/#contact" placement="services_hub_hero" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700">Get a Free Estimate</TrackedEstimateLink>
                <TrackedPhoneLink placement="services_hub_hero" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-7 py-3 font-semibold text-white transition hover:bg-white hover:text-slate-950">
                  <Phone aria-hidden="true" size={19} /> Call {BUSINESS.telephoneDisplay}
                </TrackedPhoneLink>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="services-introduction">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">A clear place to start</p>
              <h2 id="services-introduction" className="mt-3 text-3xl font-bold md:text-4xl">Find the service that matches your project</h2>
            </div>
            <div className="space-y-5 text-lg leading-8 text-slate-600">
              <p>Some projects have a clear focus, such as repairing damaged drywall or painting an interior room. Others involve a list of smaller repairs and installations that are best reviewed together.</p>
              <p>Choose a service below for more detail. If your project crosses categories or you are unsure where it belongs, start with General Home Repairs and describe the complete scope in the estimate form.</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-24" aria-labelledby="featured-services">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Featured services</p>
            <h2 id="featured-services" className="mt-3 text-3xl font-bold md:text-4xl">Detailed help for common home projects</h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {featuredServices.map((service) => (
                <article key={service.path} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-8">
                  <h3 className="text-2xl font-bold">{service.name}</h3>
                  <p className="mt-4 flex-1 leading-7 text-slate-600">{service.heroCopy}</p>
                  <Link href={service.path} className="mt-7 inline-flex min-h-11 items-center font-semibold text-blue-700 hover:text-blue-900">
                    Explore {service.name}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="installation-services">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Installation and space improvements</p>
            <h2 id="installation-services" className="mt-3 max-w-3xl text-3xl font-bold md:text-4xl">Focused services for mounting, doors, fixtures, and interior divisions</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {phase2BServices.map((service) => (
                <article key={service.path} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-8">
                  <h3 className="text-2xl font-bold">{service.name}</h3>
                  <p className="mt-4 flex-1 leading-7 text-slate-600">{service.heroCopy}</p>
                  <Link href={service.path} className="mt-7 inline-flex min-h-11 items-center font-semibold text-blue-700 hover:text-blue-900">
                    Explore {service.name}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="additional-services">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">More focused services</p>
              <h2 id="additional-services" className="mt-3 text-3xl font-bold md:text-4xl">Smart-home, minor repair, and room-improvement projects</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">Review the defined scope and important boundaries for each service before requesting an estimate.</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {coreExpansionServices.map((service) => (
                <article key={service.path} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                  <h3 className="text-2xl font-bold">{service.name}</h3>
                  <p className="mt-4 flex-1 leading-7 text-slate-600">{service.heroCopy}</p>
                  <Link href={service.path} className="mt-7 inline-flex min-h-11 items-center font-semibold text-blue-700 hover:text-blue-900">Explore {service.name}</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-16 text-white md:py-24" aria-labelledby="services-process">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Getting started</p>
              <h2 id="services-process" className="mt-3 text-3xl font-bold md:text-4xl">A straightforward way to request service</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">Describe the work, identify the property type and city, and attach photos when available. XAREON GROUP reviews those details as part of the estimate process.</p>
            </div>
            <ul className="space-y-4">
              {["Choose the closest service category", "Describe every project item", "Add clear photos when possible", "Submit the request for review"].map((item) => (
                <li key={item} className="flex gap-3 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-blue-400" size={21} />
                  <span className="text-slate-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 text-center md:py-24" aria-labelledby="services-area">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 id="services-area" className="text-3xl font-bold md:text-4xl">Serving customers across the DMV region</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">Current service coverage includes Maryland, Washington, DC, and Northern Virginia. Provide your city with the request so the project location and scope can be reviewed together.</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <TrackedEstimateLink href="/#contact" placement="services_hub_final" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700">Request a Free Estimate</TrackedEstimateLink>
              <Link href="/service-areas" className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 px-7 py-3 font-semibold text-slate-700 hover:bg-slate-50">See Where We Provide Service</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
