import { describe, expect, it } from "vitest";

import { buildCustomerPortalUrl } from "@/lib/portal/buildCustomerPortalUrl";

describe("buildCustomerPortalUrl", () => {
  it("rejects a missing public site URL", () => {
    expect(buildCustomerPortalUrl(undefined, "portal-token")).toEqual({
      ok: false,
      reason: "missing_site_url",
    });
  });

  it("rejects a missing customer portal token", () => {
    expect(buildCustomerPortalUrl("https://www.xareongroup.com", null)).toEqual({
      ok: false,
      reason: "missing_portal_token",
    });
  });

  it("creates a valid canonical production portal URL", () => {
    expect(buildCustomerPortalUrl("https://www.xareongroup.com/", "portal-token")).toEqual({
      ok: true,
      url: "https://www.xareongroup.com/portal/portal-token",
    });
  });
});
