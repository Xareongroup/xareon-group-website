import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { minorPlumbingRepairsService } from "@/lib/services-core-expansion";
import { createPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = createPublicPageMetadata(minorPlumbingRepairsService);

export default function MinorPlumbingRepairsPage() {
  return <ServiceDetailPage service={minorPlumbingRepairsService} />;
}
