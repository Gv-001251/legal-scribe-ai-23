import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Eye, MessageSquare } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        {/* Main Hero Content */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Legal Document Assistant
          </h1>
          
          <div className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
            <p className="mb-4">
              We help users verify, analyze, and understand legal documents with AI-driven insights.
            </p>
            <p className="text-lg">
              Get instant document verification, alterability analysis, and interactive AI assistance 
              to make sense of complex legal language.
            </p>
          </div>

          <Button
            onClick={onGetStarted}
            size="lg"
            className="text-lg px-8 py-4 bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            Get Started
          </Button>
        </div>

        {/* About Our Platform Section */}
        <div className="max-w-6xl mx-auto">
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

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Document Verification</h3>
              <p className="text-muted-foreground">
                AI-powered verification checks for document validity, formatting issues, and missing required fields.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Alterability Analysis</h3>
              <p className="text-muted-foreground">
                Advanced analysis to detect if documents have been tampered with or could be easily altered.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">AI Chat Assistant</h3>
              <p className="text-muted-foreground">
                Interactive AI that can explain clauses, summarize sections, and answer questions about your documents.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};