import { Footer } from '@/components/layout/Footer';
import { LandingAbout } from '@/components/sections/landing/LandingAbout';
import { LandingCollections } from '@/components/sections/landing/LandingCollections';
import { LandingContact } from '@/components/sections/landing/LandingContact';
import { LandingHero } from '@/components/sections/landing/LandingHero';

export function LandingPage() {
  return (
    <div className="space-y-12 md:space-y-20">
      <LandingHero />
      <LandingCollections />
      <LandingAbout />
      <LandingContact />

      <Footer />
    </div>
  );
}
