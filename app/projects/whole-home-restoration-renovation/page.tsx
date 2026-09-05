import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MapPin, Phone } from "lucide-react";

import { TrackedEstimateLink, TrackedPhoneLink } from "@/components/analytics/TrackedLinks";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import JsonLd from "@/components/seo/JsonLd";
import { wholeHomeRestorationProject as project } from "@/lib/projects";
import { absoluteUrl, BUSINESS, createPublicPageMetadata } from "@/lib/site-metadata";
import { createPublicPageSchema } from "@/lib/structured-data";

export const metadata = createPublicPageMetadata({
  path: project.path,
  title: project.title,
  description: project.description,
});

const structuredData = createPublicPageSchema({
  path: project.path,
  name: project.title,
  description: project.description,
  spatialCoverage: project.location,
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: project.h1, path: project.path },
  ],
});

const pageNode = structuredData["@graph"].find((node) => node["@id"] === `${absoluteUrl(project.path)}#webpage`);
const imageNodes = project.images.map((image, index) => ({
  "@type": "ImageObject",
  "@id": `${absoluteUrl(project.path)}#image-${index + 1}`,
  contentUrl: absoluteUrl(image.src),
  width: image.width,
  height: image.height,
  caption: image.caption,
}));
if (pageNode) {
  pageNode.primaryImageOfPage = { "@id": imageNodes[3]["@id"] };
  pageNode.image = imageNodes.map((image) => ({ "@id": image["@id"] }));
}
structuredData["@graph"].push(...imageNodes);

const kitchenImages = project.images.slice(0, 5);
const stairImages = project.images.slice(5, 9);
const finishingImages = project.images.slice(9);

function ImageCard({ image, featured = false }: { image: (typeof project.images)[number]; featured?: boolean }) {
  const isPortrait = image.height > image.width;

  return (
    <figure className={`self-start overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm ${featured ? "md:col-span-2" : ""}`}>
      <div className={`relative ${featured ? "aspect-[16/9]" : isPortrait ? "aspect-[4/5] md:aspect-[3/4]" : "aspect-[4/3]"}`}>
        <Image src={image.src} alt={image.alt} fill sizes={featured ? "(max-width: 768px) 100vw, 80vw" : "(max-width: 768px) 100vw, 50vw"} className="object-cover" />
        <span className="absolute left-4 top-4 rounded-full bg-slate-950/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">{image.stage}</span>
      </div>
      <figcaption className="p-5 text-sm leading-6 text-slate-600">{image.caption}</figcaption>
    </figure>
  );
}

export default function WholeHomeRestorationPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="bg-white text-slate-900">
        <section className="bg-slate-950 pb-16 pt-32 text-white md:pb-24 md:pt-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <nav aria-label="Breadcrumb" className="text-sm text-blue-200"><Link href="/" className="hover:text-white">Home</Link><span aria-hidden="true" className="mx-2">/</span><Link href="/projects" className="hover:text-white">Projects</Link><span aria-hidden="true" className="mx-2">/</span><span aria-current="page">Whole-Home Restoration and Renovation</span></nav>
            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Featured Montgomery County project</p>
                <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">{project.h1}</h1>
                <p className="mt-6 text-lg leading-8 text-slate-200 md:text-xl">{project.summary}</p>
                <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"><MapPin aria-hidden="true" size={17} />{project.location}</span><span className="rounded-full bg-white/10 px-4 py-2">Completed project</span></div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
                <Image src={project.heroImage.src} alt={project.heroImage.alt} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="project-overview">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Project overview</p>
              <h2 id="project-overview" className="mt-3 text-3xl font-bold md:text-4xl">One coordinated plan for the home’s interior</h2>
              <div className="mt-6 space-y-5 text-lg leading-8 text-slate-600">
                <p>The goal was to repair extensive interior damage and renew the home’s interior. Rather than presenting the work as unrelated jobs, XAREON GROUP coordinated and completed the project as one connected scope.</p>
                <p>Preparation, repairs, room upgrades, installations, painting, flooring, stair work, and finishing details were managed with the relationship between each phase in view.</p>
              </div>
            </div>
            <aside className="rounded-3xl border border-blue-100 bg-blue-50 p-7 md:p-9">
              <h2 className="text-2xl font-bold">Verified project facts</h2>
              <dl className="mt-6 space-y-5">
                <div><dt className="text-sm font-bold uppercase tracking-[0.15em] text-blue-700">Location</dt><dd className="mt-1 text-slate-700">{project.location}</dd></div>
                <div><dt className="text-sm font-bold uppercase tracking-[0.15em] text-blue-700">Goal</dt><dd className="mt-1 text-slate-700">{project.goal}</dd></div>
                <div><dt className="text-sm font-bold uppercase tracking-[0.15em] text-blue-700">Approach</dt><dd className="mt-1 text-slate-700">A coordinated whole-home scope completed by XAREON GROUP.</dd></div>
              </dl>
            </aside>
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-24" aria-labelledby="project-phases">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Coordinated phases</p>
            <h2 id="project-phases" className="mt-3 max-w-3xl text-3xl font-bold md:text-4xl">Repairs, renovations, and finishing details brought together</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {project.phases.map((phase, index) => <article key={phase.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"><span className="text-sm font-bold text-blue-600">PHASE {index + 1}</span><h3 className="mt-3 text-2xl font-bold">{phase.title}</h3><p className="mt-4 leading-7 text-slate-600">{phase.description}</p></article>)}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="kitchen-gallery">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Before, progress, and completed work</p>
            <h2 id="kitchen-gallery" className="mt-3 text-3xl font-bold md:text-4xl">Kitchen demolition and renovation</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">The documented sequence shows the kitchen before work, during demolition and preparation, and after the renovation and finish work were completed.</p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">{kitchenImages.map((image, index) => <ImageCard key={image.src} image={image} featured={index >= 3} />)}</div>
          </div>
        </section>

        <section className="bg-slate-950 py-16 text-white md:py-24" aria-labelledby="stair-gallery">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Connected finishes</p>
            <h2 id="stair-gallery" className="mt-3 text-3xl font-bold md:text-4xl">Staircase and hallway renewal</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Repair and staining at the staircase connected with the surrounding flooring, painting, and hallway finish work.</p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">{stairImages.map((image) => <ImageCard key={image.src} image={image} />)}</div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="finishing-gallery">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Completed interiors</p>
            <h2 id="finishing-gallery" className="mt-3 text-3xl font-bold md:text-4xl">Flooring, bathroom, and entertainment-wall details</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">These photographs document selected areas of the project. The completed written scope also included basement partition construction, interior-door installation, wall and ceiling repairs, whole-home painting, decorative finish work, and interior sunshades.</p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">{finishingImages.map((image) => <ImageCard key={image.src} image={image} />)}</div>
          </div>
        </section>

        <section className="bg-blue-50 py-16 md:py-24" aria-labelledby="completed-scope">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Completed scope</p>
            <h2 id="completed-scope" className="mt-3 text-3xl font-bold md:text-4xl">The work included across the home</h2>
            <ul className="mt-10 grid gap-4 md:grid-cols-2">
              {project.completedScope.map((item) => <li key={item} className="flex gap-3 rounded-2xl bg-white p-5 shadow-sm"><CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-blue-600" size={21} /><span className="leading-7 text-slate-700">{item}</span></li>)}
            </ul>
            <p className="mt-7 text-sm leading-6 text-slate-600">The gallery documents selected portions of the project and is not intended to show every completed item.</p>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="project-links">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Related services</p><h2 id="project-links" className="mt-3 text-3xl font-bold md:text-4xl">Plan the parts of your project</h2></div><Link href="/services" className="font-semibold text-blue-700 hover:text-blue-900">View all services</Link></div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{project.relatedServices.map((service) => <Link key={service.href} href={service.href} className="rounded-2xl border border-slate-200 p-5 font-semibold text-slate-800 transition hover:border-blue-300 hover:text-blue-700 hover:shadow-md">{service.name}</Link>)}</div>
            <p className="mt-8 flex flex-wrap gap-x-6 gap-y-3"><Link href="/projects" className="font-semibold text-blue-700 hover:text-blue-900">All projects</Link><Link href="/about" className="font-semibold text-blue-700 hover:text-blue-900">About XAREON GROUP</Link><Link href="/service-areas" className="font-semibold text-blue-700 hover:text-blue-900">Service areas</Link><Link href="/service-areas/montgomery-county-md" className="font-semibold text-blue-700 hover:text-blue-900">Montgomery County services</Link></p>
          </div>
        </section>

        <section className="bg-blue-600 py-16 text-white md:py-20" aria-labelledby="project-cta">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6"><h2 id="project-cta" className="text-3xl font-bold md:text-4xl">Tell us about your complete project scope</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">Share the rooms, repairs, installations, and finish work you want reviewed together.</p><div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row"><TrackedEstimateLink href="/contact" placement="project_detail" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-white px-7 py-3 font-semibold text-blue-700 hover:bg-slate-100">Request a Free Estimate</TrackedEstimateLink><TrackedPhoneLink placement="project_detail" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white px-7 py-3 font-semibold text-white hover:bg-white hover:text-blue-700"><Phone aria-hidden="true" size={19} />Call {BUSINESS.telephoneDisplay}</TrackedPhoneLink></div></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
