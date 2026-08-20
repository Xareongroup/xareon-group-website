import type { MetadataRoute } from "next";

import { PUBLIC_INDEXABLE_ROUTES } from "@/lib/public-routes";
import { SITE_URL } from "@/lib/site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_INDEXABLE_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path || "/"}`,
    changeFrequency,
    priority,
  }));
}
