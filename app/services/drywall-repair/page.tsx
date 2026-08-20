import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { createPublicPageMetadata } from "@/lib/site-metadata";
import { drywallRepairService } from "@/lib/services";

export const metadata = createPublicPageMetadata({
  path: drywallRepairService.path,
  title: drywallRepairService.title,
  description: drywallRepairService.description,
});

export default function DrywallRepairPage() {
  return <ServiceDetailPage service={drywallRepairService} />;
}
