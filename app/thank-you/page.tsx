import Link from "next/link";
import { CheckCircle2, Phone } from "lucide-react";

import { TrackedPhoneLink } from "@/components/analytics/TrackedLinks";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { BUSINESS } from "@/lib/site-metadata";

export const metadata = {
  title: { absolute: "Thank You | XAREON GROUP" },
  description: "Your estimate request has been received by XAREON GROUP.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[75vh] items-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 pb-20 pt-32 text-white md:pt-40">
        <section className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-sm md:p-12" aria-labelledby="thank-you-title">
          <CheckCircle2 aria-hidden="true" className="mx-auto text-blue-400" size={58} />
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Request received</p>
          <h1 id="thank-you-title" className="mt-4 text-4xl font-extrabold md:text-5xl">Thank you for contacting XAREON GROUP</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-200">Your estimate request has been received. The team will review the project information and may contact you using the details you provided if clarification or next steps are needed.</p>
          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/services" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700">Review Our Services</Link>
            <TrackedPhoneLink placement="thank_you" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/30 px-7 py-3 font-semibold text-white hover:bg-white hover:text-slate-950"><Phone aria-hidden="true" size={19} />Call {BUSINESS.telephoneDisplay}</TrackedPhoneLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
