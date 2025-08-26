import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const stepLabels = [
  'Document Type',
  'File Upload', 
  'Analysis & Tasks'
];

export const WizardProgress = ({ currentStep, totalSteps, className }: WizardProgressProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={stepNumber} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300",
                    {
                      "bg-primary text-primary-foreground": isCurrent,
                      "bg-success text-success-foreground": isCompleted,
                      "bg-muted text-muted-foreground": isUpcoming,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium transition-colors duration-300",
                    {
                      "text-primary": isCurrent,
                      "text-success": isCompleted,
                      "text-muted-foreground": isUpcoming,
                    }
                  )}
                >
                  {stepLabels[index]}
                </span>
              </div>

              {/* Connector Line */}
              {stepNumber < totalSteps && (
                <div
                  className={cn(
                    "w-20 h-0.5 mx-4 transition-colors duration-300",
                    {
                      "bg-success": stepNumber < currentStep,
                      "bg-muted": stepNumber >= currentStep,
                    }
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};