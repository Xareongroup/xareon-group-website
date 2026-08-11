import "server-only";

import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("Stripe is not configured.");
  const isProduction = process.env.VERCEL_ENV === "production";
  const expectedPrefix = isProduction ? "sk_live_" : "sk_test_";
  if (process.env.STRIPE_PAYMENTS_ENABLED !== "true" || !secretKey.startsWith(expectedPrefix)) {
    throw new Error(`Stripe payments are not enabled for this ${isProduction ? "production" : "non-production"} environment.`);
  }
  stripeClient ??= new Stripe(secretKey, { apiVersion: "2026-06-24.dahlia" });
  return stripeClient;
}

export function getStripeWebhookSecret() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("Stripe webhook verification is not configured.");
  return secret;
}
