import { Card } from '@/components/ui/card';
import { Shield, Zap, MessageSquare, FileSearch, AlertTriangle, CheckCircle } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Document Verification",
      description: "Advanced AI algorithms verify document authenticity and detect tampering with 99.9% accuracy."
    },
    {
      icon: FileSearch,
      title: "Deep Analysis",
      description: "Comprehensive document analysis including content validation, formatting checks, and metadata examination."
    },
    {
      icon: AlertTriangle,
      title: "Fraud Detection",
      description: "Identify potential fraud indicators, altered signatures, and suspicious modifications automatically."
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get comprehensive analysis results in under 2 minutes with detailed confidence scores."
    },
    {
      icon: MessageSquare,
      title: "AI Assistant",
      description: "Interactive AI that explains findings, answers questions, and provides legal document insights."
    },
    {
      icon: CheckCircle,
      title: "Compliance Check",
      description: "Ensure documents meet legal standards and regulatory requirements automatically."
    }
  ];

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 font-inter">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our comprehensive suite of AI-powered tools revolutionizes how legal professionals 
            verify and analyze documents.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="brand-card p-8 text-center border-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4 font-inter">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};