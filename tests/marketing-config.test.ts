import { describe, expect, it } from "vitest";

import {
  validateGa4MeasurementId,
  validateGoogleAdsLeadConversionId,
} from "@/lib/marketing-config";
import { privateRouteMetadata } from "@/lib/site-metadata";

describe("marketing identifier validation", () => {
  it("accepts only a full Google Ads destination for the verified base account", () => {
    expect(validateGoogleAdsLeadConversionId(" AW-18357774354/Verified_Label-1 ")).toBe(
      "AW-18357774354/Verified_Label-1",
    );
    expect(validateGoogleAdsLeadConversionId("AW-18357774354")).toBeUndefined();
    expect(validateGoogleAdsLeadConversionId("AW-99999999999/Unverified")).toBeUndefined();
    expect(validateGoogleAdsLeadConversionId(undefined)).toBeUndefined();
  });

  it("accepts a syntactically valid GA4 measurement ID and rejects unrelated IDs", () => {
    expect(validateGa4MeasurementId(" G-ABC123XYZ ")).toBe("G-ABC123XYZ");
    expect(validateGa4MeasurementId("GTM-ABC123")).toBeUndefined();
    expect(validateGa4MeasurementId(undefined)).toBeUndefined();
  });
});

describe("search verification isolation", () => {
  it("clears inherited verification metadata from private route layouts", () => {
    expect(privateRouteMetadata.verification).toEqual({});
  });
});
