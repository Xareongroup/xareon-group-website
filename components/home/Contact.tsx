import {
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-slate-100 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Contact Us
          </span>

          <h2 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
            Request Your Free Estimate
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
            We'd love to hear about your project. Call us, email us,
            or send us a message using the form below.
          </p>

        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-2">

          {/* Contact Information */}

          <div className="space-y-8">

            <div className="flex gap-5">

              <Phone className="text-blue-600" size={30} />

              <div>
                <h3 className="font-bold text-xl">
                  Phone
                </h3>

                <p className="text-slate-600">
                  (202) 286-8497
                </p>

              </div>

            </div>

            <div className="flex gap-5">

              <Mail className="text-blue-600" size={30} />

              <div>
                <h3 className="font-bold text-xl">
                  Email
                </h3>

                <p className="text-slate-600">
                  info@xareongroup.com
                </p>

              </div>

            </div>

            <div className="flex gap-5">

              <MapPin className="text-blue-600" size={30} />

              <div>
                <h3 className="font-bold text-xl">
                  Service Area
                </h3>

                <p className="text-slate-600">
                  Maryland • Washington DC • Northern Virginia
                </p>

              </div>

            </div>

            <div className="flex gap-5">

              <Clock className="text-blue-600" size={30} />

              <div>
                <h3 className="font-bold text-xl">
                  Business Hours
                </h3>

                <p className="text-slate-600">
                  Available 24/7
                </p>

              </div>

            </div>

          </div>

          {/* Contact Form */}

          <form className="rounded-3xl bg-white p-8 shadow-lg">

            <div className="space-y-6">

              <input
                type="text"
                placeholder="Full Name"
                className="w-full rounded-xl border p-4"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-xl border p-4"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full rounded-xl border p-4"
              />

              <textarea
                rows={5}
                placeholder="Tell us about your project..."
                className="w-full rounded-xl border p-4"
              />

              <button
                className="w-full rounded-xl bg-blue-600 py-4 text-lg font-bold text-white transition hover:bg-blue-700"
              >
                Request Free Estimate
              </button>

            </div>

          </form>

        </div>

      </div>
    </section>
  );
}