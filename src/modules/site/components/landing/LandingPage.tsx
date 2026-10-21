import { AnalyticsInitializer } from "@/modules/site/components/landing/AnalyticsInitializer";
import { AboutGfbSection } from "@/modules/site/components/landing/AboutGfbSection";
import { AnimatedLanding } from "@/modules/site/components/landing/AnimatedLanding";
import { AtmosphereGallery } from "@/modules/site/components/landing/AtmosphereGallery";
import { CohortSection } from "@/modules/site/components/landing/CohortSection";
import { FaqSection } from "@/modules/site/components/landing/FaqSection";
import { FinalCta } from "@/modules/site/components/landing/FinalCta";
import { HeroSection } from "@/modules/site/components/landing/HeroSection";
import { HowItWorks } from "@/modules/site/components/landing/HowItWorks";
import { LearningSection } from "@/modules/site/components/landing/LearningSection";
import { LevelingSection } from "@/modules/site/components/landing/LevelingSection";
import { LocationSection } from "@/modules/site/components/landing/LocationSection";
import { MobileConversionBar } from "@/modules/site/components/landing/MobileConversionBar";
import { PricingSection } from "@/modules/site/components/landing/PricingSection";
import { ProofSection } from "@/modules/site/components/landing/ProofSection";
import { RecognitionSection } from "@/modules/site/components/landing/RecognitionSection";
import { ScheduleSection } from "@/modules/site/components/landing/ScheduleSection";
import { SiteFooter } from "@/modules/site/components/landing/SiteFooter";
import { SiteHeader } from "@/modules/site/components/landing/SiteHeader";
import { TeamSection } from "@/modules/site/components/landing/TeamSection";
import { TestimonialsSection } from "@/modules/site/components/landing/TestimonialsSection";
import { WhyGfbSection } from "@/modules/site/components/landing/WhyGfbSection";

export function LandingPage() {
  return (
    <AnimatedLanding>
      <AnalyticsInitializer />
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <SiteHeader />
      <main id="conteudo">
        <HeroSection />
        <RecognitionSection />
        <ProofSection />
        <AboutGfbSection />
        <AtmosphereGallery />
        <HowItWorks />
        <LearningSection />
        <WhyGfbSection />
        <TeamSection />
        <PricingSection />
        <TestimonialsSection />
        <LevelingSection />
        <ScheduleSection />
        <CohortSection />
        <LocationSection />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
      <MobileConversionBar />
    </AnimatedLanding>
  );
}
