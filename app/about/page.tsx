import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  ExternalLink,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { TrackedEstimateLink, TrackedPhoneLink } from "@/components/analytics/TrackedLinks";
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

const path = "/about";
const title = "About XAREON GROUP | Home Repair & Installation Company";
const description =
  "Learn how XAREON GROUP approaches home repair, installation, improvement, and renovation projects across its primary Maryland and extended DMV service areas.";

export const metadata = createPublicPageMetadata({ path, title, description });

const structuredData = createPublicPageSchema({
  path,
  name: title,
  description,
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "About XAREON GROUP", path },
  ],
});

const approach = [
  {
    title: "Clear communication",
    description: "Project details, site conditions, requested outcomes, and open questions are reviewed before the work is scheduled.",
    icon: MessageSquareText,
  },
  {
    title: "Scope-led coordination",
    description: "Each estimate defines the accepted work so customers and the company share a practical understanding of the project.",
    icon: CheckCircle2,
  },
  {
    title: "Careful workmanship",
    description: "Attention is given to preparation, compatible products, surrounding surfaces, finish details, and the agreed work area.",
    icon: Wrench,
  },
  {
    title: "Reliable follow-through",
    description: "Scheduling and completion are coordinated around the documented scope and information available for the property.",
    icon: Clock3,
  },
];

const serviceGroups = [
  {
    title: "Repairs and finishing",
    description: "General home repairs, drywall repair, interior painting, door adjustments, trim, hardware, and other clearly documented tasks.",
    links: [
      { label: "General Home Repairs", href: "/services/general-home-repairs" },
      { label: "Drywall Repair", href: "/services/drywall-repair" },
      { label: "Interior Painting", href: "/services/interior-painting" },
    ],
  },
  {
    title: "Assembly and installation",
    description: "Furniture and gazebo assembly, TV mounting, compatible fixtures, smart-home devices, doors, shelving, and related installations.",
    links: [
      { label: "Furniture Assembly", href: "/services/furniture-assembly" },
      { label: "TV Mounting", href: "/services/tv-mounting" },
      { label: "Fixture Installation", href: "/services/fixture-installation" },
      { label: "Smart Home Installation", href: "/services/smart-home-installation" },
    ],
  },
  {
    title: "Improvements and renovations",
    description: "Defined kitchen, bathroom, partition-wall, room-improvement, and complete renovation projects coordinated around the actual property and approved scope.",
    links: [
      { label: "Kitchen Installation", href: "/services/kitchen-installation" },
      { label: "Bathroom Improvements", href: "/services/bathroom-improvements" },
      { label: "Partition Walls", href: "/services/partition-walls" },
    ],
  },
];

export default function AboutPage() {
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
              <span aria-current="page">About XAREON GROUP</span>
            </nav>
            <div className="mt-10 max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">About XAREON GROUP</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">A practical, scope-led approach to home service</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">XAREON GROUP is a service-area company providing repair, installation, improvement, and renovation services for homes and appropriate business spaces. Every request begins with the property, the work requested, and a clear definition of what the project should include.</p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <TrackedEstimateLink href="/#contact" placement="about_hero" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Get a Free Estimate</TrackedEstimateLink>
                <TrackedPhoneLink placement="about_hero" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-7 py-3 font-semibold text-white transition hover:bg-white hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><Phone aria-hidden="true" size={19} />Call {BUSINESS.telephoneDisplay}</TrackedPhoneLink>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="company-approach">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">How the company works</p>
              <h2 id="company-approach" className="mt-3 text-3xl font-bold md:text-4xl">Built around clear expectations and coordinated work</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">Good project coordination starts with useful information. XAREON GROUP asks customers to describe the full task list, share photos and product details when available, and identify conditions that could affect access, preparation, compatibility, or finishing.</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {approach.map(({ title: itemTitle, description: itemDescription, icon: Icon }) => (
                <article key={itemTitle} className="rounded-3xl border border-slate-200 p-7 shadow-sm md:p-8">
                  <Icon aria-hidden="true" className="text-blue-600" size={30} />
                  <h3 className="mt-5 text-2xl font-bold">{itemTitle}</h3>
                  <p className="mt-4 leading-7 text-slate-600">{itemDescription}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-24" aria-labelledby="about-services">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Services</p>
            <h2 id="about-services" className="mt-3 max-w-3xl text-3xl font-bold md:text-4xl">Repair, installation, improvement, and renovation work</h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {serviceGroups.map((group) => (
                <article key={group.title} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-8">
                  <h3 className="text-2xl font-bold">{group.title}</h3>
                  <p className="mt-4 leading-7 text-slate-600">{group.description}</p>
                  <ul className="mt-6 space-y-3">
                    {group.links.map((service) => (
                      <li key={service.href}><Link href={service.href} className="inline-flex min-h-11 items-center font-semibold text-blue-700 hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">{service.label}</Link></li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/services" className="inline-flex min-h-12 items-center rounded-2xl border border-slate-300 px-7 py-3 font-semibold text-slate-700 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">Explore all detailed services</Link>
              <Link href="/projects/whole-home-restoration-renovation" className="inline-flex min-h-12 items-center rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">See a coordinated whole-home project</Link>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-16 text-white md:py-24" aria-labelledby="company-standards">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Company standards</p>
              <h2 id="company-standards" className="mt-3 text-3xl font-bold md:text-4xl">Fully insured and available 24/7</h2>
              <div className="mt-6 space-y-5 text-lg leading-8 text-slate-300">
                <p>XAREON GROUP is fully insured. The company is available 24 hours a day, seven days a week for customers to make contact and share project needs.</p>
                <p>Availability does not replace project review. Timing, location, existing conditions, requested work, and current scheduling are considered before a service appointment or project is confirmed.</p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/5 p-7 ring-1 ring-white/10"><ShieldCheck aria-hidden="true" className="text-blue-400" size={34} /><h3 className="mt-5 text-xl font-bold">Fully insured</h3><p className="mt-3 leading-7 text-slate-300">Insurance status is stated directly without adding unsupported credential or licensing claims.</p></div>
              <div className="rounded-3xl bg-white/5 p-7 ring-1 ring-white/10"><Clock3 aria-hidden="true" className="text-blue-400" size={34} /><h3 className="mt-5 text-xl font-bold">24/7 availability</h3><p className="mt-3 leading-7 text-slate-300">Customers may contact the company at any time to describe a project or service need.</p></div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="about-coverage">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Service-area company</p>
              <h2 id="about-coverage" className="mt-3 text-3xl font-bold md:text-4xl">Service delivered at customer project locations</h2>
              <div className="mt-6 space-y-5 text-lg leading-8 text-slate-600">
                <p>XAREON GROUP operates as a service-area business and does not maintain a public storefront. Customers should use the estimate form or telephone number to discuss service rather than visiting a business address.</p>
                <p>{SERVICE_AREA_STATEMENT}</p>
              </div>
              <div className="mt-7 flex flex-wrap gap-4">
                <Link href="/service-areas/montgomery-county-md" className="inline-flex min-h-11 items-center font-semibold text-blue-700 hover:text-blue-900">Montgomery County guide</Link>
                <Link href="/service-areas/howard-county-md" className="inline-flex min-h-11 items-center font-semibold text-blue-700 hover:text-blue-900">Howard County guide</Link>
              </div>
            </div>
            <aside className="rounded-3xl border border-blue-100 bg-blue-50 p-7 md:p-9">
              <MapPin aria-hidden="true" className="text-blue-600" size={34} />
              <h2 className="mt-5 text-2xl font-bold">Coverage is confirmed with scope</h2>
              <p className="mt-4 leading-7 text-slate-700">Include the exact project location and requested work. Washington, D.C. and Northern Virginia are extended service areas, not primary regular markets, and projects there depend on scope and availability.</p>
              <Link href="/service-areas" className="mt-6 inline-flex min-h-11 items-center font-semibold text-blue-700 hover:text-blue-900">Review all service-area information</Link>
            </aside>
          </div>
        </section>

        <section className="bg-blue-50 py-16 md:py-20" aria-labelledby="honest-scope">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Honest project boundaries</p>
            <h2 id="honest-scope" className="mt-3 text-3xl font-bold md:text-4xl">The estimate defines what the company has agreed to complete</h2>
            <div className="mt-6 space-y-4 text-lg leading-8 text-slate-700">
              <p>Service descriptions provide useful starting points, but they do not make every property condition, product, or requested task appropriate for acceptance. XAREON GROUP reviews compatibility, access, concealed conditions, dependencies, and the intended finish before confirming work.</p>
              <p>Structural changes, permit-dependent work, major plumbing, new circuits, concealed wiring, gas work, and other specialized scopes are not assumed to be included. If a project requires work outside the accepted scope, that boundary should be identified before scheduling or as conditions become visible.</p>
            </div>
          </div>
        </section>

        <section className="py-16 text-center md:py-24" aria-labelledby="about-trust">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <a href={GOOGLE_BUSINESS_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-6 py-3 font-semibold text-blue-800 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"><span aria-hidden="true">★</span> 5-Star Rated on Google <ExternalLink aria-hidden="true" size={16} /></a>
            <h2 id="about-trust" className="mt-7 text-3xl font-bold md:text-4xl">Tell XAREON GROUP what your project needs</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">Share the location, property type, complete task list, photos, and product details available. The company will review the information and follow up about the appropriate scope.</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <TrackedEstimateLink href="/#contact" placement="about_final" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">Request a Free Estimate</TrackedEstimateLink>
              <TrackedPhoneLink placement="about_final" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-300 px-7 py-3 font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"><Phone aria-hidden="true" size={19} />Call {BUSINESS.telephoneDisplay}</TrackedPhoneLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
