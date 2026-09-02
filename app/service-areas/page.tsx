import Link from "next/link";
import { ArrowRight, MapPin, Phone } from "lucide-react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import JsonLd from "@/components/seo/JsonLd";
import { TrackedEstimateLink, TrackedPhoneLink } from "@/components/analytics/TrackedLinks";
import { BUSINESS, SERVICE_AREA_STATEMENT, createPublicPageMetadata } from "@/lib/site-metadata";
import { createPublicPageSchema } from "@/lib/structured-data";

const title = "Service Areas in Montgomery & Howard Counties | XAREON GROUP";
const description =
  "XAREON GROUP regularly serves Montgomery and Howard counties, Maryland, with select projects accepted in Washington, D.C. and Northern Virginia.";

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
    name: "Montgomery County, Maryland",
    description:
      "A primary regular service area for XAREON GROUP home repair, installation, painting, and finishing projects.",
  },
  {
    name: "Howard County, Maryland",
    description:
      "A primary regular service area for appropriate residential and commercial repair, installation, and improvement projects.",
  },
  {
    name: "Washington, D.C. and Northern Virginia",
    description:
      "Extended service areas where select projects are accepted depending on project scope and availability.",
  },
];

export default function ServiceAreasPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="bg-white text-slate-900">
        <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 pb-20 pt-32 text-white md:pb-24 md:pt-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <nav aria-label="Breadcrumb" className="text-sm text-blue-200">
              <Link href="/" className="hover:text-white">Home</Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <span aria-current="page">Service Areas</span>
            </nav>
            <div className="mt-10 max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Service Areas</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">Home services in Montgomery and Howard counties</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">{SERVICE_AREA_STATEMENT}</p>
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
              <p>{SERVICE_AREA_STATEMENT}</p>
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
            <h2 id="regions-served" className="mt-3 text-3xl font-bold md:text-4xl">Primary and extended service regions</h2>
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

        <section className="py-16 md:py-24" aria-labelledby="county-guides">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">County guides</p>
            <h2 id="county-guides" className="mt-3 text-3xl font-bold md:text-4xl">Explore our primary Maryland service areas</h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <article className="flex flex-col rounded-3xl bg-blue-50 p-8 md:p-10">
                <h3 className="text-2xl font-bold md:text-3xl">Montgomery County, Maryland</h3>
                <p className="mt-5 flex-1 text-lg leading-8 text-slate-600">Review regularly served communities, available services, project information that helps with an estimate, and local customer questions.</p>
                <Link href="/service-areas/montgomery-county-md" className="mt-7 inline-flex min-h-12 items-center gap-2 self-start rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700">Explore Montgomery County <ArrowRight aria-hidden="true" size={18} /></Link>
              </article>
              <article className="flex flex-col rounded-3xl bg-blue-50 p-8 md:p-10">
                <h3 className="text-2xl font-bold md:text-3xl">Howard County, Maryland</h3>
                <p className="mt-5 flex-1 text-lg leading-8 text-slate-600">Explore Howard County-focused project guidance, regularly served communities, service links, scope boundaries, and useful estimate details.</p>
                <Link href="/service-areas/howard-county-md" className="mt-7 inline-flex min-h-12 items-center gap-2 self-start rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700">Explore Howard County <ArrowRight aria-hidden="true" size={18} /></Link>
              </article>
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
