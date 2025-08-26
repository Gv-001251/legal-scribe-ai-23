import { useState } from 'react';
import { FileText, Home, Heart, Shield, Briefcase, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { DocumentType } from '../DocumentWizard';

interface DocumentTypeOption {
  type: DocumentType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const documentTypes: DocumentTypeOption[] = [
  {
    type: 'contract',
    label: 'Contract',
    description: 'Business contracts, service agreements, purchase agreements',
    icon: FileText,
  },
  {
    type: 'lease',
    label: 'Lease Agreement',
    description: 'Residential or commercial lease agreements',
    icon: Home,
  },
  {
    type: 'will',
    label: 'Will & Testament',
    description: 'Last will and testament, estate planning documents',
    icon: Heart,
  },
  {
    type: 'nda',
    label: 'NDA',
    description: 'Non-disclosure agreements, confidentiality agreements',
    icon: Shield,
  },
  {
    type: 'employment',
    label: 'Employment Agreement',
    description: 'Employment contracts, offer letters, termination agreements',
    icon: Briefcase,
  },
  {
    type: 'other',
    label: 'Other',
    description: 'Other legal documents not listed above',
    icon: MoreHorizontal,
  },
];

interface DocumentTypeSelectionProps {
  selectedType: DocumentType | null;
  onSelect: (type: DocumentType) => void;
  onNext: () => void;
  canProceed: boolean;
}

export const DocumentTypeSelection = ({
  selectedType,
  onSelect,
  onNext,
  canProceed,
}: DocumentTypeSelectionProps) => {
  const [customDocumentType, setCustomDocumentType] = useState('');

  const handleOtherSelect = () => {
    onSelect('other');
  };

  const isOtherSelected = selectedType === 'other';
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Select Document Type
        </h2>
        <p className="text-muted-foreground">
          Choose the type of legal document you want to verify and analyze
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {documentTypes.map((docType) => {
          const Icon = docType.icon;
          const isSelected = selectedType === docType.type;

          return (
            <Card
              key={docType.type}
              className={cn(
                "p-6 cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                {
                  "border-primary bg-primary/5 shadow-md": isSelected,
                  "border-border hover:border-primary/50": !isSelected,
                }
              )}
              onClick={() => docType.type === 'other' ? handleOtherSelect() : onSelect(docType.type)}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={cn(
                    "p-3 rounded-lg transition-colors duration-200",
                    {
                      "bg-primary text-primary-foreground": isSelected,
                      "bg-muted text-muted-foreground": !isSelected,
                    }
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3
                    className={cn(
                      "font-semibold mb-1 transition-colors duration-200",
                      {
                        "text-primary": isSelected,
                        "text-foreground": !isSelected,
                      }
                    )}
                  >
                    {docType.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {docType.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Custom Document Type Input for "Other" */}
      {isOtherSelected && (
        <div className="mb-8 animate-fade-in">
          <Card className="p-6 border-primary/20 bg-primary/5">
            <Label htmlFor="custom-doc-type" className="text-sm font-medium text-foreground mb-2 block">
              Please specify the type of document:
            </Label>
            <Input
              id="custom-doc-type"
              placeholder="e.g., Power of Attorney, Mortgage Agreement, etc."
              value={customDocumentType}
              onChange={(e) => setCustomDocumentType(e.target.value)}
              className="w-full"
            />
          </Card>
        </div>
      )}

      <div className="flex justify-center">
        <Button
          onClick={onNext}
          disabled={!canProceed || (isOtherSelected && !customDocumentType.trim())}
          size="lg"
          className="px-8"
        >
          Continue to Upload
        </Button>
      </div>
    </div>
  );
};