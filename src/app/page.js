import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import TrustStrip from "@/components/sections/TrustStrip";
import CategoriesSection from "@/components/sections/CategoriesSection";
import CustomManufacturingSection from "@/components/sections/CustomManufacturingSection";
import IndustriesSection from "@/components/sections/IndustriesSection";
import QualitySection from "@/components/sections/QualitySection";
import CtaSection from "@/components/sections/CtaSection";

export default function Home() {
  return (
    <>
      {/* Platform Header */}
      <Header />

      {/* Main Content Area */}
      <main className="w-full bg-surface min-h-screen flex flex-col">
        {/* 1. Hero Section with 3D Fastener */}
        <HeroSection />

        {/* 2. Trust and Capability Proof Strip */}
        <TrustStrip />

        {/* 3. Product Categories Showcase (7 Disciplines) */}
        <CategoriesSection />

        {/* 4. Custom Manufacturing & OEM Feature */}
        <CustomManufacturingSection />

        {/* 5. Industrial Sector Specializations */}
        <IndustriesSection />

        {/* 6. Quality Assurance & Metallurgical Lab */}
        <QualitySection />

        {/* 7. Enterprise Supply Desk Closing CTA */}
        <CtaSection />
      </main>

      {/* Platform Footer */}
      <Footer />

    </>
  );
}
