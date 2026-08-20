import { privateRouteMetadata } from "@/lib/site-metadata";

export const metadata = privateRouteMetadata;

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
