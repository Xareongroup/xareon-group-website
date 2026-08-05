import { expect, test } from "@playwright/test";

// Safe to run against staging: it performs no mutations and verifies that the
// service-role-backed payment endpoints cannot be reached anonymously.
test("staging rejects anonymous payment mutations", async ({ request }) => {
  const response = await request.post("/api/payments", { data: {} });
  expect(response.status()).toBe(401);
});

test("staging redirects anonymous financial access to the admin login", async ({ page }) => {
  await page.goto("/admin/financials");
  await expect(page).toHaveURL(/\/admin\/login/);
});
