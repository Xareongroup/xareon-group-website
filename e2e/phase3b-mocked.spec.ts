import { expect, test, type Page } from "@playwright/test";

async function mockTurnstile(page: Page) {
  await page.route("https://challenges.cloudflare.com/turnstile/v0/api.js*", async (route) => {
    await route.fulfill({
      contentType: "application/javascript",
      body: `window.turnstile={render:function(_,options){setTimeout(function(){options.callback('safe-test-token')},0);return 'safe-widget'},reset:function(){},remove:function(){},getResponse:function(){return 'safe-test-token'}};`,
    });
  });
}

async function completeForm(page: Page) {
  await page.getByPlaceholder("John Smith").fill("Test Visitor");
  await page.getByPlaceholder("john@email.com").fill("test@example.com");
  await page.getByPlaceholder("(202) 286-8497").fill("2025550100");
  await page.getByLabel("Service Needed *").selectOption({ label: "Home Repair" });
  await page.getByLabel("Property Type *").selectOption({ label: "Residential" });
  await page.getByPlaceholder("Rockville").fill("Rockville");
  await page.getByPlaceholder("Tell us about your project...").fill("A safe mocked browser test for the estimate confirmation flow.");
}

test("mocked successful request reaches thank-you and accepts a photo", async ({ page }) => {
  await mockTurnstile(page);
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, leadNumber: "TEST-ONLY" }) });
  });
  await page.goto("http://127.0.0.1:3100/#contact");
  await completeForm(page);
  await page.locator('input[type="file"]').setInputFiles({ name: "project-test.png", mimeType: "image/png", buffer: Buffer.from("safe-test-image") });
  await expect(page.getByText("project-test.png")).toBeVisible();
  await page.getByRole("button", { name: "Request Free Estimate" }).click();
  await expect(page).toHaveURL("http://127.0.0.1:3100/thank-you");
  await expect(page.getByRole("heading", { name: "Thank you for contacting XAREON GROUP" })).toBeVisible();
});

test("mocked backend error remains on the form", async ({ page }) => {
  await mockTurnstile(page);
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ success: false, error: "Safe mocked failure" }) });
  });
  page.on("dialog", (dialog) => dialog.dismiss());
  await page.goto("http://127.0.0.1:3100/#contact");
  await completeForm(page);
  await page.getByRole("button", { name: "Request Free Estimate" }).click();
  await expect(page).toHaveURL("http://127.0.0.1:3100/#contact");
  await expect(page.getByRole("button", { name: "Request Free Estimate" })).toBeEnabled();
});
