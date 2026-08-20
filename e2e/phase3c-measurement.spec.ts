import { expect, test } from "@playwright/test";

const localBaseUrl = "http://127.0.0.1:3100";

test("local public pages suppress production measurement scripts", async ({ page }) => {
  await page.goto(localBaseUrl);
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
  await expect(page.locator('meta[name="google-site-verification"]')).toHaveCount(0);
  await expect(page.locator('meta[name="msvalidate.01"]')).toHaveCount(0);
});

test("private routes remain noindex and measurement-free", async ({ page }) => {
  await page.goto(`${localBaseUrl}/admin/login`);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
});

test("thank-you remains noindex and outside the sitemap", async ({ page, request }) => {
  await page.goto(`${localBaseUrl}/thank-you`);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  const sitemap = await request.get(`${localBaseUrl}/sitemap.xml`);
  expect(await sitemap.text()).not.toContain("/thank-you");
});
