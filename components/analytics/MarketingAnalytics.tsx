"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

import { GA4_MEASUREMENT_ID, GOOGLE_ADS_ID } from "@/lib/marketing-config";
import { isMarketingAnalyticsEnabled } from "@/lib/utils/conversions";

const privatePrefixes = ["/admin", "/portal", "/sign", "/pdf", "/signature", "/api"];
const subscribeToHost = () => () => undefined;

export default function MarketingAnalytics() {
  const pathname = usePathname();
  const isPrivateRoute = privatePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const isLiveHost = useSyncExternalStore(subscribeToHost, isMarketingAnalyticsEnabled, () => false);
  const enabled = !isPrivateRoute && isLiveHost;
  const optionalGa4Config = GA4_MEASUREMENT_ID ? `gtag('config','${GA4_MEASUREMENT_ID}');` : "";

  if (!enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} strategy="afterInteractive" />
      <Script id="xareon-google-ads" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}');${optionalGa4Config}`}
      </Script>
    </>
  );
}
