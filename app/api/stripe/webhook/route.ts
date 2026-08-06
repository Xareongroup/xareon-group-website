import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { adminSupabase } from "@/lib/supabase/admin";
import { getStripe, getStripeWebhookSecret } from "@/lib/payments/stripe";
import { recordStripeCheckoutPayment, recordStripeRefund } from "@/lib/payments/paymentService";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  let event: Stripe.Event;
  try { event = getStripe().webhooks.constructEvent(await request.text(), signature, getStripeWebhookSecret()); }
  catch (error) { console.error("Stripe webhook signature verification failed", error); return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 }); }
  const { data: existing, error: existingError } = await adminSupabase.from("payment_provider_events").select("id,status").eq("provider", "stripe").eq("provider_event_id", event.id).maybeSingle();
  if (existingError) return NextResponse.json({ error: "Webhook ledger is unavailable." }, { status: 500 });
  if (existing?.status === "Succeeded" || existing?.status === "Skipped") return NextResponse.json({ received: true, duplicate: true });
  const { data: ledger, error: insertError } = existing ? { data: existing, error: null } : await adminSupabase.from("payment_provider_events").insert({ provider: "stripe", provider_event_id: event.id, event_type: event.type, details: { livemode: event.livemode } }).select("id").single();
  if (insertError || !ledger) return NextResponse.json({ error: "Unable to record webhook." }, { status: 500 });
  try {
    let result: { status: "Succeeded" | "Skipped"; paymentId?: string; reason?: string } = { status: "Skipped", reason: "Unhandled Stripe event." };
    if (event.type === "checkout.session.completed") result = await recordStripeCheckoutPayment(event.data.object as Stripe.Checkout.Session);
    if (event.type === "charge.refunded") result = await recordStripeRefund(event.data.object as Stripe.Charge);
    if (event.type === "payment_intent.payment_failed") result = { status: "Skipped", reason: "Payment failure recorded without a CRM payment mutation." };
    const { error: updateError } = await adminSupabase.from("payment_provider_events").update({ status: result.status, payment_id: result.paymentId ?? null, processed_at: new Date().toISOString(), details: { event_type: event.type, reason: result.reason ?? null } }).eq("id", ledger.id);
    if (updateError) throw updateError;
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed", { eventId: event.id, type: event.type, error });
    await adminSupabase.from("payment_provider_events").update({ status: "Failed", processed_at: new Date().toISOString() }).eq("id", ledger.id);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
