"use client";

import { useEffect } from "react";

/** Opens the browser print dialog only after the preview document has mounted. */
export default function PrintOnLoad() {
  useEffect(() => {
    const timer = window.setTimeout(() => window.print(), 150);
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
