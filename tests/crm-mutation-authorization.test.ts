import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const protectedStaffMutationRoutes = [
  "app/api/customers/regenerate-portal/route.ts",
  "app/api/customers/send-portal-email/route.ts",
  "app/api/estimates/[id]/signing-link/route.ts",
  "app/api/estimates/[id]/convert-to-job/route.ts",
  "app/api/estimates/[id]/email/route.ts",
  "app/api/estimates/[id]/send/route.ts",
  "app/api/estimates/[id]/pdf/route.ts",
  "app/api/estimates/[id]/signed-pdf/route.ts",
  "app/api/contracts/create-from-estimate/route.ts",
  "app/api/contracts/[id]/email/route.tsx",
  "app/api/contracts/[id]/send/route.ts",
  "app/api/contracts/[id]/signed-pdf/route.ts",
  "app/api/jobs/[id]/complete/route.ts",
  "app/api/jobs/[id]/create-invoice/route.ts",
  "app/api/invoices/[id]/payment/route.ts",
];

describe("CRM mutation authorization", () => {
  it.each(protectedStaffMutationRoutes)("guards %s before performing staff mutations", (route) => {
    const source = readFileSync(join(process.cwd(), route), "utf8");
    expect(source).toContain("requireApiRole");
    expect(source).toMatch(/const access = await requireApiRole\(/);
    expect(source).toContain('if ("response" in access) return access.response;');
  });
});
