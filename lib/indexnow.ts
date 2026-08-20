import "server-only";

import { PUBLIC_INDEXABLE_PATHS } from "@/lib/public-routes";

export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
export const INDEXNOW_CANONICAL_ORIGIN = "https://www.xareongroup.com";

const indexNowKeyPattern = /^[A-Za-z0-9-]{8,128}$/;

export function getIndexNowKey(value = process.env.INDEXNOW_KEY) {
  const key = value?.trim();
  return key && indexNowKeyPattern.test(key) ? key : undefined;
}

export function getIndexNowKeyLocation(key: string) {
  return `${INDEXNOW_CANONICAL_ORIGIN}/${key}.txt`;
}

export function createIndexNowVerificationResponse(
  requestedFile: string,
  configuredKey = process.env.INDEXNOW_KEY,
) {
  const key = getIndexNowKey(configuredKey);
  if (!key || requestedFile !== `${key}.txt`) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(key, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export function isApprovedIndexNowUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.origin === INDEXNOW_CANONICAL_ORIGIN &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      PUBLIC_INDEXABLE_PATHS.has(url.pathname)
    );
  } catch {
    return false;
  }
}

type IndexNowResult =
  | { status: "disabled" }
  | { status: "rejected"; rejectedUrls: string[] }
  | { status: "submitted"; submittedUrls: string[]; responseStatus: number }
  | { status: "failed"; submittedUrls: string[]; responseStatus?: number };

export async function submitIndexNowUrls(
  urls: readonly string[],
  options: { key?: string; fetch?: typeof fetch } = {},
): Promise<IndexNowResult> {
  const key = getIndexNowKey(options.key);
  if (!key) return { status: "disabled" };

  const uniqueUrls = [...new Set(urls)];
  const rejectedUrls = uniqueUrls.filter((url) => !isApprovedIndexNowUrl(url));
  if (!uniqueUrls.length || rejectedUrls.length) {
    return { status: "rejected", rejectedUrls };
  }

  const fetchImplementation = options.fetch ?? fetch;

  try {
    const response = await fetchImplementation(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "www.xareongroup.com",
        key,
        keyLocation: getIndexNowKeyLocation(key),
        urlList: uniqueUrls,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return { status: "failed", submittedUrls: uniqueUrls, responseStatus: response.status };
    }

    return { status: "submitted", submittedUrls: uniqueUrls, responseStatus: response.status };
  } catch {
    return { status: "failed", submittedUrls: uniqueUrls };
  }
}
