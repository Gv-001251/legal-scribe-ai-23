import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onScrollToWorkflow: () => void;
}

export const HeroSection = ({ onScrollToWorkflow }: HeroSectionProps) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Legal Document Assistant
          </h1>
          
          <div className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            <p className="mb-4">
              We help users verify, analyze, and understand legal documents with AI-driven insights.
            </p>
            <p className="text-lg">
              Get instant document verification, alterability analysis, and interactive AI assistance 
              to make sense of complex legal language.
            </p>
          </div>

          <div className="mb-12">
            <Button
              onClick={onScrollToWorkflow}
              size="lg"
              className="text-lg px-8 py-4 bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={onScrollToWorkflow}
            className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors group"
            aria-label="Scroll to workflow"
          >
            <span className="text-sm mb-2">Scroll Down</span>
            <ChevronDown className="w-6 h-6 animate-bounce group-hover:text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
};