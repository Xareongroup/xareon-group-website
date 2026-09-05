import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";

import { PUBLIC_INDEXABLE_PATHS, PUBLIC_INDEXABLE_ROUTES } from "@/lib/public-routes";
import { projects, wholeHomeRestorationProject } from "@/lib/projects";

describe("flagship project architecture", () => {
  it("publishes one genuine project without placeholders", () => {
    expect(projects).toHaveLength(1);
    expect(projects[0]).toBe(wholeHomeRestorationProject);
    expect(wholeHomeRestorationProject.path).toBe("/projects/whole-home-restoration-renovation");
    expect(wholeHomeRestorationProject.images).toHaveLength(13);
    expect(wholeHomeRestorationProject.completedScope).toContain("New interior-door installation");
    expect(wholeHomeRestorationProject.completedScope).toContain("Basement partition construction");
  });

  it("adds only the two approved project routes to the public registry", () => {
    expect(PUBLIC_INDEXABLE_ROUTES).toHaveLength(24);
    expect(PUBLIC_INDEXABLE_PATHS.has("/projects")).toBe(true);
    expect(PUBLIC_INDEXABLE_PATHS.has(wholeHomeRestorationProject.path)).toBe(true);
  });

  it("keeps every selected derivative present and out of social metadata", () => {
    for (const image of wholeHomeRestorationProject.images) {
      expect(fs.existsSync(path.join(process.cwd(), "public", image.src))).toBe(true);
    }
    const detailPage = fs.readFileSync(path.join(process.cwd(), "app/projects/whole-home-restoration-renovation/page.tsx"), "utf8");
    expect(detailPage).not.toContain("openGraph:");
    expect(detailPage).not.toContain("twitter:");
  });

  it("contains no prohibited factual claims", () => {
    const publicProjectSource = [
      "lib/projects.ts",
      "app/projects/page.tsx",
      "app/projects/whole-home-restoration-renovation/page.tsx",
      "components/home/Portfolio.tsx",
    ].map((file) => fs.readFileSync(path.join(process.cwd(), file), "utf8").toLowerCase()).join("\n");
    for (const prohibited of ["customer name", "street address", "project cost", "project duration", "subcontractor", "property value", "insurance restoration"]) {
      expect(publicProjectSource).not.toContain(prohibited);
    }
  });

  it("uses metadata-free WebP derivatives", async () => {
    for (const image of wholeHomeRestorationProject.images) {
      const metadata = await sharp(path.join(process.cwd(), "public", image.src)).metadata();
      expect(metadata.format).toBe("webp");
      expect(metadata.width).toBe(image.width);
      expect(metadata.height).toBe(image.height);
      expect(metadata.exif).toBeUndefined();
      expect(metadata.xmp).toBeUndefined();
      expect(metadata.iptc).toBeUndefined();
      expect(metadata.icc).toBeUndefined();
    }
  });
});
