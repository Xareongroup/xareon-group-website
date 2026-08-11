export type CustomerPortalUrlResult =
  | { ok: true; url: string }
  | { ok: false; reason: "missing_site_url" | "invalid_site_url" | "missing_portal_token" };

/** Builds an absolute portal URL suitable for customer-facing email. */
export function buildCustomerPortalUrl(
  siteUrl: string | undefined,
  portalToken: string | null | undefined
): CustomerPortalUrlResult {
  if (!portalToken?.trim()) return { ok: false, reason: "missing_portal_token" };
  if (!siteUrl?.trim()) return { ok: false, reason: "missing_site_url" };

  try {
    const baseUrl = new URL(siteUrl);
    if (baseUrl.protocol !== "https:" && baseUrl.protocol !== "http:") {
      return { ok: false, reason: "invalid_site_url" };
    }

    const url = new URL(`/portal/${encodeURIComponent(portalToken)}`, baseUrl.origin);
    return { ok: true, url: url.toString() };
  } catch {
    return { ok: false, reason: "invalid_site_url" };
  }
}
