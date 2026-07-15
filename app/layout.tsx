import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.xareongroup.com"),

  title: {
    default: "XAREON GROUP | Professional Home Repair & Installation Services",
    template: "%s | XAREON GROUP",
  },

  description:
    "Professional Home Repair, TV Mounting, Furniture Assembly, Smart Home Installation, Painting, Drywall Repair, Minor Plumbing, Minor Electrical, and Handyman Services throughout Maryland, Washington DC, and Northern Virginia.",

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

  alternates: {
    canonical: "https://www.xareongroup.com",
  },

  openGraph: {
    title: "XAREON GROUP | Professional Home Repair & Installation Services",

    description:
      "Professional Home Repair & Installation Services serving Maryland, Washington DC and Northern Virginia.",

    url: "https://www.xareongroup.com",

    siteName: "XAREON GROUP",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "XAREON GROUP",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "XAREON GROUP | Professional Home Repair & Installation Services",

    description:
      "Professional Home Repair & Installation Services serving Maryland, Washington DC and Northern Virginia.",

    images: ["/og-image.jpg"],
  },

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
      <body>{children}</body>
    </html>
  );
}