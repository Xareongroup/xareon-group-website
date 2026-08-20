import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { createPublicPageMetadata } from "@/lib/site-metadata";
import { interiorPaintingService } from "@/lib/services";

export const metadata = createPublicPageMetadata({
  path: interiorPaintingService.path,
  title: interiorPaintingService.title,
  description: interiorPaintingService.description,
});

export default function InteriorPaintingPage() {
  return <ServiceDetailPage service={interiorPaintingService} />;
}
