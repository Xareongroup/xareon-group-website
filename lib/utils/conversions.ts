"use client";

declare global { interface Window { dataLayer?: Record<string, unknown>[]; gtag?: (...args: unknown[]) => void; } }

/** Pushes real user actions only. Configure GTM/Google Ads to map these events to conversions. */
export function trackConversion(event: "generate_lead" | "phone_click" | "email_click", parameters: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...parameters });
  window.gtag?.("event", event, parameters);
}
