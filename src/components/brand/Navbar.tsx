import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

interface BrandNavbarProps {
  onGetStarted: () => void;
}

export const BrandNavbar = ({ onGetStarted }: BrandNavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-background/95 backdrop-blur-md border-b border-border/50" 
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-lg mr-3"></div>
            <span className="font-bold text-2xl text-foreground font-inter tracking-tight">
              LegalVerify
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('case-studies')}
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              Case Studies
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              Contact
            </button>
          </div>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={onGetStarted}
              className="btn-primary px-6 py-2 rounded-full font-medium hidden sm:inline-flex"
            >
              Get Started
            </Button>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-border/50">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium text-left"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('case-studies')}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium text-left"
              >
                Case Studies
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium text-left"
              >
                Contact
              </button>
              <Button
                onClick={onGetStarted}
                className="btn-primary px-6 py-2 rounded-full font-medium w-fit"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};