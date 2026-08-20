export const GOOGLE_ADS_ID = "AW-18357774354";

const googleAdsLeadDestinationPattern = /^AW-18357774354\/[A-Za-z0-9_-]+$/;
const ga4MeasurementIdPattern = /^G-[A-Z0-9]+$/;

function validatedPublicIdentifier(value: string | undefined, pattern: RegExp) {
  const candidate = value?.trim();
  return candidate && pattern.test(candidate) ? candidate : undefined;
}

export function validateGoogleAdsLeadConversionId(value: string | undefined) {
  return validatedPublicIdentifier(value, googleAdsLeadDestinationPattern);
}

export function validateGa4MeasurementId(value: string | undefined) {
  return validatedPublicIdentifier(value, ga4MeasurementIdPattern);
}

/** Full Google Ads conversion destination, including its verified label. */
export const GOOGLE_ADS_LEAD_CONVERSION_ID = validateGoogleAdsLeadConversionId(
  process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_ID,
);

/** Optional GA4 measurement ID. No GA4 tag is emitted until this validates. */
export const GA4_MEASUREMENT_ID = validateGa4MeasurementId(
  process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
);
