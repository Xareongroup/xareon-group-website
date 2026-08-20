import { privateRouteMetadata } from "@/lib/site-metadata";

export const metadata = privateRouteMetadata;

export default function PdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
