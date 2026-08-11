import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const environment = {
  enabled: process.env.STRIPE_PAYMENTS_ENABLED,
  secretKey: process.env.STRIPE_SECRET_KEY,
  vercelEnvironment: process.env.VERCEL_ENV,
};

afterEach(() => {
  if (environment.enabled === undefined) delete process.env.STRIPE_PAYMENTS_ENABLED;
  else process.env.STRIPE_PAYMENTS_ENABLED = environment.enabled;
  if (environment.secretKey === undefined) delete process.env.STRIPE_SECRET_KEY;
  else process.env.STRIPE_SECRET_KEY = environment.secretKey;
  if (environment.vercelEnvironment === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = environment.vercelEnvironment;
  vi.resetModules();
});

describe("Stripe payment environment guard", () => {
  it("fails closed when payments are not explicitly enabled", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_placeholder";
    delete process.env.STRIPE_PAYMENTS_ENABLED;
    const { getStripe } = await import("@/lib/payments/stripe");
    expect(() => getStripe()).toThrow("Stripe payments are not enabled for this non-production environment");
  });

  it("rejects a live Stripe key outside production", async () => {
    process.env.STRIPE_PAYMENTS_ENABLED = "true";
    process.env.STRIPE_SECRET_KEY = "sk_live_placeholder";
    const { getStripe } = await import("@/lib/payments/stripe");
    expect(() => getStripe()).toThrow("Stripe payments are not enabled for this non-production environment");
  });

  it("rejects a test Stripe key in production", async () => {
    process.env.STRIPE_PAYMENTS_ENABLED = "true";
    process.env.STRIPE_SECRET_KEY = "sk_test_placeholder";
    process.env.VERCEL_ENV = "production";
    const { getStripe } = await import("@/lib/payments/stripe");
    expect(() => getStripe()).toThrow("Stripe payments are not enabled for this production environment");
  });

  it("allows a live Stripe key in an explicitly enabled production deployment", async () => {
    process.env.STRIPE_PAYMENTS_ENABLED = "true";
    process.env.STRIPE_SECRET_KEY = "sk_live_placeholder";
    process.env.VERCEL_ENV = "production";
    const { getStripe } = await import("@/lib/payments/stripe");
    expect(() => getStripe()).not.toThrow();
  });
});
