import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { fixtureInstallationService } from "@/lib/services-phase-2b";
import { createPublicPageMetadata } from "@/lib/site-metadata";

export const metadata = createPublicPageMetadata(fixtureInstallationService);

export default function FixtureInstallationPage() {
  return <ServiceDetailPage service={fixtureInstallationService} />;
}
