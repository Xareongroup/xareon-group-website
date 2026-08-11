"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function SoroBlogEmbed() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div id="soro-blog" />
      {mounted && (
        <Script
          id="soro-blog-widget"
          src="https://app.trysoro.com/api/embed/676f94d-c8e0-45f5-bb6f-0b80798f1ab2"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
