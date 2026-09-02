import type { Metadata } from "next";

export const SITE_URL = "https://www.xareongroup.com";
export const GOOGLE_BUSINESS_PROFILE_URL = "https://share.google/zPjwgAT9QIoc6d0wy";

export const PRIMARY_SERVICE_AREAS = [
  "Montgomery County, Maryland",
  "Howard County, Maryland",
] as const;

export const EXTENDED_SERVICE_AREAS = [
  "Washington, DC",
  "Northern Virginia",
] as const;

export const SERVICE_AREA_STATEMENT =
  "XAREON GROUP regularly serves Montgomery and Howard counties, with select projects accepted throughout Washington, D.C. and Northern Virginia depending on project scope and availability.";

export const BUSINESS = {
  name: "XAREON GROUP",
  url: `${SITE_URL}/`,
  telephone: "+12022868497",
  telephoneDisplay: "(202) 286-8497",
  email: "info@xareongroup.com",
  logo: `${SITE_URL}/logo/xareon1-logo.png`,
  image: `${SITE_URL}/og-image.png`,
  primaryServiceAreas: PRIMARY_SERVICE_AREAS,
  extendedServiceAreas: EXTENDED_SERVICE_AREAS,
  serviceAreas: [...PRIMARY_SERVICE_AREAS, ...EXTENDED_SERVICE_AREAS],
} as const;

export const DEFAULT_TITLE =
  "XAREON GROUP | Professional Home Repair & Installation Services";

export const DEFAULT_DESCRIPTION =
  "Professional home repair and installation services in Montgomery and Howard counties, Maryland, with select projects accepted in Washington, D.C. and Northern Virginia based on scope and availability.";

export const SOCIAL_DESCRIPTION =
  "Home repair and installation services in Montgomery and Howard counties, with select projects accepted in Washington, D.C. and Northern Virginia.";

interface PublicPageMetadataOptions {
  path: string;
  title: string;
  description: string;
}

export function absoluteUrl(path: string): string {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function createOpenGraphMetadata({
  path,
  title,
  description,
}: PublicPageMetadataOptions): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    url: absoluteUrl(path),
    siteName: "XAREON GROUP",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "XAREON GROUP",
      },
    ],
  };
}

export const twitterMetadata: NonNullable<Metadata["twitter"]> = {
  card: "summary_large_image",
  title: DEFAULT_TITLE,
  description: SOCIAL_DESCRIPTION,
  images: ["/og-image.png"],
};

export function createPublicPageMetadata({
  path,
  title,
  description,
}: PublicPageMetadataOptions): Metadata {
  return {
    title: {
      absolute: title,
    },
    description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: createOpenGraphMetadata({ path, title, description }),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}

export const privateRouteMetadata: Metadata = {
  title: {
    absolute: "XAREON GROUP Secure Access",
  },
  description: "Secure access for XAREON GROUP customers and staff.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: null,
  },
  keywords: null,
  authors: null,
  creator: null,
  publisher: null,
  verification: {},
  openGraph: null,
  twitter: null,
};
