import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";

import { TrackedEstimateLink, TrackedPhoneLink } from "@/components/analytics/TrackedLinks";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import JsonLd from "@/components/seo/JsonLd";
import { wholeHomeRestorationProject } from "@/lib/projects";
import { BUSINESS, createPublicPageMetadata } from "@/lib/site-metadata";
import { createPublicPageSchema } from "@/lib/structured-data";

const path = "/projects";
const title = "Home Improvement Projects | XAREON GROUP";
const description = "Explore genuine XAREON GROUP home improvement work, beginning with a coordinated whole-home restoration and renovation in Montgomery County, Maryland.";

export const metadata = createPublicPageMetadata({ path, title, description });

const structuredData = createPublicPageSchema({
  path,
  name: title,
  description,
  type: "CollectionPage",
  breadcrumbs: [{ name: "Home", path: "/" }, { name: "Projects", path }],
});

export default function ProjectsPage() {
  const project = wholeHomeRestorationProject;
  return (
    <>
      <JsonLd data={structuredData} />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="bg-white text-slate-900">
        <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 pb-20 pt-32 text-white md:pb-24 md:pt-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <nav aria-label="Breadcrumb" className="text-sm text-blue-200"><Link href="/" className="hover:text-white">Home</Link><span aria-hidden="true" className="mx-2">/</span><span aria-current="page">Projects</span></nav>
            <div className="mt-10 max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Completed work</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">Home improvement projects coordinated as a complete scope</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">See how repair, installation, renovation, and finishing work can come together across a connected home improvement project.</p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="featured-project">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative aspect-[4/3] min-h-72 lg:aspect-auto">
                <Image src={project.heroImage.src} alt={project.heroImage.alt} fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
              </div>
              <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Featured project · {project.location}</p>
                <h2 id="featured-project" className="mt-3 text-3xl font-bold md:text-4xl">{project.h1}</h2>
                <p className="mt-5 text-lg leading-8 text-slate-600">{project.summary}</p>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {project.phases.map((phase) => <li key={phase.title} className="flex gap-2 text-sm font-medium text-slate-700"><CheckCircle2 aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-blue-600" />{phase.title}</li>)}
                </ul>
                <Link href={project.path} className="mt-8 inline-flex min-h-12 items-center gap-2 self-start rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">View the complete project <ArrowRight aria-hidden="true" size={18} /></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-16 text-white md:py-20" aria-labelledby="projects-cta">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 id="projects-cta" className="text-3xl font-bold md:text-4xl">Planning a coordinated home project?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">Share the complete task list and available photos so XAREON GROUP can review the requested scope.</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <TrackedEstimateLink href="/contact" placement="projects_hub" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700">Request a Free Estimate</TrackedEstimateLink>
              <TrackedPhoneLink placement="projects_hub" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/30 px-7 py-3 font-semibold text-white hover:bg-white hover:text-slate-950"><Phone aria-hidden="true" size={19} />Call {BUSINESS.telephoneDisplay}</TrackedPhoneLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
