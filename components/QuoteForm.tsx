"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { Turnstile } from "@marsidev/react-turnstile";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  readEstimateAttribution,
  trackGoogleAdsLeadConversion,
  trackMarketingEvent,
} from "@/lib/utils/conversions";

const quoteSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  service: z.string().min(1, "Please select a service."),
  propertyType: z.string().min(1, "Please select a property type."),
  city: z.string().min(2, "Please enter your city."),
  description: z
    .string()
    .min(20, "Please describe your project in a little more detail."),
});

type QuoteFormData = z.infer<typeof quoteSchema>;
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function QuoteForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [formStarted, setFormStarted] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.info("Turnstile configured:", Boolean(turnstileSiteKey));
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });
const onDrop = useCallback((acceptedFiles: File[]) => {
  if (!acceptedFiles.length) return;
  setFiles((previous) => {
    const nextFiles = [...previous, ...acceptedFiles];
    trackMarketingEvent("photo_upload", {
      form_context: "homepage_quote_form",
      photo_count: acceptedFiles.length,
      total_photo_count: nextFiles.length,
      ...readEstimateAttribution(),
    });
    return nextFiles;
  });
}, []);

const {
  getRootProps,
  getInputProps,
  isDragActive,
} = useDropzone({
  onDrop: onDrop,
  accept: {
    "image/*": [],
  },
  maxFiles: 10,
  maxSize: 10 * 1024 * 1024,
});
async function onSubmit(data: QuoteFormData) {
    if (loading) return;

    const attribution = readEstimateAttribution();
    trackMarketingEvent("estimate_form_submit", {
      form_context: "homepage_quote_form",
      service_name: data.service,
      photo_count: files.length,
      ...attribution,
    });

    if (!turnstileToken) {
      trackMarketingEvent("estimate_form_error", {
        form_context: "homepage_quote_form",
        error_type: "security_verification",
        ...attribution,
      });
      alert("Please complete the security verification.");
      return;
    }
  let errorType = "network_or_server";
  try {
    setLoading(true);

const formData = new FormData();

formData.append("name", data.name);
formData.append("email", data.email);
formData.append("phone", data.phone);
formData.append("service", data.service);
formData.append("propertyType", data.propertyType);
formData.append("city", data.city);
formData.append("description", data.description);
formData.append("turnstileToken", turnstileToken);

files.forEach((file) => {
  formData.append("photos", file);
});

const response = await fetch("/api/contact", {
  method: "POST",
  body: formData,
});

    const result = await response.json();

    if (!response.ok) {
      errorType = `http_${response.status}`;
      throw new Error(result.error || "Something went wrong.");
    }

    trackMarketingEvent("estimate_form_success", {
      form_context: "homepage_quote_form",
      service_name: data.service,
      photo_count: files.length,
      ...attribution,
    });
    trackGoogleAdsLeadConversion();
    trackMarketingEvent("generate_lead", {
      lead_source: "quote_form",
      service_name: data.service,
      ...attribution,
    });
    router.push("/thank-you");
  } catch (error) {
    console.error(error);
    trackMarketingEvent("estimate_form_error", {
      form_context: "homepage_quote_form",
      error_type: errorType,
      ...attribution,
    });
    alert("❌ Unable to send your estimate request. Please try again.");
  } finally {
    setLoading(false);
  }
}

  function handleFormInteraction(event: React.SyntheticEvent<HTMLFormElement>) {
    if (formStarted) return;
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) return;
    if (target instanceof HTMLInputElement && (target.type === "file" || target.type === "hidden")) return;
    setFormStarted(true);
    trackMarketingEvent("estimate_form_start", {
      form_context: "homepage_quote_form",
      form_section: "contact",
      ...readEstimateAttribution(),
    });
  }

  function onInvalid() {
    trackMarketingEvent("estimate_form_error", {
      form_context: "homepage_quote_form",
      error_type: "validation",
      ...readEstimateAttribution(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      onChangeCapture={handleFormInteraction}
      className="rounded-3xl bg-white p-8 shadow-2xl space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">
          Request a Free Estimate
        </h2>

        <p className="mt-2 text-slate-600">
          Tell us about your project and we&apos;ll get back to you shortly.
        </p>
      </div>

      {/* Full Name */}

      <div>
        <label htmlFor="quote-name" className="mb-2 block text-sm font-semibold text-slate-700">
          Full Name *
        </label>

        <input
          id="quote-name"
          {...register("name")}
          placeholder="John Smith"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600"
        />

        {errors.name && (
          <p className="mt-2 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Email */}

        <div>
          <label htmlFor="quote-email" className="mb-2 block text-sm font-semibold text-slate-700">
            Email Address *
          </label>

          <input
            id="quote-email"
            type="email"
            {...register("email")}
            placeholder="john@email.com"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600"
          />

          {errors.email && (
            <p className="mt-2 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}

        <div>
          <label htmlFor="quote-phone" className="mb-2 block text-sm font-semibold text-slate-700">
            Phone Number *
          </label>

          <input
            id="quote-phone"
            type="tel"
            {...register("phone")}
            placeholder="(202) 286-8497"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600"
          />

          {errors.phone && (
            <p className="mt-2 text-sm text-red-600">
              {errors.phone.message}
            </p>
          )}
        </div>

      </div>

      {/* Service */}

      <div>
        <label htmlFor="quote-service" className="mb-2 block text-sm font-semibold text-slate-700">
          Service Needed *
        </label>

        <select
          id="quote-service"
          {...register("service")}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600"
        >
          <option value="">Select a service</option>
          <option>Home Repair</option>
          <option>TV Mounting</option>
          <option>Furniture Assembly</option>
          <option>Painting</option>
          <option>Smart Home Installation</option>
          <option>Minor Plumbing</option>
          <option>Minor Electrical</option>
          <option>Other</option>
        </select>

        {errors.service && (
          <p className="mt-2 text-sm text-red-600">
            {errors.service.message}
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Property */}

        <div>
          <label htmlFor="quote-property-type" className="mb-2 block text-sm font-semibold text-slate-700">
            Property Type *
          </label>

          <select
            id="quote-property-type"
            {...register("propertyType")}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600"
          >
            <option value="">Select</option>
            <option>Residential</option>
            <option>Commercial</option>
          </select>

          {errors.propertyType && (
            <p className="mt-2 text-sm text-red-600">
              {errors.propertyType.message}
            </p>
          )}
        </div>

        {/* City */}

        <div>
          <label htmlFor="quote-city" className="mb-2 block text-sm font-semibold text-slate-700">
            City *
          </label>

          <input
            id="quote-city"
            {...register("city")}
            placeholder="Rockville"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600"
          />

          {errors.city && (
            <p className="mt-2 text-sm text-red-600">
              {errors.city.message}
            </p>
          )}
        </div>

      </div>

      {/* Description */}

      <div>
        <label htmlFor="quote-description" className="mb-2 block text-sm font-semibold text-slate-700">
          Describe Your Project *
        </label>

        <textarea
          id="quote-description"
          rows={6}
          {...register("description")}
          placeholder="Tell us about your project..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600"
        />

        {errors.description && (
          <p className="mt-2 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
        {/* Photo Upload */}

<div>
  <label className="mb-2 block text-sm font-semibold text-slate-700">
    Upload Photos (Optional)
  </label>

  <div
    {...getRootProps()}
    className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${
      isDragActive
        ? "border-blue-600 bg-blue-50"
        : "border-slate-300 hover:border-blue-500 hover:bg-slate-50"
    }`}
  >
    <input {...getInputProps()} />

    <div className="space-y-2">
      <p className="text-lg font-semibold text-slate-700">
        📷 Drag & Drop Photos Here
      </p>

      <p className="text-sm text-slate-500">
        or click to browse
      </p>

      <p className="text-xs text-slate-400">
        JPG, PNG, WEBP • Maximum 10 files • 10 MB each
      </p>
    </div>
  </div>

  {files.length > 0 && (
    <div className="mt-4 rounded-xl bg-slate-50 p-4">
      <h4 className="mb-3 font-semibold text-slate-700">
        Selected Files
      </h4>

      <ul className="space-y-2">
        {files.map((file, index) => (
          <li
            key={index}
            className="flex items-center justify-between rounded-lg bg-white px-4 py-2 shadow-sm"
          >
            <span className="truncate text-sm text-slate-700">
              📄 {file.name}
            </span>

            <span className="text-xs text-slate-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
      </div>
<div className="flex min-h-16 justify-center">
  {turnstileSiteKey ? (
    <Turnstile
      siteKey={turnstileSiteKey}
      options={{ theme: "light", size: "normal" }}
      onLoadScript={() => console.info("Turnstile script loaded.")}
      onWidgetLoad={() => console.info("Turnstile widget rendered.")}
      onSuccess={(token) => {
        console.info("Turnstile verification completed.");
        setTurnstileToken(token);
      }}
      onExpire={() => {
        console.warn("Turnstile verification expired.");
        setTurnstileToken("");
      }}
      onError={(code) => {
        console.error("Turnstile widget error:", code);
        setTurnstileToken("");
      }}
      onUnsupported={() => console.error("Turnstile is unsupported by this browser.")}
    />
  ) : (
    <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
      Security verification is unavailable. Please try again later.
    </p>
  )}
</div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Request Free Estimate"}
      </button>
    </form>
  );
}
