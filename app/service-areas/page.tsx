import Link from "next/link";
import { ArrowRight, MapPin, Phone } from "lucide-react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import JsonLd from "@/components/seo/JsonLd";
import { TrackedEstimateLink, TrackedPhoneLink } from "@/components/analytics/TrackedLinks";
import { BUSINESS, createPublicPageMetadata } from "@/lib/site-metadata";
import { createPublicPageSchema } from "@/lib/structured-data";

const title = "Home Service Areas in MD, DC & Northern VA | XAREON GROUP";
const description =
  "Explore XAREON GROUP service coverage across Maryland, Washington, DC, and Northern Virginia, including home repair services in Montgomery County, MD.";

export const metadata = createPublicPageMetadata({
  path: "/service-areas",
  title,
  description,
});

const structuredData = createPublicPageSchema({
  path: "/service-areas",
  name: title,
  description,
  type: "CollectionPage",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Service Areas", path: "/service-areas" },
  ],
});

const regions = [
  {
    name: "Maryland",
    description:
      "Home repair, installation, painting, and finishing requests are reviewed across the current Maryland service region, with dedicated information available for Montgomery County.",
  },
  {
    name: "Washington, DC",
    description:
      "Customers in Washington, DC can request estimates for appropriate residential and commercial repair and installation projects.",
  },
  {
    name: "Northern Virginia",
    description:
      "XAREON GROUP also reviews project requests from communities across the current Northern Virginia service region.",
  },
];

export default function ServiceAreasPage() {
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
              <span aria-current="page">Service Areas</span>
            </nav>
            <div className="mt-10 max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Service Areas</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">Home services across Maryland, Washington, DC, and Northern Virginia</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">Find out where XAREON GROUP reviews home repair and installation requests, then share your location and project details for an estimate.</p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <TrackedEstimateLink href="/#contact" placement="service_areas_hero" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Get a Free Estimate</TrackedEstimateLink>
                <TrackedPhoneLink placement="service_areas_hero" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-7 py-3 font-semibold text-white transition hover:bg-white hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><Phone aria-hidden="true" size={19} />Call {BUSINESS.telephoneDisplay}</TrackedPhoneLink>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="coverage-overview">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Regional coverage</p>
              <h2 id="coverage-overview" className="mt-3 text-3xl font-bold md:text-4xl">A clear starting point for local project requests</h2>
            </div>
            <div className="space-y-5 text-lg leading-8 text-slate-600">
              <p>XAREON GROUP serves homeowners, property customers, and appropriate business projects across the broader DMV region. Availability depends on the project location, requested work, and current scope.</p>
              <p>Include your city and property type when requesting an estimate. That information helps the team review service coverage alongside the work itself.</p>
              <Link href="/services" className="inline-flex min-h-11 items-center gap-2 font-semibold text-blue-700 hover:text-blue-900">Explore all available services <ArrowRight aria-hidden="true" size={18} /></Link>
              <p className="text-base leading-7 text-slate-600">
                Common starting points include <Link href="/services/drywall-repair" className="font-semibold text-blue-700 hover:text-blue-900">drywall repair</Link>,{" "}
                <Link href="/services/general-home-repairs" className="font-semibold text-blue-700 hover:text-blue-900">general home repairs</Link>, and{" "}
                <Link href="/services/fixture-installation" className="font-semibold text-blue-700 hover:text-blue-900">fixture installation</Link>.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-24" aria-labelledby="regions-served">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Where we work</p>
            <h2 id="regions-served" className="mt-3 text-3xl font-bold md:text-4xl">Current service regions</h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {regions.map((region) => (
                <article key={region.name} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-8">
                  <MapPin aria-hidden="true" className="text-blue-600" size={28} />
                  <h3 className="mt-5 text-2xl font-bold">{region.name}</h3>
                  <p className="mt-4 leading-7 text-slate-600">{region.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="montgomery-county">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="rounded-3xl bg-blue-50 p-8 md:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Maryland coverage</p>
              <h2 id="montgomery-county" className="mt-3 text-3xl font-bold md:text-4xl">Home services in Montgomery County, Maryland</h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">Review the services available, examples of communities served, project information that helps with an estimate, and answers to common local customer questions.</p>
              <Link href="/service-areas/montgomery-county-md" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700">Explore Montgomery County service coverage <ArrowRight aria-hidden="true" size={18} /></Link>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-16 text-white md:py-20" aria-labelledby="area-estimate">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 id="area-estimate" className="text-3xl font-bold md:text-4xl">Tell us where your project is located</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">Provide the city, property type, requested work, and photos when available so location and scope can be reviewed together.</p>
            <TrackedEstimateLink href="/#contact" placement="service_areas_final" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700">Request a Free Estimate</TrackedEstimateLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
