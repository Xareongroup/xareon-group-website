"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { Turnstile } from "@marsidev/react-turnstile";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

export default function QuoteForm() {
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });
const onDrop = useCallback((acceptedFiles: File[]) => {
  setFiles((previous) => [...previous, ...acceptedFiles]);
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
    if (!turnstileToken) {
  alert("Please complete the security verification.");
  return;
}
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
      throw new Error(result.error || "Something went wrong.");
    }

    alert("✅ Thank you! Your free estimate request has been sent successfully.");

    window.location.reload();
  } catch (error) {
    console.error(error);

    alert("❌ Unable to send your estimate request. Please try again.");
  } finally {
    setLoading(false);
  }
}

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl bg-white p-8 shadow-2xl space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">
          Request a Free Estimate
        </h2>

        <p className="mt-2 text-slate-600">
          Tell us about your project and we'll get back to you shortly.
        </p>
      </div>

      {/* Full Name */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Full Name *
        </label>

        <input
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
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Email Address *
          </label>

          <input
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
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Phone Number *
          </label>

          <input
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
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Service Needed *
        </label>

        <select
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
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Property Type *
          </label>

          <select
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
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            City *
          </label>

          <input
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
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Describe Your Project *
        </label>

        <textarea
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
<div className="flex justify-center">
  <Turnstile
    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
    onSuccess={(token) => setTurnstileToken(token)}
    onExpire={() => setTurnstileToken("")}
    onError={() => setTurnstileToken("")}
  />
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