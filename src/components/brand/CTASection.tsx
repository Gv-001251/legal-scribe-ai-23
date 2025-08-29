import { Button } from '@/components/ui/button';
import { ArrowRight, Shield } from 'lucide-react';

interface CTASectionProps {
  onGetStarted: () => void;
}

export const CTASection = ({ onGetStarted }: CTASectionProps) => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="fade-in-up">
            <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 font-inter">
              Ready to Secure Your 
              <br />
              <span className="text-primary">Legal Documents?</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
              Join thousands of legal professionals who trust our AI-powered platform 
              for document verification and fraud detection.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="btn-primary text-lg px-8 py-4 rounded-full font-semibold group"
              >
                Start Free Analysis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 rounded-full font-semibold bg-transparent border-border hover:bg-muted/50"
              >
                Schedule Demo
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-muted-foreground text-sm">
                <strong>Secure & Confidential:</strong> All documents are processed with enterprise-grade encryption 
                and automatically deleted after analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};