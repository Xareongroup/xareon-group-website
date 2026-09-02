import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import WhyChoose from "@/components/home/WhyChoose";
import Portfolio from "@/components/home/Portfolio";
import Reviews from "@/components/home/Reviews";
import CallToAction from "@/components/home/CallToAction";
import Contact from "@/components/home/Contact";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { createPublicPageMetadata } from "@/lib/site-metadata";
import { createPublicPageSchema } from "@/lib/structured-data";

const title = "Home Services in Montgomery & Howard Counties | XAREON GROUP";
const description =
  "Home repair and installation services in Montgomery and Howard counties, with select projects accepted in Washington, D.C. and Northern Virginia.";

export const metadata = createPublicPageMetadata({
  path: "/",
  title,
  description,
});

const structuredData = createPublicPageSchema({
  path: "/",
  name: title,
  description,
  includePrimaryImage: true,
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Services />
        <WhyChoose />
        <Portfolio />
        <Reviews />
        <CallToAction />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
