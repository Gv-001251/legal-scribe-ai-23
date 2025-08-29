import { useState } from 'react';
import DocumentWizard from '@/components/DocumentWizard';
import { BrandNavbar } from '@/components/brand/Navbar';
import { BrandHeroSection } from '@/components/brand/HeroSection';
import { FeaturesSection } from '@/components/brand/FeaturesSection';
import { CaseStudiesSection } from '@/components/brand/CaseStudiesSection';
import { CTASection } from '@/components/brand/CTASection';
import { Footer } from '@/components/brand/Footer';

const Index = () => {
  const [showWorkflow, setShowWorkflow] = useState(false);

  const handleGetStarted = () => {
    setShowWorkflow(true);
  };

  if (showWorkflow) {
    return (
      <div className="min-h-screen bg-background">
        <BrandNavbar onGetStarted={handleGetStarted} />
        <div className="container mx-auto px-6 py-32">
          <DocumentWizard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BrandNavbar onGetStarted={handleGetStarted} />
      <BrandHeroSection onGetStarted={handleGetStarted} />
      <FeaturesSection />
      <CaseStudiesSection />
      <CTASection onGetStarted={handleGetStarted} />
      <Footer />
    </div>
  );
};

export default Index;
