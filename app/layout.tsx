import type { Metadata } from "next";
import "./globals.css";
import MarketingAnalytics from "@/components/analytics/MarketingAnalytics";
import {
  createOpenGraphMetadata,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_URL,
  twitterMetadata,
} from "@/lib/site-metadata";

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
const bingSiteVerification = process.env.BING_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: DEFAULT_TITLE,
    template: "%s | XAREON GROUP",
  },

  description: DEFAULT_DESCRIPTION,

  keywords: [
    "XAREON GROUP",
    "Handyman",
    "Home Repair",
    "TV Mounting",
    "Furniture Assembly",
    "Smart Home",
    "Ring Doorbell Installation",
    "Nest Thermostat",
    "Painting",
    "Drywall Repair",
    "Minor Plumbing",
    "Minor Electrical",
    "Maryland Handyman",
    "Washington DC Handyman",
    "Northern Virginia Handyman",
  ],

  authors: [
    {
      name: "XAREON GROUP",
      url: "https://www.xareongroup.com",
    },
  ],

  creator: "XAREON GROUP",
  publisher: "XAREON GROUP",

  robots: {
    index: true,
    follow: true,
  },

  verification:
    googleSiteVerification || bingSiteVerification
      ? {
          ...(googleSiteVerification ? { google: googleSiteVerification } : {}),
          ...(bingSiteVerification
            ? { other: { "msvalidate.01": bingSiteVerification } }
            : {}),
        }
      : undefined,

  openGraph: createOpenGraphMetadata({
    path: "/",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  }),

  twitter: twitterMetadata,

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <MarketingAnalytics />
      </body>
    </html>
  );
}
