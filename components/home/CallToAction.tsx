export default function CallToAction() {
  return (
    <section className="bg-blue-600 py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">

        <h2 className="text-4xl font-extrabold text-white md:text-5xl">
          Ready to Start Your Next Home Project?
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-blue-100 leading-8">
          Whether it's a small repair, TV mounting, smart home installation,
          painting, or a complete renovation, XAREON GROUP is here to help.
          Contact us today for a free estimate.
        </p>

        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">

          <a
            href="tel:+12022868497"
            className="rounded-xl bg-white px-8 py-4 text-lg font-bold text-blue-600 transition hover:scale-105"
          >
            📞 Call (202) 286-8497
          </a>

          <a
            href="#contact"
            className="rounded-xl border-2 border-white px-8 py-4 text-lg font-bold text-white transition hover:bg-white hover:text-blue-600"
          >
            Get Free Estimate
          </a>

        </div>

      </div>
    </section>
  );
}