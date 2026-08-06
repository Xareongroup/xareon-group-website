import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const mocks = vi.hoisted(() => {
  const rows: Record<string, unknown[]> = { estimates: [], jobs: [], invoices: [] };
  const from = vi.fn((table: string) => {
    const result = { data: rows[table] ?? [], error: null };
    if (table === "estimates") return { select: () => ({ in: () => ({ lte: vi.fn().mockResolvedValue(result) }) }) };
    if (table === "jobs") return { select: () => ({ eq: () => ({ neq: vi.fn().mockResolvedValue(result) }) }) };
    if (table === "invoices") return { select: () => ({ in: () => ({ lte: vi.fn().mockResolvedValue(result) }) }) };
    throw new Error(`Unexpected table ${table}`);
  });
  return { processReminders: vi.fn(), hasOpen: vi.fn(), createTask: vi.fn(), writeLog: vi.fn(), from, rows };
});

vi.mock("@/lib/automation/processReminders", () => ({ processReminders: mocks.processReminders }));
vi.mock("@/lib/automation/automationActions", () => ({ hasOpenAutomationTask: mocks.hasOpen, createAutomationTaskOnce: mocks.createTask, writeAutomationLog: mocks.writeLog }));
vi.mock("@/lib/supabase/admin", () => ({ adminSupabase: { from: mocks.from } }));

import { POST } from "@/app/api/internal/automation/process-reminders/route";
import { NextRequest } from "next/server";

const { processReminders } = await vi.importActual<typeof import("@/lib/automation/processReminders")>("@/lib/automation/processReminders");
const priorSecret = process.env.AUTOMATION_CRON_SECRET;

afterEach(() => {
  if (priorSecret === undefined) delete process.env.AUTOMATION_CRON_SECRET;
  else process.env.AUTOMATION_CRON_SECRET = priorSecret;
  mocks.rows.estimates = []; mocks.rows.jobs = []; mocks.rows.invoices = [];
  vi.clearAllMocks();
});

describe("automation scheduler authentication", () => {
  it("fails closed when the cron secret is missing", async () => {
    delete process.env.AUTOMATION_CRON_SECRET;
    const response = await POST(new NextRequest("https://staging.example/api/internal/automation/process-reminders", { method: "POST" }));
    expect(response.status).toBe(503);
    expect(mocks.processReminders).not.toHaveBeenCalled();
  });

  it("denies invalid scheduler authorization", async () => {
    process.env.AUTOMATION_CRON_SECRET = "test-secret";
    const response = await POST(new NextRequest("https://staging.example/api/internal/automation/process-reminders", { method: "POST", headers: { authorization: "Bearer invalid" } }));
    expect(response.status).toBe(401);
    expect(mocks.processReminders).not.toHaveBeenCalled();
  });

  it("passes an authenticated dry-run to the read-only processor", async () => {
    process.env.AUTOMATION_CRON_SECRET = "test-secret";
    mocks.processReminders.mockResolvedValue({ mode: "dry-run", pendingEstimateReminders: 2, appointmentReminders: 0, invoiceReminders: 3, tasksCreated: 0 });
    const response = await POST(new NextRequest("https://staging.example/api/internal/automation/process-reminders?dryRun=true", { method: "POST", headers: { authorization: "Bearer test-secret" } }));
    expect(response.status).toBe(200);
    expect(mocks.processReminders).toHaveBeenCalledWith({ dryRun: true });
    expect((await response.json()).tasksCreated).toBe(0);
  });
});

describe("automation reminder idempotency", () => {
  it("does not create tasks or logs during a dry run", async () => {
    mocks.rows.estimates = [{ id: "estimate-1", customer_id: "customer-1", estimate_number: "EST-1", created_at: "2026-01-01", status: "Sent" }];
    mocks.hasOpen.mockResolvedValue(false);
    const result = await processReminders({ dryRun: true });
    expect(result).toMatchObject({ mode: "dry-run", pendingEstimateReminders: 1, tasksCreated: 0 });
    expect(mocks.createTask).not.toHaveBeenCalled();
    expect(mocks.writeLog).not.toHaveBeenCalled();
  });

  it("does not plan a reminder when an open duplicate task exists", async () => {
    mocks.rows.estimates = [{ id: "estimate-1", customer_id: "customer-1", estimate_number: "EST-1", created_at: "2026-01-01", status: "Sent" }];
    mocks.hasOpen.mockResolvedValue(true);
    const result = await processReminders({ dryRun: true });
    expect(result).toMatchObject({ pendingEstimateReminders: 0, tasksCreated: 0 });
    expect(mocks.hasOpen).toHaveBeenCalledOnce();
  });
});
