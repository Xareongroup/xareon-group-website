import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import WhyChoose from "@/components/home/WhyChoose";
import Portfolio from "@/components/home/Portfolio";
import Reviews from "@/components/home/Reviews";
import CallToAction from "@/components/home/CallToAction";
import Contact from "@/components/home/Contact";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <WhyChoose />
      <Portfolio />
      <Reviews />
      <CallToAction />
      <Contact />
      <Footer />
    </>
  );
}