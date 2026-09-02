import fs from "node:fs";
import path from "node:path";
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));
vi.mock("next/image", () => ({ default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => React.createElement("img", props) }));
vi.mock("@/components/analytics/TrackedLinks", () => ({
  TrackedEstimateLink: ({ children, placement, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { placement: string }) => {
    void placement;
    return <a {...props}>{children}</a>;
  },
  TrackedPhoneLink: ({ children, placement, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { placement: string }) => {
    void placement;
    return <a href="tel:+12022868497" {...props}>{children}</a>;
  },
}));

import Navbar from "@/components/layout/Navbar";

describe("public navigation accessibility", () => {
  beforeEach(() => { pathname = "/"; });
  afterEach(cleanup);

  it("exposes the skip link and a consistent public main target", () => {
    const layout = fs.readFileSync(path.join(process.cwd(), "app/layout.tsx"), "utf8");
    expect(layout).toContain('href="#main-content"');

    const publicMainFiles = [
      "app/page.tsx", "app/services/page.tsx", "components/services/ServiceDetailPage.tsx",
      "app/service-areas/montgomery-county-md/page.tsx", "app/service-areas/howard-county-md/page.tsx",
      "app/about/page.tsx", "app/contact/page.tsx", "app/privacy/page.tsx",
    ];
    for (const file of publicMainFiles) {
      expect(fs.readFileSync(path.join(process.cwd(), file), "utf8"), file).toContain('id="main-content"');
    }
  });

  it("retains accessible contact-form validation wiring", () => {
    const form = fs.readFileSync(path.join(process.cwd(), "components/QuoteForm.tsx"), "utf8");
    expect(form).toContain("aria-invalid={Boolean(errors.name)}");
    expect(form).toContain('aria-describedby={errors.name ? "quote-name-error" : undefined}');
    expect(form).toContain('id="quote-name-error"');
    expect(form).toContain("setFocus(firstInvalidField)");
    expect(form).toContain('role="alert" aria-live="assertive"');
  });

  it("reports mobile-menu state and restores trigger focus after Escape", () => {
    render(<Navbar />);
    const button = screen.getByRole("button", { name: "Open navigation menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", "mobile-navigation");

    fireEvent.click(button);
    expect(screen.getByRole("button", { name: "Close navigation menu" })).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("mobile-navigation")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("button", { name: "Open navigation menu" })).toHaveFocus();
    expect(document.getElementById("mobile-navigation")).not.toBeInTheDocument();
  });

  it("closes the mobile menu when the route changes", () => {
    const view = render(<Navbar />);
    fireEvent.click(screen.getByRole("button", { name: "Open navigation menu" }));
    pathname = "/services";
    view.rerender(<Navbar />);
    expect(screen.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-navigation")).not.toBeInTheDocument();
  });
});
