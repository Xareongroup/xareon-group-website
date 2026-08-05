import { test, expect } from "@playwright/test";
test.skip(!process.env.E2E_AUTH_STATE, "Requires a seeded admin session via E2E_AUTH_STATE");
test("financials workflow navigation is available", async ({ page }) => { await page.goto("/admin/financials"); await expect(page.getByRole("heading", { name:"Financial Dashboard" })).toBeVisible(); await page.getByRole("link", { name:"Expenses" }).click(); await expect(page).toHaveURL(/\/admin\/financials\/expenses/); });
