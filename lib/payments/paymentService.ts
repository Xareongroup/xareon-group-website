import "server-only";

import type Stripe from "stripe";
import { adminSupabase } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/payments/stripe";
import { recalculateInvoice } from "@/lib/invoices/recalculateInvoice";
import { logCustomerActivity } from "@/lib/activity/logActivity";
import { triggerAutomation } from "@/lib/automation/automationEngine";

const cents = (value: number | null) => Math.round(Number(value ?? 0) * 100);

export async function createPortalCheckout(input: { invoice: { id: string; invoice_number: string | null; balance_due: number | null; customer_id: string | null }; customer: { id: string; email: string | null; first_name: string | null }; portalToken: string; origin: string }) {
  if (!input.invoice.customer_id || input.invoice.customer_id !== input.customer.id) throw new Error("Invoice ownership could not be verified.");
  const amount = cents(input.invoice.balance_due);
  if (amount <= 0) throw new Error("This invoice has no balance due.");
  const invoicePath = `/portal/${encodeURIComponent(input.portalToken)}/invoice/${input.invoice.id}`;
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: input.customer.email ?? undefined,
    line_items: [{ price_data: { currency: "usd", product_data: { name: `XAREON Invoice ${input.invoice.invoice_number ?? input.invoice.id}` }, unit_amount: amount }, quantity: 1 }],
    metadata: { invoice_id: input.invoice.id, customer_id: input.customer.id },
    payment_intent_data: { metadata: { invoice_id: input.invoice.id, customer_id: input.customer.id } },
    success_url: `${input.origin}${invoicePath}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${input.origin}${invoicePath}?payment=cancelled`,
  });
  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  return { id: session.id, url: session.url };
}

export async function recordStripeCheckoutPayment(session: Stripe.Checkout.Session) {
  const invoiceId = session.metadata?.invoice_id;
  const customerId = session.metadata?.customer_id;
  if (!invoiceId || !customerId || session.payment_status !== "paid") return { status: "Skipped" as const, reason: "Session is not a paid XAREON invoice checkout." };
  const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  if (!paymentIntentId) throw new Error("Stripe checkout has no payment intent.");
  const [{ data: invoice, error: invoiceError }, { data: existing, error: existingError }] = await Promise.all([
    adminSupabase.from("invoices").select("id,invoice_number,customer_id,balance_due").eq("id", invoiceId).eq("customer_id", customerId).maybeSingle(),
    adminSupabase.from("payments").select("id").eq("payment_provider", "stripe").eq("provider_transaction_id", paymentIntentId).maybeSingle(),
  ]);
  if (invoiceError) throw invoiceError;
  if (existingError) throw existingError;
  if (!invoice) throw new Error("Stripe checkout invoice is unavailable.");
  if (existing) return { status: "Skipped" as const, reason: "Payment intent was already recorded.", paymentId: existing.id };
  const amount = Number(session.amount_total ?? 0) / 100;
  if (amount <= 0 || amount > Number(invoice.balance_due ?? 0)) throw new Error("Stripe checkout amount does not match the current invoice balance.");
  const { data: payment, error: paymentError } = await adminSupabase.from("payments").insert({
    invoice_id: invoice.id, amount, payment_method: "Card", payment_date: new Date().toISOString(), reference_number: session.id,
    payment_provider: "stripe", provider_transaction_id: paymentIntentId, provider_checkout_session_id: session.id,
    provider_status: "succeeded", provider_metadata: { payment_status: session.payment_status, currency: session.currency },
  }).select("id").single();
  if (paymentError || !payment) throw paymentError ?? new Error("Unable to record Stripe payment.");
  await recalculateInvoice(invoice.id);
  await logCustomerActivity(adminSupabase, invoice.customer_id, "payment_received", "Payment received", `Stripe payment of $${amount.toFixed(2)} was received for invoice #${invoice.invoice_number ?? invoice.id}.`, { type: "payment", id: payment.id });
  await triggerAutomation({ event: "payment_received", entityType: "payment", entityId: payment.id, customerId: invoice.customer_id, title: `Stripe payment of $${amount.toFixed(2)} was received for invoice #${invoice.invoice_number ?? invoice.id}.` });
  return { status: "Succeeded" as const, paymentId: payment.id };
}

export async function recordStripeRefund(charge: Stripe.Charge) {
  const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!paymentIntentId) return { status: "Skipped" as const, reason: "Charge has no payment intent." };
  const { data: payment, error } = await adminSupabase.from("payments").select("id,invoice_id,amount").eq("payment_provider", "stripe").eq("provider_transaction_id", paymentIntentId).maybeSingle();
  if (error) throw error;
  if (!payment) return { status: "Skipped" as const, reason: "No XAREON payment matches this refund." };
  const refundedAmount = Number(charge.amount_refunded ?? 0) / 100;
  const { error: updateError } = await adminSupabase.from("payments").update({ provider_status: charge.refunded ? "refunded" : "partially_refunded", refunded_amount: refundedAmount, refunded_at: new Date().toISOString() }).eq("id", payment.id);
  if (updateError) throw updateError;
  await recalculateInvoice(payment.invoice_id);
  return { status: "Succeeded" as const, paymentId: payment.id };
}
