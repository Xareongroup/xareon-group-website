import { test, expect } from "@playwright/test";
test("unauthenticated admin routes redirect to login", async ({ page }) => { await page.goto("/admin/financials"); await expect(page).toHaveURL(/\/admin\/login/); });
