import Link from "next/link";
import { CheckCircle2, MapPin, Phone } from "lucide-react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import JsonLd from "@/components/seo/JsonLd";
import { TrackedEstimateLink, TrackedPhoneLink } from "@/components/analytics/TrackedLinks";
import { phase2BServices } from "@/lib/services-phase-2b";
import { featuredServices } from "@/lib/services";
import { BUSINESS, createPublicPageMetadata } from "@/lib/site-metadata";
import { createPublicPageSchema } from "@/lib/structured-data";

const title = "Home Repair Services in Montgomery County, MD | XAREON GROUP";
const description =
  "Request home repair, painting, drywall, mounting, door, partition wall, and fixture installation services in Montgomery County, Maryland from XAREON GROUP.";

export const metadata = createPublicPageMetadata({
  path: "/service-areas/montgomery-county-md",
  title,
  description,
});

const structuredData = createPublicPageSchema({
  path: "/service-areas/montgomery-county-md",
  name: title,
  description,
  spatialCoverage: "Montgomery County, Maryland",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Service Areas", path: "/service-areas" },
    { name: "Montgomery County, MD", path: "/service-areas/montgomery-county-md" },
  ],
});

const services = [...featuredServices, ...phase2BServices];

const projectTypes = [
  "Repairing localized wall or ceiling drywall damage",
  "Preparing and painting interior rooms and connected spaces",
  "Combining several smaller repairs into one organized request",
  "Mounting TVs and compatible wall-mounted accessories",
  "Adjusting or replacing appropriate interior doors and hardware",
  "Creating suitable non-load-bearing interior partitions",
  "Installing compatible customer-provided fixtures and accessories",
];

const processSteps = [
  { title: "Describe the project", text: "Identify the requested work, property type, and Montgomery County community." },
  { title: "Share useful details", text: "Add photos, dimensions, product information, and access details when available." },
  { title: "Scope is reviewed", text: "XAREON GROUP reviews the location and project details and follows up as needed." },
  { title: "Receive an estimate", text: "The estimate defines the work that can be included before scheduling." },
  { title: "Schedule the work", text: "Once the scope is accepted, the project can move to scheduling and completion." },
];

const communities = [
  "Olney",
  "Rockville",
  "Silver Spring",
  "Bethesda",
  "Gaithersburg",
  "Potomac",
  "Wheaton",
  "Kensington",
  "Chevy Chase",
  "Germantown",
];

const faqs = [
  {
    question: "Does XAREON GROUP serve my area in Montgomery County?",
    answer: "XAREON GROUP reviews requests from communities throughout Montgomery County, including the examples listed on this page. Include your exact city and project location so coverage can be confirmed with the requested scope.",
  },
  {
    question: "What services can I request in Montgomery County?",
    answer: "Requests may include drywall repair, interior painting, general home repairs, TV mounting, interior door installation or repair, appropriate non-load-bearing partition walls, and compatible fixture installation. Each linked service page explains its scope and limitations.",
  },
  {
    question: "Can I send project photos with my estimate request?",
    answer: "Yes. Wide photos of the space and close photos of each repair or installation area help communicate condition, access, size, and the relationship between project items.",
  },
  {
    question: "Can I combine several smaller repairs into one request?",
    answer: "Yes. Use General Home Repairs as a starting point and provide a numbered list with a short description and photo for each task so the full scope can be reviewed together.",
  },
  {
    question: "Do you work with homeowners and businesses?",
    answer: "Yes. The existing estimate workflow accepts residential and commercial project requests. Identify the property type and any access or scheduling considerations in your submission.",
  },
  {
    question: "How do I request an estimate?",
    answer: "Use the existing estimate form, select the closest service category, provide your contact and project details, and attach photos when available. XAREON GROUP will review the request and follow up about the scope.",
  },
  {
    question: "What if my project involves structural, electrical, or plumbing work?",
    answer: "Describe the exact work without assuming it falls within ordinary repair scope. Load-bearing modifications, new wiring, circuits, major plumbing changes, or other regulated work may require separate evaluation, qualified trades, permits, or approvals.",
  },
];

export default function MontgomeryCountyPage() {
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
              <Link href="/service-areas" className="hover:text-white">Service Areas</Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <span aria-current="page">Montgomery County, MD</span>
            </nav>
            <div className="mt-10 max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Montgomery County, Maryland</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">Home repair and installation services in Montgomery County, MD</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">Practical help for drywall, painting, mounting, doors, fixtures, interior partitions, and grouped repair projects for homes and appropriate business spaces.</p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <TrackedEstimateLink href="/#contact" placement="montgomery_county_hero" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Get a Free Estimate</TrackedEstimateLink>
                <TrackedPhoneLink placement="montgomery_county_hero" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-7 py-3 font-semibold text-white transition hover:bg-white hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><Phone aria-hidden="true" size={19} />Call {BUSINESS.telephoneDisplay}</TrackedPhoneLink>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="local-overview">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Local service overview</p>
              <h2 id="local-overview" className="mt-3 text-3xl font-bold md:text-4xl">A useful starting point for Montgomery County projects</h2>
              <div className="mt-6 space-y-5 text-lg leading-8 text-slate-600">
                <p>XAREON GROUP reviews repair, installation, painting, and finishing requests from homeowners, property customers, and businesses across Montgomery County. The goal is to understand the complete project rather than force every request into a single category.</p>
                <p>Some customers need one focused service. Others have a list of smaller tasks or a project that combines preparation, repair, and finishing. Clear descriptions and photos help determine which work fits the current service scope.</p>
              </div>
            </div>
            <aside className="rounded-3xl border border-blue-100 bg-blue-50 p-7 md:p-9">
              <h2 className="text-2xl font-bold">Details that help with review</h2>
              <ul className="mt-6 space-y-4 text-slate-700">
                {["Your Montgomery County community", "Residential or commercial property type", "A list of every requested task", "Wide and close project photos", "Relevant dimensions or product details"].map((item) => (
                  <li key={item} className="flex gap-3"><CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-blue-600" size={21} /><span>{item}</span></li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-24" aria-labelledby="available-services">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Available services</p>
            <h2 id="available-services" className="mt-3 max-w-3xl text-3xl font-bold md:text-4xl">Choose the service closest to your project</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">Each page explains common projects, estimate details, and important scope boundaries. For a mixed task list, start with General Home Repairs.</p>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article key={service.path} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold">{service.name}</h3>
                  <p className="mt-3 flex-1 leading-7 text-slate-600">{service.heroCopy}</p>
                  <Link href={service.path} className="mt-5 inline-flex min-h-11 items-center font-semibold text-blue-700 hover:text-blue-900">Explore {service.name}</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="common-projects">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Common project types</p>
            <h2 id="common-projects" className="mt-3 text-3xl font-bold md:text-4xl">Focused work and coordinated repair lists</h2>
            <ul className="mt-10 grid gap-5 md:grid-cols-2">
              {projectTypes.map((project) => (
                <li key={project} className="flex gap-3 rounded-2xl border border-slate-200 p-5"><CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-blue-600" size={21} /><span className="leading-7 text-slate-700">{project}</span></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-slate-950 py-16 text-white md:py-24" aria-labelledby="estimate-process">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Estimate process</p>
            <h2 id="estimate-process" className="mt-3 text-3xl font-bold md:text-4xl">What happens after you share the project</h2>
            <ol className="mt-10 grid gap-5 md:grid-cols-5">
              {processSteps.map((step, index) => (
                <li key={step.title} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10"><span className="text-sm font-bold text-blue-300">STEP {index + 1}</span><h3 className="mt-3 font-bold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{step.text}</p></li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="why-xareon-local">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Why XAREON GROUP</p>
              <h2 id="why-xareon-local" className="mt-3 text-3xl font-bold md:text-4xl">A scope-led approach to local service</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">The estimate process is built around clear project information, practical communication, professional workmanship, attention to detail, and clean completion of the agreed work area.</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Communities served</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Across Montgomery County</h2>
              <p className="mt-5 leading-7 text-slate-600">Examples include the communities below. These are service-area references, not office locations or separate landing pages.</p>
              <ul className="mt-6 flex flex-wrap gap-3">
                {communities.map((community) => <li key={community} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 font-medium"><MapPin aria-hidden="true" className="text-blue-600" size={17} />{community}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-24" aria-labelledby="local-faqs">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Frequently asked questions</p>
            <h2 id="local-faqs" className="mt-3 text-3xl font-bold md:text-4xl">Planning service in Montgomery County</h2>
            <div className="mt-10 space-y-4">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white p-6"><summary className="cursor-pointer list-none font-bold marker:hidden">{faq.question}</summary><p className="mt-4 leading-7 text-slate-600">{faq.answer}</p></details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 text-center md:py-24" aria-labelledby="county-final-cta">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 id="county-final-cta" className="text-3xl font-bold md:text-4xl">Ready to discuss your Montgomery County project?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">Share the location, requested work, and photos when available. You can also review the broader <Link href="/service-areas" className="font-semibold text-blue-700 hover:text-blue-900">XAREON GROUP service area</Link>.</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <TrackedEstimateLink href="/#contact" placement="montgomery_county_final" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700">Request a Free Estimate</TrackedEstimateLink>
              <TrackedPhoneLink placement="montgomery_county_final" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-300 px-7 py-3 font-semibold text-slate-700 hover:bg-slate-50"><Phone aria-hidden="true" size={19} />Call {BUSINESS.telephoneDisplay}</TrackedPhoneLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
