import { NextResponse } from "next/server";

/**
 * Intentionally fail closed until checkout is backed by an authorized invoice
 * lookup and a verified amount. The previous placeholder always charged $150,
 * irrespective of the requested invoice.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Online invoice payments are not available yet. Please contact XAREON GROUP to arrange payment." },
    { status: 503 }
  );
}
