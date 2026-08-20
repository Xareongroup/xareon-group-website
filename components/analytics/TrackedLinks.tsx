"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, MouseEventHandler, ReactNode } from "react";

import { getCurrentAttribution, rememberEstimateAttribution, trackMarketingEvent } from "@/lib/utils/conversions";

type AnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  children: ReactNode;
  placement: string;
};

type EstimateProps = AnchorProps & LinkProps;

export function TrackedEstimateLink({ placement, children, onClick, ...props }: EstimateProps & { onClick?: MouseEventHandler<HTMLAnchorElement> }) {
  return (
    <Link {...props} onClick={(event) => {
      const context = getCurrentAttribution();
      rememberEstimateAttribution(context);
      trackMarketingEvent("estimate_cta_click", { placement, ...context });
      onClick?.(event);
    }}>
      {children}
    </Link>
  );
}

export function TrackedPhoneLink({ placement, children, ...props }: AnchorProps) {
  return <a {...props} href="tel:+12022868497" onClick={() => trackMarketingEvent("phone_click", { placement, ...getCurrentAttribution() })}>{children}</a>;
}

export function TrackedEmailLink({ placement, children, ...props }: AnchorProps) {
  return <a {...props} href="mailto:info@xareongroup.com" onClick={() => trackMarketingEvent("email_click", { placement, ...getCurrentAttribution() })}>{children}</a>;
}
