import { useState, useCallback } from 'react';
import { Upload, File, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { UploadedFile } from '../DocumentWizard';

interface FileUploadProps {
  uploadedFile: UploadedFile | null;
  onFileUpload: (file: UploadedFile) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

const acceptedTypes = ['.pdf', '.docx', '.txt'];
const maxSizeInMB = 10;

export const FileUpload = ({
  uploadedFile,
  onFileUpload,
  onNext,
  onBack,
  canProceed,
}: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!acceptedTypes.includes(fileExtension)) {
      return `File type not supported. Please upload ${acceptedTypes.join(', ')} files only.`;
    }
    
    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `File size too large. Please upload files smaller than ${maxSizeInMB}MB.`;
    }
    
    return null;
  };

  const handleFileUpload = useCallback((file: File) => {
    const error = validateFile(file);
    
    if (error) {
      setUploadError(error);
      return;
    }

    setUploadError(null);
    onFileUpload({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    });
  }, [onFileUpload]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Upload Your Document
        </h2>
        <p className="text-muted-foreground">
          Upload your legal document for AI-powered verification and analysis
        </p>
      </div>

      {!uploadedFile ? (
        <div className="mb-8">
          <Card
            className={cn(
              "border-2 border-dashed p-12 text-center transition-all duration-200 cursor-pointer",
              {
                "border-primary bg-primary/5": isDragOver,
                "border-border hover:border-primary/50": !isDragOver,
              }
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept={acceptedTypes.join(',')}
              onChange={handleFileInputChange}
              className="hidden"
              id="file-upload"
            />
            
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-muted rounded-full">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Drop your document here
                </h3>
                <p className="text-muted-foreground mb-4">
                  or{' '}
                  <label
                    htmlFor="file-upload"
                    className="text-primary hover:text-primary-light cursor-pointer font-medium"
                  >
                    browse to upload
                  </label>
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports {acceptedTypes.join(', ')} files up to {maxSizeInMB}MB
                </p>
              </div>
            </div>
          </Card>

          {uploadError && (
            <div className="flex items-center space-x-2 text-destructive text-sm mt-4 p-3 bg-destructive/10 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-8">
          <Card className="p-6 bg-success-light border-success/20">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-success rounded-lg">
                <File className="w-6 h-6 text-success-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-foreground">
                    {uploadedFile.name}
                  </h3>
                  <Check className="w-5 h-5 text-success" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(uploadedFile.size)} • Uploaded successfully
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onFileUpload(null as any);
                  setUploadError(null);
                }}
              >
                Change File
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>

        <Button
          onClick={onNext}
          disabled={!canProceed}
          size="lg"
          className="px-8"
        >
          Continue to Analysis
        </Button>
      </div>
    </div>
  );
};