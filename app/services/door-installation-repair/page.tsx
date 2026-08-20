import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { doorInstallationRepairService } from "@/lib/services-phase-2b";
import { createPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = createPublicPageMetadata(doorInstallationRepairService);

export default function DoorInstallationRepairPage() {
  return <ServiceDetailPage service={doorInstallationRepairService} />;
}
