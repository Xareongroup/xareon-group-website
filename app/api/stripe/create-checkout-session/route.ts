import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";

export async function POST(request: Request) {
  try {
    const { invoiceId } = await request.json();

    // TODO:
    // Replace this with the real invoice lookup from your database.
    const invoice = {
      id: invoiceId,
      number: "INV-1001",
      total: 150,
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            product_data: {
              name: `Invoice ${invoice.number}`,
            },
            unit_amount: invoice.total * 100, // Stripe expects cents
          },
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/payment-cancelled`,

      metadata: {
        invoiceId: invoice.id,
      },
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to create checkout session." },
      { status: 500 }
    );
  }
}