import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { partitionWallsService } from "@/lib/services-phase-2b";
import { createPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = createPublicPageMetadata(partitionWallsService);

export default function PartitionWallsPage() {
  return <ServiceDetailPage service={partitionWallsService} />;
}
