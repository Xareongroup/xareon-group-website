import type { Metadata } from "next";

export const SITE_URL = "https://www.xareongroup.com";

export const BUSINESS = {
  name: "XAREON GROUP",
  url: `${SITE_URL}/`,
  telephone: "+12022868497",
  telephoneDisplay: "(202) 286-8497",
  email: "info@xareongroup.com",
  logo: `${SITE_URL}/logo/xareon1-logo.png`,
  image: `${SITE_URL}/og-image.png`,
  serviceAreas: ["Maryland", "Washington, DC", "Northern Virginia"],
} as const;

export const DEFAULT_TITLE =
  "XAREON GROUP | Professional Home Repair & Installation Services";

export const DEFAULT_DESCRIPTION =
  "Professional general home repairs, drywall repair, interior painting, TV mounting, furniture assembly, smart-home installation, minor plumbing and electrical repairs, door and fixture installation, partition walls, kitchen installation, and bathroom improvements across Maryland, Washington, DC, and Northern Virginia.";

export const SOCIAL_DESCRIPTION =
  "Professional Home Repair & Installation Services serving Maryland, Washington DC and Northern Virginia.";

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
