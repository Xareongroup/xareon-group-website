import { expect, test } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

const stagingRef = "dlhgojerppuowenwwygu";
const enabled = process.env.RUN_STAGING_SMOKE === "true";
const url = process.env.STAGING_SUPABASE_URL;
const anonKey = process.env.STAGING_SUPABASE_PUBLISHABLE_KEY;
const password = process.env.STAGING_TEST_PASSWORD;
const appUrl = process.env.STAGING_APP_URL;

function assertStaging() {
  if (!url || !anonKey || !password) throw new Error("Staging smoke credentials are required.");
  if (new URL(url).hostname !== `${stagingRef}.supabase.co`) throw new Error("Refusing to test a non-staging Supabase project.");
}

async function as(role: "owner" | "manager" | "employee" | "contractor"): Promise<SupabaseClient<Database>> {
  assertStaging();
  const client = createClient<Database>(url!, anonKey!, { auth: { autoRefreshToken: false, persistSession: false } });
  const { error } = await client.auth.signInWithPassword({ email: `staging.${role}@xareon.test`, password: password! });
  expect(error, `${role} sign-in failed`).toBeNull();
  return client;
}

test.describe("staging authenticated CRM, financials, and RBAC smoke", () => {
  test.skip(!enabled, "Set RUN_STAGING_SMOKE=true with staging-only credentials after running scripts/seed-staging-smoke.mjs.");

  test("owner completes CRM and financial workflow", async () => {
    const owner = await as("owner");
    const suffix = `STG-E2E-${Date.now()}`;
    const generatedCustomerNumber = await owner.rpc("generate_customer_number");
    expect(generatedCustomerNumber.error).toBeNull();
    expect(generatedCustomerNumber.data).toMatch(/^CUS-\d{4}-\d{5}$/);
    const customer = await owner.from("customers").insert({ customer_number: generatedCustomerNumber.data!, first_name: "E2E", last_name: suffix, email: `${suffix.toLowerCase()}@xareon.test`, status: "Active", portal_token: suffix }).select("id, portal_token, customer_number").single();
    expect(customer.error).toBeNull();
    expect(customer.data!.customer_number).toBe(generatedCustomerNumber.data);

    const estimate = await owner.from("estimates").insert({ customer_id: customer.data!.id, estimate_code: suffix, status: "Approved", subtotal: 1000, tax: 0, total: 1000 }).select("id, estimate_number").single();
    expect(estimate.error).toBeNull();
    expect(estimate.data!.estimate_number).toEqual(expect.any(Number));

    const job = await owner.from("jobs").insert({ customer_id: customer.data!.id, estimate_id: estimate.data!.id, title: `Job ${suffix}`, status: "Scheduled" }).select("id").single();
    expect(job.error).toBeNull();
    const generatedInvoiceNumber = await owner.rpc("generate_invoice_number");
    expect(generatedInvoiceNumber.error).toBeNull();
    expect(generatedInvoiceNumber.data).toMatch(/^INV-\d{4}-\d{5}$/);
    const invoice = await owner.from("invoices").insert({ customer_id: customer.data!.id, estimate_id: estimate.data!.id, job_id: job.data!.id, invoice_number: generatedInvoiceNumber.data!, status: "Sent", subtotal: 1000, tax: 0, total: 1000, amount_paid: 0, balance_due: 1000 }).select("id").single();
    expect(invoice.error).toBeNull();
    const payment = await owner.from("payments").insert({ invoice_id: invoice.data!.id, amount: 100, payment_method: "Check", reference_number: suffix }).select("id").single();
    expect(payment.error).toBeNull();
    expect((await owner.from("invoice_items").insert({ invoice_id: invoice.data!.id, description: "Staging smoke line item", quantity: 1, unit_price: 1000, total: 1000 }).select("id").single()).error).toBeNull();
    expect((await owner.from("invoice_payments").insert({ invoice_id: invoice.data!.id, amount: 100, payment_method: "Check" }).select("id").single()).error).toBeNull();

    const category = await owner.from("expense_categories").select("id").eq("name", "Miscellaneous").single();
    expect(category.error).toBeNull();
    const vendor = await owner.from("vendors").insert({ name: `Vendor ${suffix}` }).select("id").single();
    expect(vendor.error).toBeNull();
    const expense = await owner.from("expenses").insert({ expense_number: suffix, description: `Expense ${suffix}`, amount: 250, category_id: category.data!.id, vendor_id: vendor.data!.id, job_id: job.data!.id }).select("id, amount").single();
    expect(expense.error).toBeNull();

    const profitability = await owner.from("expenses").select("amount").eq("job_id", job.data!.id);
    expect(profitability.error).toBeNull();
    expect(profitability.data!.reduce((total, row) => total + Number(row.amount), 0)).toBe(250);
    expect(customer.data!.portal_token).toBe(suffix);
  });

  test("RBAC permits owner and manager financial operations, but rejects employee and contractor", async () => {
    const owner = await as("owner");
    const manager = await as("manager");
    const employee = await as("employee");
    const contractor = await as("contractor");
    const suffix = `STG-RBAC-${Date.now()}`;

    expect((await owner.from("vendors").select("id").limit(1)).error).toBeNull();
    expect((await manager.from("customers").insert({ first_name: "Manager", last_name: suffix, email: `${suffix.toLowerCase()}@xareon.test` }).select("id").single()).error).toBeNull();
    const managerInvoice = await manager.from("invoices").insert({ invoice_number: suffix, status: "Draft" }).select("id").single();
    expect(managerInvoice.error).toBeNull();
    expect((await manager.from("vendors").insert({ name: `Manager ${suffix}` }).select("id").single()).error).toBeNull();
    expect((await employee.from("invoices").select("id").limit(1)).data).toEqual([]);
    expect((await employee.from("expenses").select("id").limit(1)).data).toEqual([]);
    expect((await employee.from("invoices").insert({ invoice_number: suffix }).select("id").single()).error).not.toBeNull();
    expect((await employee.from("vendors").insert({ name: `Employee ${suffix}` }).select("id").single()).error).not.toBeNull();
    expect((await contractor.from("invoices").select("id").limit(1)).data).toEqual([]);
    expect((await contractor.from("expenses").select("id").limit(1)).data).toEqual([]);
    expect((await contractor.from("invoices").insert({ invoice_number: suffix }).select("id").single()).error).not.toBeNull();
    expect((await contractor.from("vendors").insert({ name: `Contractor ${suffix}` }).select("id").single()).error).not.toBeNull();
  });

});

test.describe("staging public portal smoke", () => {
  test.skip(!enabled || !appUrl, "Set RUN_STAGING_SMOKE=true and STAGING_APP_URL to the staging deployment configured with staging Supabase.");

  test("public portal opens the seeded customer record", async ({ page }) => {
    await page.goto(`${appUrl}/portal/staging-smoke-20260805`);
    await expect(page.getByText("Welcome, Staging Smoke Customer")).toBeVisible();
  });
});
