import Header from "@/components/landing_page/Header";
import Hero from "@/components/landing_page/Hero";
import Features from "@/components/landing_page/Features";
import HowItWorks from "@/components/landing_page/HowItWorks";
import Footer from "@/components/landing_page/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  );
}