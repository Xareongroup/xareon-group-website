import Script from "next/script";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pb-16 pt-28 md:pt-36">
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
              XAREON GROUP
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Home Service Insights
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Practical guides, project inspiration, and professional home service advice.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div id="soro-blog" />
          </div>
        </section>
      </main>
      <Footer />
      <Script
        id="soro-blog-widget"
        src="https://app.trysoro.com/api/embed/676f94d-c8e0-45f5-bb6f-0b80798f1ab2"
        strategy="afterInteractive"
      />
    </>
  );
}
