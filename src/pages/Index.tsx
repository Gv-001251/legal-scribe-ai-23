import { useState, useRef } from 'react';
import DocumentWizard from '@/components/DocumentWizard';
import { HeroSection } from '@/components/HeroSection';
import { Navbar } from '@/components/Navbar';
import { ContactSection } from '@/components/ContactSection';

const Index = () => {
  const [showWorkflow, setShowWorkflow] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: 'hero' | 'workflow' | 'contact') => {
    if (section === 'hero') {
      setShowWorkflow(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'workflow') {
      setShowWorkflow(true);
    } else if (section === 'contact') {
      contactRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleGetStarted = () => {
    setShowWorkflow(true);
  };

  if (showWorkflow) {
    return (
      <div className="min-h-screen bg-gradient-surface">
        <Navbar onScrollToSection={scrollToSection} />
        <div className="container mx-auto px-4 py-20">
          <DocumentWizard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar onScrollToSection={scrollToSection} />
      <HeroSection onGetStarted={handleGetStarted} />
      
      <div ref={contactRef}>
        <ContactSection />
      </div>
    </div>
  );
};

export default Index;
