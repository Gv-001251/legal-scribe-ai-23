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
  file: File; // Store the actual File object
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-inter">
          Document Verification & Analysis
        </h3>
        <p className="text-muted-foreground text-xl leading-relaxed max-w-3xl mx-auto">
          Verify the authenticity of your legal documents and detect potential fraud with our AI-powered analysis
        </p>
      </div>

      {/* Progress Indicator */}
      <WizardProgress currentStep={currentStep} totalSteps={3} className="mb-12" />

      {/* Main Content Card */}
      <div className="brand-card rounded-3xl border-0 overflow-hidden">
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
      <div className="text-center mt-12 space-y-2">
        <div className="flex items-center justify-center space-x-2 text-success text-sm">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span>Enterprise-grade security & encryption</span>
        </div>
        <p className="text-muted-foreground text-sm">
          All documents are processed securely and automatically deleted after analysis
        </p>
      </div>
    </div>
  );
};

export default DocumentWizard;