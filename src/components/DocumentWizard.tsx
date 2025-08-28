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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-2 font-inter">
          Document Verification & Authenticity Check
        </h3>
        <p className="text-white/80 text-lg">
          Verify the authenticity of your legal documents and detect potential fraud in three simple steps
        </p>
      </div>

      {/* Progress Indicator */}
      <WizardProgress currentStep={currentStep} totalSteps={3} className="mb-8" />

      {/* Main Content Card */}
      <div className="glass-card shadow-card rounded-2xl border-0 overflow-hidden">
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
      <div className="text-center mt-8 text-sm text-white/70">
        <p>Your documents are processed securely and deleted after verification</p>
        <p className="mt-1">All analysis is performed using advanced AI to detect fraud and tampering</p>
      </div>
    </div>
  );
};

export default DocumentWizard;