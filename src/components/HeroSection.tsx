import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Eye, MessageSquare } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="min-h-screen bg-animated-gradient py-20">
      <div className="container mx-auto px-4">
        {/* Main Hero Content */}
        <div className="glass-card rounded-3xl p-12 mb-16 shadow-glow">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-inter">
              Legal Document Assistant
            </h1>
            
            <div className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-4xl mx-auto">
              <p className="mb-4 font-medium">
                We help users verify, analyze, and understand legal documents with AI-driven insights.
              </p>
              <p className="text-lg text-white/80">
                Get instant document verification, alterability analysis, and interactive AI assistance 
                to make sense of complex legal language.
              </p>
            </div>

            <Button
              onClick={onGetStarted}
              size="lg"
              className="text-lg px-10 py-6 bg-white text-primary hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-lg font-semibold rounded-full"
            >
              Get Started →
            </Button>
          </div>
        </div>

        {/* About Our Platform Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4 font-inter">
              About Our Platform
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Our AI-powered platform revolutionizes how you interact with legal documents. 
              We provide comprehensive analysis, verification, and intelligent insights to help 
              you understand complex legal language with confidence.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card p-8 text-center hover:shadow-card transition-all duration-300 hover:scale-105 border-0">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 font-inter">Document Verification</h3>
              <p className="text-white/80 leading-relaxed">
                AI-powered verification checks for document validity, formatting issues, and missing required fields.
              </p>
            </Card>

            <Card className="glass-card p-8 text-center hover:shadow-card transition-all duration-300 hover:scale-105 border-0">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 font-inter">Alterability Analysis</h3>
              <p className="text-white/80 leading-relaxed">
                Advanced analysis to detect if documents have been tampered with or could be easily altered.
              </p>
            </Card>

            <Card className="glass-card p-8 text-center hover:shadow-card transition-all duration-300 hover:scale-105 border-0">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 font-inter">AI Chat Assistant</h3>
              <p className="text-white/80 leading-relaxed">
                Interactive AI that can explain clauses, summarize sections, and answer questions about your documents.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};