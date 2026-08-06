import { NextRequest, NextResponse } from "next/server";
import { processReminders } from "@/lib/automation/processReminders";

export async function POST(request: NextRequest) {
  const secret = process.env.AUTOMATION_CRON_SECRET;
  // Fail closed when staging has not been configured. This route is never a
  // public automation trigger and accepts only a bearer token in a header.
  if (!secret) {
    console.error("AUTOMATION_CRON_SECRET is not configured.");
    return NextResponse.json({ error: "Automation scheduler is unavailable." }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const dryRun = request.nextUrl.searchParams.get("dryRun") === "true";
  try { return NextResponse.json({ ok: true, ...(await processReminders({ dryRun })) }); }
  catch (error) { console.error("Reminder processing failed", error); return NextResponse.json({ error: "Reminder processing failed" }, { status: 500 }); }
}
