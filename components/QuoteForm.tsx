"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { useForm, type FieldErrors } from "react-hook-form";
import { Turnstile } from "@marsidev/react-turnstile";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  readEstimateAttribution,
  trackGoogleAdsLeadConversion,
  trackMarketingEvent,
} from "@/lib/utils/conversions";
import {
  ESTIMATE_PROPERTY_TYPES,
  ESTIMATE_SERVICE_OPTIONS,
  ESTIMATE_UPLOAD_LIMITS,
  estimateRequestSchema,
  type EstimateFieldName,
} from "@/lib/estimate-request";

const quoteSchema = estimateRequestSchema.omit({ turnstileToken: true });

type QuoteFormData = z.infer<typeof quoteSchema>;
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function QuoteForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [formStarted, setFormStarted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.info("Turnstile configured:", Boolean(turnstileSiteKey));
    }
  }, []);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });
const onDrop = useCallback((acceptedFiles: File[]) => {
  if (!acceptedFiles.length) return;
  setFiles((previous) => {
    const nextFiles = [...previous, ...acceptedFiles];
    if (nextFiles.length > ESTIMATE_UPLOAD_LIMITS.maxFiles) {
      setSubmissionError(`Upload no more than ${ESTIMATE_UPLOAD_LIMITS.maxFiles} photos.`);
      return previous;
    }
    if (nextFiles.reduce((total, file) => total + file.size, 0) > ESTIMATE_UPLOAD_LIMITS.maxCombinedFileBytes) {
      setSubmissionError("Combined image uploads must be 4 MB or smaller.");
      return previous;
    }
    setSubmissionError("");
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
  onDropRejected: () => setSubmissionError("Only JPG, PNG, and WEBP images up to 4 MB are accepted."),
  accept: {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
  },
  maxFiles: ESTIMATE_UPLOAD_LIMITS.maxFiles,
  maxSize: ESTIMATE_UPLOAD_LIMITS.maxFileBytes,
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
      setSubmissionError("Please complete the security verification.");
      return;
    }
  let errorType = "network_or_server";
  let userError = "Unable to send your estimate request. Please try again.";
  try {
    setLoading(true);
    setSubmissionError("");

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
      if (typeof result.error === "string" && result.error.length <= 200) userError = result.error;
      throw new Error("Estimate request rejected.");
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
    setSubmissionError(userError);
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

  function onInvalid(validationErrors: FieldErrors<QuoteFormData>) {
    trackMarketingEvent("estimate_form_error", {
      form_context: "homepage_quote_form",
      error_type: "validation",
      ...readEstimateAttribution(),
    });
    const firstInvalidField = Object.keys(validationErrors)[0] as EstimateFieldName | undefined;
    if (firstInvalidField) setFocus(firstInvalidField);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      onChangeCapture={handleFormInteraction}
      className="rounded-3xl bg-white p-8 shadow-2xl space-y-6"
      noValidate
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
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "quote-name-error" : undefined}
          placeholder="John Smith"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600"
        />

        {errors.name && (
          <p id="quote-name-error" className="mt-2 text-sm text-red-600">
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
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "quote-email-error" : undefined}
            placeholder="john@email.com"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600"
          />

          {errors.email && (
            <p id="quote-email-error" className="mt-2 text-sm text-red-600">
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
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "quote-phone-error" : undefined}
            placeholder="(202) 286-8497"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600"
          />

          {errors.phone && (
            <p id="quote-phone-error" className="mt-2 text-sm text-red-600">
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
          aria-invalid={Boolean(errors.service)}
          aria-describedby={errors.service ? "quote-service-error" : undefined}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600"
        >
          <option value="">Select a service</option>
          {ESTIMATE_SERVICE_OPTIONS.map((option) => <option key={option}>{option}</option>)}
        </select>

        {errors.service && (
          <p id="quote-service-error" className="mt-2 text-sm text-red-600">
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
            aria-invalid={Boolean(errors.propertyType)}
            aria-describedby={errors.propertyType ? "quote-property-type-error" : undefined}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600"
          >
            <option value="">Select</option>
            {ESTIMATE_PROPERTY_TYPES.map((option) => <option key={option}>{option}</option>)}
          </select>

          {errors.propertyType && (
            <p id="quote-property-type-error" className="mt-2 text-sm text-red-600">
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
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? "quote-city-error" : undefined}
            placeholder="Rockville"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600"
          />

          {errors.city && (
            <p id="quote-city-error" className="mt-2 text-sm text-red-600">
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
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? "quote-description-error" : undefined}
          placeholder="Tell us about your project..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600"
        />

        {errors.description && (
          <p id="quote-description-error" className="mt-2 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
        {/* Photo Upload */}

<div>
  <label htmlFor="quote-photos" className="mb-2 block text-sm font-semibold text-slate-700">
    Upload Photos (Optional)
  </label>

  <div
    {...getRootProps()}
    className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
      isDragActive
        ? "border-blue-600 bg-blue-50"
        : "border-slate-300 hover:border-blue-500 hover:bg-slate-50"
    }`}
  >
    <input {...getInputProps({ id: "quote-photos" })} />

    <div className="space-y-2">
      <p className="text-lg font-semibold text-slate-700">
        📷 Drag & Drop Photos Here
      </p>

      <p className="text-sm text-slate-500">
        or click to browse
      </p>

      <p className="text-xs text-slate-400">
        JPG, PNG, WEBP • Maximum 10 files • 4 MB total
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
      {submissionError && (
        <p role="alert" aria-live="assertive" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {submissionError}
        </p>
      )}
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
        className="w-full rounded-2xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Request Free Estimate"}
      </button>
      <p className="text-center text-sm leading-6 text-slate-500">
        By submitting this form, you ask XAREON GROUP to use the information provided to review and respond to your project request. Avoid including unnecessary sensitive information in descriptions or photos. See our{" "}
        <Link href="/privacy" className="font-semibold text-blue-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
          Privacy Notice
        </Link>.
      </p>
    </form>
  );
}
