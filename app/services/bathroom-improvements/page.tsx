import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { bathroomImprovementsService } from "@/lib/services-core-expansion";
import { createPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = createPublicPageMetadata(bathroomImprovementsService);

export default function BathroomImprovementsPage() {
  return <ServiceDetailPage service={bathroomImprovementsService} />;
}
