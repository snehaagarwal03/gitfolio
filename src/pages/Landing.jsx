import SiteHeader from "../components/landing/SiteHeader";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import PricingSection from "../components/landing/PricingSection";
import FaqsSection from "../components/landing/FaqsSection";
import CtaSection from "../components/landing/CtaSection";
import SiteFooter from "../components/landing/SiteFooter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-primary selection:text-primary-foreground">
      <SiteHeader />
      <main>
        <HeroSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
        <div id="pricing">
          <PricingSection />
        </div>
        <div id="faqs">
          <FaqsSection />
        </div>
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
