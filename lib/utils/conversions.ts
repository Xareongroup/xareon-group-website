"use client";

import { GOOGLE_ADS_LEAD_CONVERSION_ID } from "@/lib/marketing-config";
export const ATTRIBUTION_STORAGE_KEY = "xareon_estimate_attribution";

export type MarketingEventName =
  | "estimate_cta_click"
  | "phone_click"
  | "email_click"
  | "estimate_form_start"
  | "estimate_form_submit"
  | "estimate_form_success"
  | "estimate_form_error"
  | "photo_upload"
  | "generate_lead"
  | "service_link_click"
  | "location_link_click";

export interface AttributionContext {
  source_page: string;
  source_type: "service" | "location" | "marketing";
  source_name: string;
}

type EventParameters = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function isMarketingAnalyticsEnabled() {
  if (typeof window === "undefined") return false;
  return window.location.hostname === "xareongroup.com" || window.location.hostname === "www.xareongroup.com";
}

function nameFromSlug(slug: string) {
  return slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export function getCurrentAttribution(): AttributionContext {
  if (typeof window === "undefined") return { source_page: "/", source_type: "marketing", source_name: "Website" };

  const path = window.location.pathname;
  if (path.startsWith("/services/")) {
    return { source_page: path, source_type: "service", source_name: nameFromSlug(path.split("/").pop() ?? "service") };
  }
  if (path.startsWith("/service-areas/")) {
    const slug = path.split("/").pop() ?? "service-area";
    return { source_page: path, source_type: "location", source_name: slug === "montgomery-county-md" ? "Montgomery County, MD" : nameFromSlug(slug) };
  }
  if (path === "/service-areas") return { source_page: path, source_type: "location", source_name: "Service Areas" };
  if (path === "/services") return { source_page: path, source_type: "marketing", source_name: "Services" };
  return { source_page: path, source_type: "marketing", source_name: path === "/" ? "Homepage" : document.title };
}

export function rememberEstimateAttribution(context = getCurrentAttribution()) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(context));
  } catch {
    // Attribution is optional and must never block navigation.
  }
}

export function readEstimateAttribution(): AttributionContext {
  if (typeof window === "undefined") return getCurrentAttribution();
  try {
    const stored = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as AttributionContext;
  } catch {
    // Fall back to the current page when session storage is unavailable.
  }
  return getCurrentAttribution();
}

export function trackMarketingEvent(event: MarketingEventName, parameters: EventParameters = {}) {
  if (!isMarketingAnalyticsEnabled()) return;
  const payload = { page_path: window.location.pathname, page_title: document.title, ...parameters };

  if (window.gtag) {
    window.gtag("event", event, payload);
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });
}

let googleAdsLeadConversionSent = false;

/**
 * Sends the one primary Ads conversion only after a lead is accepted by the
 * backend. It deliberately does nothing until a verified conversion label is
 * configured, and never includes an assumed value or currency.
 */
export function trackGoogleAdsLeadConversion() {
  if (
    googleAdsLeadConversionSent ||
    !GOOGLE_ADS_LEAD_CONVERSION_ID ||
    !isMarketingAnalyticsEnabled() ||
    !window.gtag
  ) {
    return false;
  }

  window.gtag("event", "conversion", { send_to: GOOGLE_ADS_LEAD_CONVERSION_ID });
  googleAdsLeadConversionSent = true;
  return true;
}

/** Backward-compatible alias for existing callers. */
export const trackConversion = trackMarketingEvent;
