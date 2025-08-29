import { Card } from '@/components/ui/card';
import { Building, Scale, Users, TrendingUp } from 'lucide-react';

export const CaseStudiesSection = () => {
  const caseStudies = [
    {
      icon: Building,
      company: "Global Law Firm",
      title: "Contract Verification at Scale",
      description: "Reduced document review time by 85% while increasing accuracy in fraud detection for international contracts.",
      results: "85% faster reviews, 99.8% accuracy",
      category: "Enterprise"
    },
    {
      icon: Scale,
      company: "Legal Tech Startup",
      title: "Automated Due Diligence",
      description: "Streamlined M&A due diligence processes with AI-powered document authenticity verification.",
      results: "50% cost reduction, 3x faster processing",
      category: "Fintech"
    },
    {
      icon: Users,
      company: "Insurance Provider",
      title: "Claims Document Analysis",
      description: "Enhanced fraud detection in insurance claims through advanced document verification technology.",
      results: "40% improvement in fraud detection",
      category: "Insurance"
    }
  ];

  return (
    <section id="case-studies" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 font-inter">
            Success Stories
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            See how industry leaders are transforming their document verification processes 
            with our AI technology.
          </p>
        </div>

        <div className="case-study-grid">
          {caseStudies.map((study, index) => (
            <Card 
              key={index} 
              className="brand-card p-8 border-0"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <study.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-primary font-medium mb-1">{study.category}</div>
                  <div className="text-sm text-muted-foreground">{study.company}</div>
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold text-foreground mb-4 font-inter">
                {study.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed mb-6">
                {study.description}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center text-success">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="font-medium text-sm">{study.results}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};