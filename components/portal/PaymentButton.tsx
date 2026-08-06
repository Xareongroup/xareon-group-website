"use client";
export function PaymentButton({ balanceDue }: { balanceDue: number | null }) { const balance = Number(balanceDue ?? 0); if (balance <= 0) return null; return <button type="button" disabled title="Online payment processing will be enabled in a future release." className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white opacity-60">Pay Now — Coming Soon</button>; }
