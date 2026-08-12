import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const readSource = (...path: string[]) => readFileSync(join(process.cwd(), ...path), "utf8");

describe("customer portal signing and document experience", () => {
  it("passes the portal token to signed estimate and contract flows", () => {
    expect(readSource("app", "portal", "[token]", "estimate", "[id]", "page.tsx")).toContain("portalToken={token}");
    expect(readSource("app", "portal", "[token]", "contract", "[id]", "page.tsx")).toContain("portalToken={token}");
  });

  it("shows confirmation and redirects portal signing flows only after success", () => {
    for (const file of ["EstimateSignature.tsx", "ContractSignature.tsx"]) {
      const source = readSource("components", "public", file);
      expect(source).toContain("setCompleted(true)");
      expect(source).toContain("router.refresh()");
      expect(source).toContain("router.push(`/portal/${encodeURIComponent(portalToken)}`)");
      expect(source).toContain("2500");
    }
  });

  it("uses the shared branded document shell for signed portal artifacts", () => {
    expect(readSource("components", "documents", "SignedEstimatePDF.tsx")).toContain('import DocumentPdfShell from "@/components/pdf/DocumentPdfShell"');
    expect(readSource("components", "documents", "SignedContractPDF.tsx")).toContain('import DocumentPdfShell from "@/components/pdf/DocumentPdfShell"');
  });
});
