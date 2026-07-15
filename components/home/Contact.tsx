"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed");
      }

      setSuccess(true);

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-8 shadow-lg"
          >

            <div className="space-y-6">

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border p-4"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border p-4"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-xl border p-4"
              />

              <textarea
                rows={5}
                name="message"
                placeholder="Tell us about your project..."
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full rounded-xl border p-4"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-4 text-lg font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Request Free Estimate"}
              </button>

              {success && (
                <p className="text-center font-semibold text-green-600">
                  Thank you! Your estimate request has been sent successfully.
                </p>
              )}

            </div>

          </form>

        </div>

      </div>
    </section>
  );
}