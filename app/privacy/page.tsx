import Link from "next/link";
import { Mail, Phone } from "lucide-react";

import { TrackedEmailLink, TrackedEstimateLink, TrackedPhoneLink } from "@/components/analytics/TrackedLinks";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import JsonLd from "@/components/seo/JsonLd";
import { BUSINESS, createPublicPageMetadata } from "@/lib/site-metadata";
import { createPublicPageSchema } from "@/lib/structured-data";

const path = "/privacy";
const title = "Privacy Notice | XAREON GROUP";
const description =
  "Read how XAREON GROUP handles information submitted through its website estimate form and uses essential service, security, and measurement providers.";

export const metadata = createPublicPageMetadata({ path, title, description });

const structuredData = createPublicPageSchema({
  path,
  name: title,
  description,
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Privacy Notice", path },
  ],
});

const sections = [
  {
    id: "information-collected",
    title: "Information submitted with an estimate request",
    paragraphs: [
      "The website estimate form asks for a name, email address, telephone number, service category, property type, city, and project description. This information is used to create and review the request, communicate about the project, and coordinate possible next steps.",
      "Customers may optionally upload project photographs. The form accepts image files to help show the work area, visible conditions, products, or other details relevant to an estimate.",
    ],
  },
  {
    id: "avoid-sensitive-information",
    title: "Avoid unnecessary sensitive information",
    paragraphs: [
      "Only provide information reasonably needed to understand the project. Do not include passwords, payment-card information, government identification numbers, medical information, or other unnecessary sensitive details in descriptions, filenames, or photographs.",
      "Review photographs before uploading them and remove unrelated personal documents, screens, labels, or people when they are not needed to explain the requested work.",
    ],
  },
  {
    id: "storage-and-processing",
    title: "CRM, Supabase, email, and automation processing",
    paragraphs: [
      "A successful website request creates a lead record and related activity information in the XAREON GROUP CRM backed by Supabase. Submitted contact details, service and property information, city, project description, lead status, and references to uploaded files may be stored with that record.",
      "Uploaded project photographs are stored in a private Supabase storage bucket. The contact workflow also sends an internal estimate-request notification through the configured email service and may attach the submitted photographs to that notification.",
      "The existing automation system receives a lead-created event and may create an internal follow-up task or automation log. These operational steps support review and coordination of the request.",
    ],
  },
  {
    id: "security",
    title: "Security and operational processing",
    paragraphs: [
      "The form uses Cloudflare Turnstile to check whether a submission passes the website security verification. The verification token is sent to the website server and checked with Cloudflare before a lead record is created.",
      "The website and its service providers also process information needed to operate, secure, troubleshoot, and maintain the form, CRM, storage, email notifications, automations, and related website functions.",
    ],
  },
  {
    id: "measurement",
    title: "Google Analytics and Google Ads measurement",
    paragraphs: [
      "On approved public production pages, the website uses the existing Google tag to initialize Google Ads and, when configured, Google Analytics 4. The implementation records website and estimate-form interactions such as estimate CTA clicks, form starts, submissions, errors, successful requests, telephone or email clicks, and optional photo-upload counts.",
      "The Google Ads lead conversion is dispatched only after the website backend confirms that an estimate request was successfully accepted. The site does not initialize this marketing measurement on its private or operational routes, localhost, preview deployments, or unknown hosts.",
    ],
  },
  {
    id: "requests",
    title: "Access, correction, or deletion requests",
    paragraphs: [
      "To ask about personal information associated with a website request, or to request access, correction, or deletion, contact XAREON GROUP using the telephone number or email address below. Include enough information for the company to identify the relevant request without sending unnecessary sensitive information.",
      "A request will be reviewed against the information available and the operational records involved. This notice does not promise a particular completion time or automatic deletion of records that may still be needed for active service, security, financial, contractual, or other operational purposes.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="bg-white text-slate-900">
        <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 pb-20 pt-32 text-white md:pb-24 md:pt-40">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <nav aria-label="Breadcrumb" className="text-sm text-blue-200">
              <Link href="/" className="hover:text-white">Home</Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <span aria-current="page">Privacy Notice</span>
            </nav>
            <div className="mt-10 max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Privacy Notice</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">How website estimate information is handled</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">This notice describes the information flows currently used by the XAREON GROUP website estimate form and related website measurement, security, storage, email, and operational systems.</p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="privacy-overview">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <aside>
              <h2 id="privacy-overview" className="text-2xl font-bold">On this page</h2>
              <nav aria-label="Privacy notice sections" className="mt-5 flex flex-col gap-2">
                {sections.map((section) => <a key={section.id} href={`#${section.id}`} className="rounded-xl px-3 py-2 font-medium text-blue-700 hover:bg-blue-50 hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">{section.title}</a>)}
              </nav>
            </aside>
            <div className="min-w-0 space-y-12">
              {sections.map((section) => (
                <section key={section.id} aria-labelledby={section.id}>
                  <h2 id={section.id} className="scroll-mt-28 text-2xl font-bold md:text-3xl">{section.title}</h2>
                  <div className="mt-5 space-y-4 text-lg leading-8 text-slate-600">
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-16 text-white md:py-20" aria-labelledby="privacy-contact">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 id="privacy-contact" className="text-3xl font-bold md:text-4xl">Contact XAREON GROUP about your information</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">Use the existing business contact information for privacy questions or requests. Do not send passwords, identity documents, payment-card information, or other unnecessary sensitive material.</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <TrackedEmailLink placement="privacy_contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><Mail aria-hidden="true" size={19} />{BUSINESS.email}</TrackedEmailLink>
              <TrackedPhoneLink placement="privacy_contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-7 py-3 font-semibold text-white hover:bg-white hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><Phone aria-hidden="true" size={19} />Call {BUSINESS.telephoneDisplay}</TrackedPhoneLink>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-5 text-sm">
              <Link href="/about" className="font-semibold text-blue-300 hover:text-blue-200">About XAREON GROUP</Link>
              <Link href="/services" className="font-semibold text-blue-300 hover:text-blue-200">Services</Link>
              <TrackedEstimateLink href="/contact" placement="privacy_estimate" className="font-semibold text-blue-300 hover:text-blue-200">Contact and estimate form</TrackedEstimateLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
