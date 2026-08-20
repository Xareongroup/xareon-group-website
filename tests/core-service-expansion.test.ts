import { describe, expect, it } from "vitest";

import { PUBLIC_INDEXABLE_PATHS, PUBLIC_INDEXABLE_ROUTES } from "@/lib/public-routes";
import { coreExpansionServices } from "@/lib/services-core-expansion";

const expectedPaths = [
  "/services/smart-home-installation",
  "/services/minor-plumbing-repairs",
  "/services/minor-electrical-repairs",
  "/services/kitchen-installation",
  "/services/bathroom-improvements",
];

describe("core service expansion", () => {
  it("defines exactly the approved five service pages", () => {
    expect(coreExpansionServices.map(({ path }) => path)).toEqual(expectedPaths);
  });

  it.each(coreExpansionServices)("gives $name the shared content depth", (service) => {
    expect(service.overview).toHaveLength(2);
    expect(service.commonProjects).toHaveLength(6);
    expect(service.faqs).toHaveLength(5);
    expect(service.relatedServices).toHaveLength(2);
    expect(service.title).toContain("XAREON GROUP");
    expect(service.description.length).toBeGreaterThan(100);
  });

  it("adds every approved page to the centralized sitemap and IndexNow registry", () => {
    expect(PUBLIC_INDEXABLE_ROUTES).toHaveLength(18);
    for (const path of expectedPaths) {
      expect(PUBLIC_INDEXABLE_PATHS.has(path)).toBe(true);
    }
  });
});
