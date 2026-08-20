import { describe, expect, it, vi } from "vitest";

import {
  createIndexNowVerificationResponse,
  getIndexNowKeyLocation,
  isApprovedIndexNowUrl,
  submitIndexNowUrls,
} from "@/lib/indexnow";

const testKey = "BingGenerated-Test-Key-123";

describe("IndexNow key verification", () => {
  it("returns only the configured key at its exact root filename", async () => {
    const response = createIndexNowVerificationResponse(`${testKey}.txt`, testKey);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(await response.text()).toBe(testKey);
  });

  it("returns 404 for absent, malformed, or mismatched keys", async () => {
    expect(createIndexNowVerificationResponse(`${testKey}.txt`, undefined).status).toBe(404);
    expect(createIndexNowVerificationResponse("different-key.txt", testKey).status).toBe(404);
    expect(createIndexNowVerificationResponse("short.txt", "short").status).toBe(404);
  });
});

describe("IndexNow URL allowlisting", () => {
  it("accepts only approved canonical production URLs", () => {
    expect(isApprovedIndexNowUrl("https://www.xareongroup.com/")).toBe(true);
    expect(isApprovedIndexNowUrl("https://www.xareongroup.com/services/drywall-repair")).toBe(true);
    expect(isApprovedIndexNowUrl("https://www.xareongroup.com/service-areas/montgomery-county-md")).toBe(true);
  });

  it.each([
    "https://www.xareongroup.com/admin/login",
    "https://www.xareongroup.com/portal",
    "https://www.xareongroup.com/sign/estimate/token",
    "https://www.xareongroup.com/signature",
    "https://www.xareongroup.com/pdf/invoice",
    "https://www.xareongroup.com/api/contact",
    "https://www.xareongroup.com/thank-you",
  ])("rejects private or non-indexable route %s", (url) => {
    expect(isApprovedIndexNowUrl(url)).toBe(false);
  });

  it.each([
    "not-a-url",
    "https://example.com/services",
    "https://xareongroup.com/services",
    "http://www.xareongroup.com/services",
    "https://www.xareongroup.com/services?preview=true",
    "https://www.xareongroup.com/services#section",
  ])("rejects malformed, foreign, non-canonical, or decorated URL %s", (url) => {
    expect(isApprovedIndexNowUrl(url)).toBe(false);
  });
});

describe("IndexNow submission", () => {
  it("posts an approved canonical batch with the required key location", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(null, { status: 202 }));
    const urls = [
      "https://www.xareongroup.com/services",
      "https://www.xareongroup.com/services/drywall-repair",
    ];

    const result = await submitIndexNowUrls(urls, { key: testKey, fetch: fetchMock });

    expect(result).toEqual({ status: "submitted", submittedUrls: urls, responseStatus: 202 });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(String(init?.body))).toEqual({
      host: "www.xareongroup.com",
      key: testKey,
      keyLocation: getIndexNowKeyLocation(testKey),
      urlList: urls,
    });
  });

  it("does not call IndexNow when any URL is rejected", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    const result = await submitIndexNowUrls(
      ["https://www.xareongroup.com/services", "https://www.xareongroup.com/admin"],
      { key: testKey, fetch: fetchMock },
    );

    expect(result.status).toBe("rejected");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("remains inactive without a valid configured key", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    expect(
      await submitIndexNowUrls(["https://www.xareongroup.com/services"], {
        key: "invalid key",
        fetch: fetchMock,
      }),
    ).toEqual({ status: "disabled" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("turns API and network failures into non-throwing results", async () => {
    const apiFailure = vi.fn<typeof fetch>(async () => new Response(null, { status: 429 }));
    const networkFailure = vi.fn<typeof fetch>(async () => {
      throw new Error("safe mocked outage");
    });

    await expect(
      submitIndexNowUrls(["https://www.xareongroup.com/services"], {
        key: testKey,
        fetch: apiFailure,
      }),
    ).resolves.toMatchObject({ status: "failed", responseStatus: 429 });
    await expect(
      submitIndexNowUrls(["https://www.xareongroup.com/services"], {
        key: testKey,
        fetch: networkFailure,
      }),
    ).resolves.toMatchObject({ status: "failed" });
  });
});
