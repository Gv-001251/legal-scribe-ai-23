import { useRef } from 'react';
import DocumentWizard from '@/components/DocumentWizard';
import { HeroSection } from '@/components/HeroSection';
import { Navbar } from '@/components/Navbar';
import { ContactSection } from '@/components/ContactSection';

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const workflowRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: 'hero' | 'workflow' | 'contact') => {
    const refs = {
      hero: heroRef,
      workflow: workflowRef,
      contact: contactRef,
    };

    refs[section].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleScrollToWorkflow = () => {
    scrollToSection('workflow');
  };

  return (
    <div className="min-h-screen">
      <Navbar onScrollToSection={scrollToSection} />
      
      <div ref={heroRef}>
        <HeroSection onScrollToWorkflow={handleScrollToWorkflow} />
      </div>

      <div ref={workflowRef} className="bg-gradient-surface">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              About Our Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform revolutionizes how you interact with legal documents. 
              We provide comprehensive analysis, verification, and intelligent insights to help 
              you understand complex legal language with confidence.
            </p>
          </div>
          
          <DocumentWizard />
        </div>
      </div>

      <div ref={contactRef}>
        <ContactSection />
      </div>
    </div>
  );
};

export default Index;
