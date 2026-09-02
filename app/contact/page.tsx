import Link from "next/link";
import { Clock3, ExternalLink, Mail, MapPin, Phone } from "lucide-react";

import QuoteForm from "@/components/QuoteForm";
import { TrackedEmailLink, TrackedPhoneLink } from "@/components/analytics/TrackedLinks";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import JsonLd from "@/components/seo/JsonLd";
import {
  BUSINESS,
  GOOGLE_BUSINESS_PROFILE_URL,
  SERVICE_AREA_STATEMENT,
  createPublicPageMetadata,
} from "@/lib/site-metadata";
import { createPublicPageSchema } from "@/lib/structured-data";

const path = "/contact";
const title = "Contact XAREON GROUP | Request a Home Service Estimate";
const description =
  "Contact XAREON GROUP to request an estimate for repair, installation, improvement, or renovation work in Montgomery or Howard County and select DMV areas.";

export const metadata = createPublicPageMetadata({ path, title, description });

const structuredData = createPublicPageSchema({
  path,
  name: title,
  description,
  type: "ContactPage",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Contact", path },
  ],
});

export default function ContactPage() {
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
              <span aria-current="page">Contact</span>
            </nav>
            <div className="mt-10 max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Contact XAREON GROUP</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">Tell us about your project</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">Share the location, property type, requested work, and useful photos or product details. XAREON GROUP will review the information and follow up about service coverage, scope, and possible next steps.</p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="contact-options">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Contact options</p>
              <h2 id="contact-options" className="mt-3 text-3xl font-bold md:text-4xl">Reach the company or request an estimate</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">XAREON GROUP is available 24 hours a day, seven days a week. Messages and requests are reviewed as operating conditions allow; submitting a request does not guarantee an immediate response, appointment, or acceptance of the project.</p>

              <div className="mt-8 space-y-4">
                <TrackedPhoneLink placement="contact_page_details" className="flex min-h-20 items-center gap-4 rounded-2xl border border-slate-200 p-5 transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                  <Phone aria-hidden="true" className="shrink-0 text-blue-600" size={26} />
                  <span><span className="block font-bold">Call XAREON GROUP</span><span className="mt-1 block text-slate-600">{BUSINESS.telephoneDisplay}</span></span>
                </TrackedPhoneLink>
                <TrackedEmailLink placement="contact_page_details" className="flex min-h-20 items-center gap-4 rounded-2xl border border-slate-200 p-5 transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                  <Mail aria-hidden="true" className="shrink-0 text-blue-600" size={26} />
                  <span className="min-w-0"><span className="block font-bold">Email XAREON GROUP</span><span className="mt-1 block break-all text-slate-600">{BUSINESS.email}</span></span>
                </TrackedEmailLink>
              </div>

              <div className="mt-8 rounded-3xl bg-slate-950 p-7 text-white">
                <Clock3 aria-hidden="true" className="text-blue-400" size={30} />
                <h2 className="mt-5 text-2xl font-bold">Available 24/7</h2>
                <p className="mt-4 leading-7 text-slate-300">Customers may call, email, or submit the estimate form at any time. Project timing and scheduling depend on the reviewed work, location, current availability, and agreed scope.</p>
              </div>

              <a href={GOOGLE_BUSINESS_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-6 py-3 font-semibold text-blue-800 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"><span aria-hidden="true">★</span> 5-Star Rated on Google <ExternalLink aria-hidden="true" size={16} /></a>
            </div>

            <div id="estimate-form" className="min-w-0 rounded-3xl bg-slate-100 p-2 sm:p-4 md:p-6">
              <QuoteForm />
            </div>
          </div>
        </section>

        <section className="bg-blue-50 py-16 md:py-20" aria-labelledby="contact-coverage">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Service coverage</p>
              <h2 id="contact-coverage" className="mt-3 text-3xl font-bold md:text-4xl">Include the exact project location</h2>
              <p className="mt-5 text-lg leading-8 text-slate-700">{SERVICE_AREA_STATEMENT}</p>
              <p className="mt-4 leading-7 text-slate-600">XAREON GROUP is a service-area company without a public storefront. Do not travel to a business address; use the contact options on this page to discuss the project.</p>
            </div>
            <div className="rounded-3xl bg-white p-7 shadow-sm md:p-9">
              <MapPin aria-hidden="true" className="text-blue-600" size={32} />
              <h2 className="mt-5 text-2xl font-bold">Primary county guides</h2>
              <div className="mt-5 flex flex-col gap-3">
                <Link href="/service-areas/montgomery-county-md" className="inline-flex min-h-11 items-center font-semibold text-blue-700 hover:text-blue-900">Montgomery County service guide</Link>
                <Link href="/service-areas/howard-county-md" className="inline-flex min-h-11 items-center font-semibold text-blue-700 hover:text-blue-900">Howard County service guide</Link>
                <Link href="/service-areas" className="inline-flex min-h-11 items-center font-semibold text-blue-700 hover:text-blue-900">All service-area information</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20" aria-labelledby="contact-resources">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <h2 id="contact-resources" className="text-3xl font-bold md:text-4xl">Review details before submitting</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">The pages below explain available services, company approach, coverage, and how submitted information is handled.</p>
            <nav aria-label="Contact page resources" className="mt-8 flex flex-wrap justify-center gap-4">
              {[
                ["Services", "/services"],
                ["Service Areas", "/service-areas"],
                ["About", "/about"],
                ["Privacy", "/privacy"],
              ].map(([label, href]) => <Link key={href} href={href} className="inline-flex min-h-12 items-center rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">{label}</Link>)}
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
