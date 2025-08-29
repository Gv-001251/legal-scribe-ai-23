import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

interface BrandHeroSectionProps {
  onGetStarted: () => void;
}

export const BrandHeroSection = ({ onGetStarted }: BrandHeroSectionProps) => {
  return (
    <section id="hero" className="hero-section min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Hero Content */}
          <div className="fade-in-up">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-8">
              <span className="text-primary font-medium text-sm">
                ✨ AI-Powered Legal Document Analysis
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-tight font-inter tracking-tight">
              Verify Legal
              <br />
              <span className="text-primary">Documents</span>
              <br />
              with Confidence
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-4xl mx-auto">
              Advanced AI technology to verify, analyze, and understand legal documents. 
              Detect fraud, ensure authenticity, and get intelligent insights in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="btn-primary text-lg px-8 py-4 rounded-full font-semibold group"
              >
                Start Analysis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 rounded-full font-semibold bg-transparent border-border hover:bg-muted/50"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">99.9%</div>
                <div className="text-muted-foreground font-medium">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">5M+</div>
                <div className="text-muted-foreground font-medium">Documents Analyzed</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">50K+</div>
                <div className="text-muted-foreground font-medium">Legal Professionals</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">&lt;2min</div>
                <div className="text-muted-foreground font-medium">Average Analysis</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};