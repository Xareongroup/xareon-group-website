"use client";

import Script from "next/script";

export default function SoroBlogEmbed() {
  return (
    <>
      <div id="soro-blog" />
      <Script
        id="soro-blog-widget"
        src="https://app.trysoro.com/api/embed/6f76f94d-c8e0-45f5-bb6f-0b80798f1ab2"
        strategy="afterInteractive"
      />
    </>
  );
}
