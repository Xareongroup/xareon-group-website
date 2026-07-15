"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-slate-900 py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Heading */}

        <div className="text-center">

          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400 md:text-sm">
            Contact Us
          </span>

          <h2 className="mt-4 text-3xl font-bold text-white md:text-5xl">
            Let's Get Your Project Started
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 md:mt-6 md:text-lg">
            Whether it's a small repair, TV mounting, furniture assembly,
            smart home installation, or general handyman services,
            we're ready to help.
          </p>

        </div>

        {/* Contact Cards */}

        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-4">

          <a
            href="tel:+12022868497"
            className="rounded-3xl bg-slate-800 p-6 transition-all duration-300 hover:-translate-y-2 hover:bg-blue-600"
          >
            <Phone className="mb-5 h-10 w-10 text-blue-400" />

            <h3 className="text-xl font-bold text-white">
              Call
            </h3>

            <p className="mt-3 text-slate-300">
              (202) 286-8497
            </p>
          </a>

          <a
            href="mailto:info@xareongroup.com"
            className="rounded-3xl bg-slate-800 p-6 transition-all duration-300 hover:-translate-y-2 hover:bg-blue-600"
          >
            <Mail className="mb-5 h-10 w-10 text-blue-400" />

            <h3 className="text-xl font-bold text-white">
              Email
            </h3>

            <p className="mt-3 break-all text-slate-300">
              info@xareongroup.com
            </p>
          </a>

          <div className="rounded-3xl bg-slate-800 p-6">
            <MapPin className="mb-5 h-10 w-10 text-blue-400" />

            <h3 className="text-xl font-bold text-white">
              Service Area
            </h3>

            <p className="mt-3 text-slate-300">
              Maryland
              <br />
              Washington DC
              <br />
              Northern Virginia
            </p>
          </div>

          <div className="rounded-3xl bg-slate-800 p-6">
            <Clock className="mb-5 h-10 w-10 text-blue-400" />

            <h3 className="text-xl font-bold text-white">
              Hours
            </h3>

            <p className="mt-3 text-slate-300">
              Available
              <br />
              24 Hours
              <br />
              7 Days a Week
            </p>
          </div>

        </div>

        {/* Call to Action */}

        <div className="mt-12 rounded-3xl bg-blue-600 p-8 text-center md:mt-16 md:p-12">

          <h3 className="text-2xl font-bold text-white md:text-3xl">
            Ready to Get Started?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Contact XAREON GROUP today for reliable home repair,
            installation and handyman services.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">

            <a
              href="tel:+12022868497"
              className="w-full rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-blue-700 transition hover:bg-slate-100 sm:w-auto"
            >
              📞 Call Now
            </a>

            <a
              href="mailto:info@xareongroup.com"
              className="w-full rounded-2xl border border-white px-8 py-4 text-lg font-semibold text-white transition hover:bg-white hover:text-blue-700 sm:w-auto"
            >
              ✉ Email Us
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}