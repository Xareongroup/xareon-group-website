import Link from "next/link";
import { CheckCircle2, ExternalLink, MapPin, Phone } from "lucide-react";

import { TrackedEstimateLink, TrackedPhoneLink } from "@/components/analytics/TrackedLinks";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import JsonLd from "@/components/seo/JsonLd";
import {
  BUSINESS,
  GOOGLE_BUSINESS_PROFILE_URL,
  createPublicPageMetadata,
} from "@/lib/site-metadata";
import { createPublicPageSchema } from "@/lib/structured-data";

const path = "/service-areas/howard-county-md";
const title = "Home Repair Services in Howard County, MD | XAREON GROUP";
const description =
  "Request home repair, painting, mounting, assembly, smart-home, fixture, kitchen, and bathroom improvement services in Howard County, Maryland.";

export const metadata = createPublicPageMetadata({ path, title, description });

const structuredData = createPublicPageSchema({
  path,
  name: title,
  description,
  spatialCoverage: "Howard County, Maryland",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Service Areas", path: "/service-areas" },
    { name: "Howard County, MD", path },
  ],
});

const communities = [
  "Columbia",
  "Ellicott City",
  "Elkridge",
  "Clarksville",
  "Fulton",
  "Laurel",
  "Savage",
  "Jessup",
  "Woodbine",
];

const services = [
  {
    name: "General Home Repairs",
    href: "/services/general-home-repairs",
    description: "Organize a mixed list of practical repairs, adjustments, mounting, and installation tasks.",
  },
  {
    name: "Drywall Repair",
    href: "/services/drywall-repair",
    description: "Repair appropriate holes, dents, cracks, access openings, and localized wall or ceiling damage.",
  },
  {
    name: "Interior Painting",
    href: "/services/interior-painting",
    description: "Refresh rooms and connected interior spaces with preparation and careful finishing.",
  },
  {
    name: "Furniture Assembly",
    href: "/services/furniture-assembly",
    description: "Assemble compatible household, storage, office, and fitness furniture, including multi-item projects.",
  },
  {
    name: "TV Mounting",
    href: "/services/tv-mounting",
    description: "Plan compatible TV mounting with reviewed placement, wall conditions, and hardware.",
  },
  {
    name: "Smart Home Installation",
    href: "/services/smart-home-installation",
    description: "Install and complete basic setup for compatible customer-provided smart-home devices.",
  },
  {
    name: "Fixture Installation",
    href: "/services/fixture-installation",
    description: "Install compatible mirrors, shelving, curtain rods, accessories, and replacement fixtures.",
  },
  {
    name: "Kitchen Installation",
    href: "/services/kitchen-installation",
    description: "Complete defined kitchen component, cabinet, hardware, trim, wall, and finish work.",
  },
  {
    name: "Bathroom Improvements",
    href: "/services/bathroom-improvements",
    description: "Address appropriate cosmetic repairs, painting, trim, accessories, and finish improvements.",
  },
];

const projectTypes = [
  "Preparing rooms with localized drywall repair followed by interior painting",
  "Assembling several furniture pieces for a move, home office, or newly furnished room",
  "Mounting TVs, shelves, mirrors, and compatible household accessories",
  "Adjusting interior doors, replacing ordinary hardware, and completing related trim details",
  "Installing compatible smart-home devices at suitable existing locations",
  "Coordinating a documented list of smaller repairs and installations in one estimate request",
  "Completing defined kitchen or bathroom component and finish improvements",
  "Building appropriate non-load-bearing interior partitions with drywall and finish work",
];

const processSteps = [
  {
    title: "Identify the location",
    text: "Share the Howard County address or nearby Laurel or Jessup location so coverage can be confirmed.",
  },
  {
    title: "Document the work",
    text: "List each requested task and include clear photos, dimensions, and product information when available.",
  },
  {
    title: "Review the scope",
    text: "XAREON GROUP reviews site details, compatibility, access, and any specialty-trade boundaries.",
  },
  {
    title: "Approve the estimate",
    text: "The written estimate identifies the accepted work before a project moves into scheduling.",
  },
  {
    title: "Complete the project",
    text: "The team schedules and completes the agreed scope with clear communication and attention to the work area.",
  },
];

const faqs = [
  {
    question: "Which Howard County communities does XAREON GROUP regularly serve?",
    answer:
      "Regular coverage includes Columbia, Ellicott City, Elkridge, Clarksville, Fulton, Savage, Woodbine, and covered portions of Laurel and Jessup. Submit the exact project address because municipal names and county boundaries do not always align.",
  },
  {
    question: "Does listing Laurel or Jessup mean every address in those cities is covered?",
    answer:
      "No. Laurel and Jessup cross county boundaries. XAREON GROUP serves Howard County and nearby portions of Laurel and Jessup that fall within our coverage area. The exact address and project scope are reviewed before service is confirmed.",
  },
  {
    question: "What kinds of Howard County projects can I request?",
    answer:
      "Common requests include general home repairs, drywall repair, interior painting, furniture assembly, TV mounting, compatible smart-home and fixture installation, door work, and defined kitchen or bathroom improvements. The linked service pages explain the scope of each category.",
  },
  {
    question: "Can several repairs or installations be included in one request?",
    answer:
      "Yes. Choose General Home Repairs when the project includes a mixed task list, then number each item and attach a wide photo plus a close photo where useful. This helps the complete scope be reviewed together.",
  },
  {
    question: "Are structural, plumbing, and electrical projects automatically included?",
    answer:
      "No. Load-bearing changes, concealed wiring, new circuits, major plumbing, gas work, permit-dependent work, and other regulated or specialized work require separate evaluation and may require appropriately qualified professionals.",
  },
  {
    question: "What information helps produce an accurate estimate?",
    answer:
      "Provide the exact location, property type, a complete task list, photos of each work area, approximate dimensions, product links or model numbers, and any access or scheduling considerations.",
  },
];

export default function HowardCountyPage() {
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
              <Link href="/service-areas" className="hover:text-white">Service Areas</Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <span aria-current="page">Howard County, MD</span>
            </nav>
            <div className="mt-10 max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Howard County, Maryland</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">Home repair and installation services in Howard County, MD</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">Practical, clearly scoped support for repairs, painting, mounting, assembly, installations, and selected room-improvement projects across our regular Howard County service area.</p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <TrackedEstimateLink href="/#contact" placement="howard_county_hero" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Get a Free Estimate</TrackedEstimateLink>
                <TrackedPhoneLink placement="howard_county_hero" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-7 py-3 font-semibold text-white transition hover:bg-white hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><Phone aria-hidden="true" size={19} />Call {BUSINESS.telephoneDisplay}</TrackedPhoneLink>
              </div>
              <a href={GOOGLE_BUSINESS_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-5 py-2 font-semibold text-blue-100 transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                <span aria-hidden="true">★</span> 5-Star Rated on Google <ExternalLink aria-hidden="true" size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="howard-overview">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Howard County service</p>
              <h2 id="howard-overview" className="mt-3 text-3xl font-bold md:text-4xl">Project help shaped around the property and the full task list</h2>
              <div className="mt-6 space-y-5 text-lg leading-8 text-slate-600">
                <p>Howard County homes and business spaces range from established properties needing careful repairs to newer spaces that need mounting, assembly, hardware, or finish work. XAREON GROUP begins by reviewing the actual conditions and intended result.</p>
                <p>A request may focus on one defined service or combine several compatible tasks. Photos, dimensions, product details, and a complete list make it easier to identify dependencies and set appropriate scope boundaries before scheduling.</p>
              </div>
            </div>
            <aside className="rounded-3xl border border-blue-100 bg-blue-50 p-7 md:p-9">
              <h2 className="text-2xl font-bold">Helpful details for a local estimate</h2>
              <ul className="mt-6 space-y-4 text-slate-700">
                {["The complete project address", "Residential or commercial property type", "A numbered list of requested tasks", "Wide and close photos of each area", "Measurements and customer-provided product details"].map((item) => (
                  <li key={item} className="flex gap-3"><CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-blue-600" size={21} /><span>{item}</span></li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-24" aria-labelledby="howard-services">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Common service types</p>
            <h2 id="howard-services" className="mt-3 max-w-3xl text-3xl font-bold md:text-4xl">Detailed guidance for Howard County project planning</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">Choose the closest service for examples, estimate requirements, and limitations. Use General Home Repairs when several compatible tasks belong in one request.</p>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article key={service.href} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold">{service.name}</h3>
                  <p className="mt-3 flex-1 leading-7 text-slate-600">{service.description}</p>
                  <Link href={service.href} className="mt-5 inline-flex min-h-11 items-center font-semibold text-blue-700 hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">Explore {service.name}</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="howard-projects">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Project examples</p>
            <h2 id="howard-projects" className="mt-3 text-3xl font-bold md:text-4xl">Focused services and coordinated improvements</h2>
            <ul className="mt-10 grid gap-5 md:grid-cols-2">
              {projectTypes.map((project) => (
                <li key={project} className="flex gap-3 rounded-2xl border border-slate-200 p-5"><CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-blue-600" size={21} /><span className="leading-7 text-slate-700">{project}</span></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-slate-950 py-16 text-white md:py-24" aria-labelledby="howard-process">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Service process</p>
            <h2 id="howard-process" className="mt-3 text-3xl font-bold md:text-4xl">From project details to an agreed scope</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Every request is reviewed for location, existing conditions, compatible products, access, and the boundaries of the work XAREON GROUP can appropriately accept.</p>
            <ol className="mt-10 grid gap-5 md:grid-cols-5">
              {processSteps.map((step, index) => (
                <li key={step.title} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10"><span className="text-sm font-bold text-blue-300">STEP {index + 1}</span><h3 className="mt-3 font-bold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{step.text}</p></li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="howard-communities">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Regular coverage</p>
              <h2 id="howard-communities" className="mt-3 text-3xl font-bold md:text-4xl">Communities in and around Howard County</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">XAREON GROUP regularly serves Howard County and nearby portions of Laurel and Jessup that fall within our coverage area. Because those community names cross county boundaries, submit the exact address so coverage can be confirmed.</p>
            </div>
            <div>
              <p className="leading-7 text-slate-600">Regularly served communities include:</p>
              <ul className="mt-6 flex flex-wrap gap-3">
                {communities.map((community) => <li key={community} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 font-medium"><MapPin aria-hidden="true" className="text-blue-600" size={17} />{community}</li>)}
              </ul>
              <p className="mt-6 text-sm leading-6 text-slate-500">Community names describe service coverage and are not office locations or separate landing pages.</p>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 py-16 md:py-20" aria-labelledby="scope-boundaries">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Scope boundaries</p>
            <h2 id="scope-boundaries" className="mt-3 text-3xl font-bold md:text-4xl">The accepted estimate defines the work</h2>
            <div className="mt-6 space-y-4 text-lg leading-8 text-slate-700">
              <p>XAREON GROUP reviews each request before confirming service. Product compatibility, wall and surface conditions, concealed conditions, property access, and any required permits or specialty trades can affect what is appropriate.</p>
              <p>Load-bearing changes, structural engineering, new circuits, concealed rewiring, major plumbing, gas work, and other regulated work are not assumed to be included. When a project depends on specialized or licensed work, that boundary is identified during scope review.</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-24" aria-labelledby="howard-faqs">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Frequently asked questions</p>
            <h2 id="howard-faqs" className="mt-3 text-3xl font-bold md:text-4xl">Planning home service in Howard County</h2>
            <div className="mt-10 space-y-4">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white p-6"><summary className="cursor-pointer list-none pr-6 font-bold marker:hidden">{faq.question}</summary><p className="mt-4 leading-7 text-slate-600">{faq.answer}</p></details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 text-center md:py-24" aria-labelledby="howard-final-cta">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 id="howard-final-cta" className="text-3xl font-bold md:text-4xl">Ready to discuss your Howard County project?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">Share the exact location, complete task list, and project photos. You can also compare coverage on the <Link href="/service-areas" className="font-semibold text-blue-700 hover:text-blue-900">service-area hub</Link>.</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <TrackedEstimateLink href="/#contact" placement="howard_county_final" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">Request a Free Estimate</TrackedEstimateLink>
              <TrackedPhoneLink placement="howard_county_final" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-300 px-7 py-3 font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"><Phone aria-hidden="true" size={19} />Call {BUSINESS.telephoneDisplay}</TrackedPhoneLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
