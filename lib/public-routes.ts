export const PUBLIC_INDEXABLE_ROUTES = [
  { path: "", changeFrequency: "monthly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services/drywall-repair", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/interior-painting", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/general-home-repairs", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/tv-mounting", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/door-installation-repair", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/partition-walls", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/fixture-installation", changeFrequency: "monthly", priority: 0.8 },
  { path: "/service-areas", changeFrequency: "monthly", priority: 0.8 },
  { path: "/service-areas/montgomery-county-md", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
] as const;

export const PUBLIC_INDEXABLE_PATHS: ReadonlySet<string> = new Set(
  PUBLIC_INDEXABLE_ROUTES.map(({ path }) => path || "/"),
);
