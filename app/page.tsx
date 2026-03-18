"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { HeroSection } from "@/components/camping/hero-section";
import { EventHighlights } from "@/components/camping/event-highlights";
import { SpeakerSection } from "@/components/camping/speaker-section";
import { PricingSection } from "@/components/camping/pricing-section";
import { ContactSection } from "@/components/camping/contact-section";
import { RegistrationCTA } from "@/components/camping/registration-cta";
import { Footer } from "@/components/camping/footer";
import { PaymentCompletedScreen } from "@/components/payment/payment-completed";

function PageContent() {
  const searchParams = useSearchParams();
  const paymentCompleted = searchParams.get("paymentCompleted");

  if (paymentCompleted) {
    return <PaymentCompletedScreen />;
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <HeroSection />
      <EventHighlights />
      <SpeakerSection />
      <PricingSection />
      <ContactSection />
      <RegistrationCTA />
      <Footer />
    </main>
  );
}

export default function CampingPage() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}
