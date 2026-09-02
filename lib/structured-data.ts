import {
  absoluteUrl,
  BUSINESS,
  DEFAULT_DESCRIPTION,
  EXTENDED_SERVICE_AREAS,
  GOOGLE_BUSINESS_PROFILE_URL,
  PRIMARY_SERVICE_AREAS,
  SITE_URL,
} from "@/lib/site-metadata";

export const SCHEMA_IDS = {
  business: `${SITE_URL}/#business`,
  website: `${SITE_URL}/#website`,
  primaryImage: `${SITE_URL}/#primaryimage`,
} as const;

type PageSchemaType = "WebPage" | "CollectionPage" | "ContactPage";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface PublicPageSchemaOptions {
  path: string;
  name: string;
  description: string;
  type?: PageSchemaType;
  breadcrumbs?: BreadcrumbItem[];
  includePrimaryImage?: boolean;
  spatialCoverage?: string;
}

interface ServicePageSchemaOptions {
  path: string;
  name: string;
  serviceType: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
}

export type SchemaNode = Record<string, unknown>;

export interface SchemaGraph extends SchemaNode {
  "@context": "https://schema.org";
  "@graph": SchemaNode[];
}

function createBusinessEntity(): SchemaNode {
  return {
    "@type": "HomeAndConstructionBusiness",
    "@id": SCHEMA_IDS.business,
    name: BUSINESS.name,
    url: BUSINESS.url,
    logo: BUSINESS.logo,
    image: BUSINESS.image,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    sameAs: [GOOGLE_BUSINESS_PROFILE_URL],
    description: DEFAULT_DESCRIPTION,
    areaServed: [
      ...PRIMARY_SERVICE_AREAS.map((name) => ({
        "@type": "AdministrativeArea",
        name,
        description: "Primary regular service area",
      })),
      ...EXTENDED_SERVICE_AREAS.map((name) => ({
        "@type": "AdministrativeArea",
        name,
        description: "Extended service area; projects depend on scope and availability",
      })),
    ],
  };
}

function createWebsiteEntity(): SchemaNode {
  return {
    "@type": "WebSite",
    "@id": SCHEMA_IDS.website,
    url: `${SITE_URL}/`,
    name: BUSINESS.name,
    publisher: { "@id": SCHEMA_IDS.business },
  };
}

function createPrimaryImageEntity(): SchemaNode {
  return {
    "@type": "ImageObject",
    "@id": SCHEMA_IDS.primaryImage,
    url: BUSINESS.image,
    contentUrl: BUSINESS.image,
    caption: BUSINESS.name,
  };
}

export function createBreadcrumbSchema(
  path: string,
  items: BreadcrumbItem[],
): SchemaNode {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function createPublicPageSchema({
  path,
  name,
  description,
  type = "WebPage",
  breadcrumbs,
  includePrimaryImage = false,
  spatialCoverage,
}: PublicPageSchemaOptions): SchemaGraph {
  const url = absoluteUrl(path);
  const page: SchemaNode = {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": SCHEMA_IDS.website },
    about: { "@id": SCHEMA_IDS.business },
  };

  if (includePrimaryImage) {
    page.primaryImageOfPage = { "@id": SCHEMA_IDS.primaryImage };
  }

  if (spatialCoverage) {
    page.spatialCoverage = {
      "@type": "AdministrativeArea",
      name: spatialCoverage,
    };
  }

  const graph: SchemaNode[] = [createBusinessEntity(), createWebsiteEntity()];

  if (includePrimaryImage) {
    graph.push(createPrimaryImageEntity());
  }

  graph.push(page);

  if (breadcrumbs?.length) {
    const breadcrumb = createBreadcrumbSchema(path, breadcrumbs);
    page.breadcrumb = { "@id": breadcrumb["@id"] };
    graph.push(breadcrumb);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function createServicePageSchema({
  path,
  name,
  serviceType,
  description,
  breadcrumbs,
}: ServicePageSchemaOptions): SchemaGraph {
  const schema = createPublicPageSchema({
    path,
    name,
    description,
    breadcrumbs,
  });
  const url = absoluteUrl(path);
  const pageId = `${url}#webpage`;
  const serviceId = `${url}#service`;
  const page = schema["@graph"].find((node) => node["@id"] === pageId);

  if (page) {
    page.mainEntity = { "@id": serviceId };
  }

  schema["@graph"].push({
    "@type": "Service",
    "@id": serviceId,
    name,
    serviceType,
    description,
    url,
    provider: { "@id": SCHEMA_IDS.business },
    areaServed: [
      ...PRIMARY_SERVICE_AREAS.map((name) => ({
        "@type": "AdministrativeArea",
        name,
        description: "Primary regular service area",
      })),
      ...EXTENDED_SERVICE_AREAS.map((name) => ({
        "@type": "AdministrativeArea",
        name,
        description: "Extended service area; projects depend on scope and availability",
      })),
    ],
    mainEntityOfPage: { "@id": pageId },
  });

  return schema;
}
