import { useState } from 'react';
import { DocumentTypeSelection } from './wizard/DocumentTypeSelection';
import { FileUpload } from './wizard/FileUpload';
import { TaskDashboard } from './wizard/TaskDashboard';
import { WizardProgress } from './wizard/WizardProgress';

export type DocumentType = 
  | 'contract' 
  | 'lease' 
  | 'will' 
  | 'nda' 
  | 'employment' 
  | 'other';

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

const DocumentWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const handleDocumentTypeSelect = (type: DocumentType) => {
    setSelectedDocumentType(type);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Legal Document Verification
            </h1>
            <p className="text-muted-foreground text-lg">
              Secure AI-powered analysis and verification of your legal documents
            </p>
          </div>

          {/* Progress Indicator */}
          <WizardProgress currentStep={currentStep} totalSteps={3} className="mb-8" />

          {/* Main Content Card */}
          <div className="bg-card shadow-wizard rounded-xl border border-border overflow-hidden">
            {currentStep === 1 && (
              <DocumentTypeSelection
                selectedType={selectedDocumentType}
                onSelect={handleDocumentTypeSelect}
                onNext={handleNext}
                canProceed={!!selectedDocumentType}
              />
            )}

            {currentStep === 2 && (
              <FileUpload
                uploadedFile={uploadedFile}
                onFileUpload={handleFileUpload}
                onNext={handleNext}
                onBack={handleBack}
                canProceed={!!uploadedFile}
              />
            )}

            {currentStep === 3 && (
              <TaskDashboard
                documentType={selectedDocumentType}
                uploadedFile={uploadedFile}
                onBack={handleBack}
              />
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>Your documents are processed securely and deleted after analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentWizard;