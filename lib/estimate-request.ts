import { z } from "zod";

export const ESTIMATE_SERVICE_OPTIONS = [
  "General Home Repairs",
  "Drywall Repair",
  "Door Installation & Repair",
  "TV Mounting",
  "Furniture Assembly",
  "Interior Painting",
  "Smart Home Installation",
  "Minor Plumbing Repairs",
  "Minor Electrical Repairs",
  "Kitchen Installation",
  "Bathroom Improvements",
  "Fixture Installation",
  "Partition Wall Installation",
  "Other",
] as const;

export const ESTIMATE_PROPERTY_TYPES = ["Residential", "Commercial"] as const;

export const ESTIMATE_UPLOAD_LIMITS = {
  maxFiles: 10,
  maxFileBytes: 4 * 1024 * 1024,
  maxCombinedFileBytes: 4 * 1024 * 1024,
  maxRequestBytes: 4_400_000,
} as const;

export const ESTIMATE_ALLOWED_IMAGE_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
} as const;

const singleLine = (label: string, minimum: number, maximum: number) =>
  z.string()
    .trim()
    .min(minimum, `${label} is required.`)
    .max(maximum, `${label} is too long.`)
    .refine((value) => !/[\u0000-\u001F\u007F]/.test(value), `${label} contains unsupported characters.`);

export const estimateRequestSchema = z.object({
  name: singleLine("Full name", 2, 100),
  email: z.string().trim().toLowerCase().max(254, "Email address is too long.").email("Please enter a valid email address."),
  phone: z.string().trim().min(10, "Please enter a valid phone number.").max(30, "Phone number is too long.")
    .refine((value) => /^[+()0-9.\-\s]+$/.test(value), "Please enter a valid phone number.")
    .refine((value) => {
      const digitCount = value.replace(/\D/g, "").length;
      return digitCount >= 10 && digitCount <= 15;
    }, "Please enter a valid phone number."),
  service: z.enum(ESTIMATE_SERVICE_OPTIONS, { error: "Please select an approved service." }),
  propertyType: z.enum(ESTIMATE_PROPERTY_TYPES, { error: "Please select a property type." }),
  city: singleLine("City or project location", 2, 100),
  description: z.string().trim().min(20, "Please describe your project in a little more detail.").max(5_000, "Project description is too long.")
    .refine((value) => !/[\u0000\u000B\u000C\u007F]/.test(value), "Project description contains unsupported characters."),
  turnstileToken: z.string().trim().min(1, "Please complete the security verification.").max(4_096, "Security verification is invalid.")
    .regex(/^[A-Za-z0-9._-]+$/, "Security verification is invalid."),
}).strict();

export type EstimateRequest = z.infer<typeof estimateRequestSchema>;
export type EstimateFieldName = keyof Omit<EstimateRequest, "turnstileToken">;

export function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

export function safeDisplayFileName(value: string, index: number) {
  const normalized = value.normalize("NFKC")
    .replace(/[^\p{L}\p{N} ._-]/gu, "_")
    .replace(/^\.+/, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
  return normalized || `project-photo-${index + 1}`;
}

export function imageExtensionForMime(type: string) {
  return ESTIMATE_ALLOWED_IMAGE_TYPES[type as keyof typeof ESTIMATE_ALLOWED_IMAGE_TYPES] ?? null;
}

export async function hasMatchingImageSignature(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer()).slice(0, 12);
  if (file.type === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.type === "image/png") return bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value);
  if (file.type === "image/webp") {
    return bytes.length >= 12
      && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF"
      && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  }
  return false;
}
