import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { createPublicPageMetadata } from "@/lib/site-metadata";
import { generalHomeRepairsService } from "@/lib/services";

export const metadata = createPublicPageMetadata({
  path: generalHomeRepairsService.path,
  title: generalHomeRepairsService.title,
  description: generalHomeRepairsService.description,
});

export default function GeneralHomeRepairsPage() {
  return <ServiceDetailPage service={generalHomeRepairsService} />;
}
