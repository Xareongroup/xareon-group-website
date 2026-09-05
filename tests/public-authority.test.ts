import { describe, expect, it } from "vitest";

import { GET as getLlmsText } from "@/app/llms.txt/route";
import { PUBLIC_INDEXABLE_PATHS } from "@/lib/public-routes";

describe("public authority and conversion foundations", () => {
  it("serves a factual llms.txt without exposing operational routes", async () => {
    const response = getLlmsText();
    const body = await response.text();

    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(body).toContain("Primary regular service areas: Montgomery County, Maryland and Howard County, Maryland");
    expect(body).toContain("Extended service areas: Washington, D.C. and Northern Virginia, depending on project scope and availability");
    expect(body).toContain("https://www.xareongroup.com/sitemap.xml");
    expect(body).not.toMatch(/\/(?:admin|api|portal|sign|signature|pdf|thank-you)(?:\b|\/)/);
    expect(body).not.toMatch(/AggregateRating|\b4\.98\b|\b344\b/);
  });

  it("keeps llms.txt informational and outside the indexable route registry", () => {
    expect(PUBLIC_INDEXABLE_PATHS).not.toContain("/llms.txt");
  });
});
