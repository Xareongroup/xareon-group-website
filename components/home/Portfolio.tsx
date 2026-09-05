import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { TrackedEstimateLink } from "@/components/analytics/TrackedLinks";
import { wholeHomeRestorationProject as project } from "@/lib/projects";

export default function Portfolio() {
  return (
    <section id="projects" className="bg-white py-16 md:py-24" aria-labelledby="featured-home-project">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative aspect-[4/3] min-h-72 lg:aspect-auto">
            <Image src={project.heroImage.src} alt={project.heroImage.alt} fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-300">Featured project · Montgomery County</p>
            <h2 id="featured-home-project" className="mt-4 text-3xl font-bold leading-tight md:text-4xl">One whole-home restoration, coordinated from preparation through finish work</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">{project.summary}</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {["Kitchen and bathroom improvements", "Walls, ceilings, paint, and flooring", "Stair and decorative finish work", "Doors, partitions, mounting, and sunshades"].map((item) => <li key={item} className="flex gap-2 text-sm text-slate-200"><CheckCircle2 aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-blue-400" />{item}</li>)}
            </ul>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href={project.path} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">View the project <ArrowRight aria-hidden="true" size={18} /></Link>
              <TrackedEstimateLink href="/contact" placement="homepage_featured_project" className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Request an Estimate</TrackedEstimateLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
