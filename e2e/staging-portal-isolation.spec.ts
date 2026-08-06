import { expect, test } from "@playwright/test";

const enabled = process.env.RUN_STAGING_PORTAL === "true";
const a = { token: "staging-portal-a-20260805", estimateId: process.env.PORTAL_A_ESTIMATE_ID, invoiceId: process.env.PORTAL_A_INVOICE_ID, documentId: process.env.PORTAL_A_DOCUMENT_ID };
const b = { token: "staging-portal-b-20260805", estimateId: process.env.PORTAL_B_ESTIMATE_ID, invoiceId: process.env.PORTAL_B_INVOICE_ID, documentId: process.env.PORTAL_B_DOCUMENT_ID };

test.describe("staging portal isolation", () => {
  test.skip(!enabled || !a.estimateId || !a.invoiceId || !a.documentId || !b.estimateId || !b.invoiceId || !b.documentId, "Seed portal fixtures and supply PORTAL_A/B IDs.");
  test("customer token cannot cross customer record boundaries", async ({ page }) => {
    expect((await page.goto(`/portal/${a.token}`))?.status()).toBe(200);
    expect((await page.goto(`/portal/${a.token}/estimate/${a.estimateId}`))?.status()).toBe(200);
    expect((await page.goto(`/portal/${a.token}/invoice/${a.invoiceId}`))?.status()).toBe(200);
    expect((await page.request.get(`/portal/${a.token}/documents/${a.documentId}`))?.ok()).toBeTruthy();
    expect((await page.goto(`/portal/${a.token}/estimate/${b.estimateId}`))?.status()).toBe(404);
    expect((await page.goto(`/portal/${a.token}/invoice/${b.invoiceId}`))?.status()).toBe(404);
    expect((await page.request.get(`/portal/${a.token}/documents/${b.documentId}`))?.status()).toBe(404);
    expect((await page.goto(`/portal/not-a-valid-token-20260805`))?.status()).toBe(404);
  });
});
