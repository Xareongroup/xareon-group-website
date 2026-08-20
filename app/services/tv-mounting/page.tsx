import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { tvMountingService } from "@/lib/services-phase-2b";
import { createPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = createPublicPageMetadata(tvMountingService);

export default function TvMountingPage() {
  return <ServiceDetailPage service={tvMountingService} />;
}
