import { privateRouteMetadata } from "@/lib/site-metadata";

export const metadata = privateRouteMetadata;

export default function SigningLayout({ children }: { children: React.ReactNode }) {
  return children;
}
