import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { kitchenInstallationService } from "@/lib/services-core-expansion";
import { createPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = createPublicPageMetadata(kitchenInstallationService);

export default function KitchenInstallationPage() {
  return <ServiceDetailPage service={kitchenInstallationService} />;
}
