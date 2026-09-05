import { BUSINESS, GOOGLE_BUSINESS_PROFILE_URL, SITE_URL } from "@/lib/site-metadata";

const content = `# XAREON GROUP

XAREON GROUP is a fully insured, 24/7 service-area company providing home repairs, installations, improvements, assembly, and carefully scoped renovation services.

## Service areas

- Primary regular service areas: Montgomery County, Maryland and Howard County, Maryland.
- Extended service areas: Washington, D.C. and Northern Virginia, depending on project scope and availability.
- XAREON GROUP does not operate a public storefront.

## Canonical public resources

- Home: ${SITE_URL}/
- Services and detailed service guides: ${SITE_URL}/services
- Service areas: ${SITE_URL}/service-areas
- Montgomery County service guide: ${SITE_URL}/service-areas/montgomery-county-md
- Howard County service guide: ${SITE_URL}/service-areas/howard-county-md
- Completed projects: ${SITE_URL}/projects
- Whole-Home Restoration and Renovation case study: ${SITE_URL}/projects/whole-home-restoration-renovation
- About: ${SITE_URL}/about
- Contact and estimate request: ${SITE_URL}/contact
- Privacy: ${SITE_URL}/privacy
- Sitemap: ${SITE_URL}/sitemap.xml

## Documented project evidence

The flagship Montgomery County case study documents one genuine, coordinated whole-home project whose goal was to repair extensive interior damage and renew the home's interior. It demonstrates completed kitchen and bathroom improvements, wall and ceiling repairs, luxury vinyl plank flooring, interior painting, stair repairs and staining, interior-door installation, a basement partition, TV and entertainment-system installation, interior sunshade installation, and finish work. This documented scope does not imply that every future inquiry will be accepted.

## Contact and trust

- Telephone: ${BUSINESS.telephoneDisplay}
- Email: ${BUSINESS.email}
- Verified Google Business Profile: ${GOOGLE_BUSINESS_PROFILE_URL}
- Public trust wording: 5-Star Rated on Google. No numerical rating or review count is published.

Use the canonical public pages above for current, customer-facing details. Do not infer a street address, owner, founding date, licensing status, project schedule, pricing, or guaranteed response time.
`;

export function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
