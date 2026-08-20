import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { furnitureAssemblyService } from "@/lib/services";
import { createPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = createPublicPageMetadata(furnitureAssemblyService);

export default function FurnitureAssemblyPage() {
  return <ServiceDetailPage service={furnitureAssemblyService} />;
}
