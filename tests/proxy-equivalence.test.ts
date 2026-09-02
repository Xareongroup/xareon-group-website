import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";

const mocks = vi.hoisted(() => ({ createServerClient: vi.fn(), getUser: vi.fn() }));
vi.mock("@supabase/ssr", () => ({ createServerClient: mocks.createServerClient }));

import { config, proxy } from "@/proxy";

describe("Next.js proxy migration equivalence", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable-key";
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
    mocks.createServerClient.mockReturnValue({ auth: { getUser: mocks.getUser } });
  });

  it.each([
    ["/admin", true],
    ["/admin/login", true],
    ["/admin/customers/123", true],
    ["/portal", false],
    ["/signature", false],
    ["/api/contact", false],
    ["/services", false],
  ])("retains matcher behavior for %s", (url, expected) => {
    expect(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url })).toBe(expected);
  });

  it("retains Supabase auth refresh and cookie propagation behavior", async () => {
    const request = new NextRequest("https://www.xareongroup.com/admin", { headers: { cookie: "existing=value" } });
    const responsePromise = proxy(request);
    const cookieAdapter = mocks.createServerClient.mock.calls[0][2].cookies;
    expect(cookieAdapter.getAll()).toEqual(expect.arrayContaining([expect.objectContaining({ name: "existing", value: "value" })]));
    cookieAdapter.setAll([{ name: "refreshed", value: "token", options: { httpOnly: true, sameSite: "lax", path: "/" } }]);
    const response = await responsePromise;

    expect(mocks.createServerClient).toHaveBeenCalledWith("https://example.supabase.co", "publishable-key", expect.any(Object));
    expect(mocks.getUser).toHaveBeenCalledOnce();
    expect(response.cookies.get("refreshed")?.value).toBe("token");
    expect(response.headers.get("location")).toBeNull();
  });
});
