import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { minorElectricalRepairsService } from "@/lib/services-core-expansion";
import { createPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = createPublicPageMetadata(minorElectricalRepairsService);

export default function MinorElectricalRepairsPage() {
  return <ServiceDetailPage service={minorElectricalRepairsService} />;
}
