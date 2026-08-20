import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { smartHomeInstallationService } from "@/lib/services-core-expansion";
import { createPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = createPublicPageMetadata(smartHomeInstallationService);

export default function SmartHomeInstallationPage() {
  return <ServiceDetailPage service={smartHomeInstallationService} />;
}
