"use client";

import Button from "@/components/ui/Button";

interface Props {
  invoiceId: string;
}

export default function PayInvoiceButton({
  invoiceId,
}: Props) {
  async function handlePayment() {
    const response = await fetch(
      "/api/stripe/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoiceId,
        }),
      }
    );

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <Button onClick={handlePayment}>
      Pay Invoice
    </Button>
  );
}