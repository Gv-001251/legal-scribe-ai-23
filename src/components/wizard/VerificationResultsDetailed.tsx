import { CheckCircle, XCircle, AlertTriangle, Shield, FileText, Clock, AlertCircle, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { VerificationResult, AlterabilityAnalysis } from '@/services/mockApi';

interface VerificationResultsDetailedProps {
  verificationResult: VerificationResult | null;
  alterabilityResult: AlterabilityAnalysis | null;
  isLoading: boolean;
  error: string | null;
  activeTask: 'verify' | 'analyze' | 'chat' | null;
}

export const VerificationResultsDetailed = ({
  verificationResult,
  alterabilityResult,
  isLoading,
  error,
  activeTask,
}: VerificationResultsDetailedProps) => {
  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center space-x-3">
          <Clock className="w-6 h-6 text-primary animate-spin" />
          <span className="text-lg font-medium">Analyzing document...</span>
        </div>
        <p className="text-center text-muted-foreground mt-2">
          This may take a few moments while we verify your document
        </p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 border-destructive/20 bg-destructive/5">
        <div className="flex items-center space-x-3 text-destructive">
          <AlertCircle className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Analysis Failed</h3>
        </div>
        <p className="text-destructive/80 mt-2">{error}</p>
      </Card>
    );
  }

  // Document Verification Results
  if (activeTask === 'verify' && verificationResult) {
    const isAuthentic = verificationResult.isAuthentic;
    const riskLevel = verificationResult.riskLevel;
    
    return (
      <div className="space-y-6">
        {/* Main Status Card */}
        <Card className={cn(
          "p-6 border-2",
          isAuthentic ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {isAuthentic ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
              <div>
                <h2 className="text-2xl font-bold">
                  {isAuthentic ? "✅ DOCUMENT IS LEGAL" : "❌ DOCUMENT IS NOT LEGAL"}
                </h2>
                <p className="text-lg font-medium">
                  {isAuthentic ? "Verified as Authentic" : "Potential Fraud Detected"}
                </p>
              </div>
            </div>
            <Badge 
              variant={isAuthentic ? "default" : "destructive"}
              className="text-lg px-4 py-2"
            >
              {riskLevel} Risk
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-medium">Authenticity Score</span>
              </div>
              <div className="flex items-center space-x-3">
                <Progress 
                  value={verificationResult.authenticityScore} 
                  className="flex-1"
                />
                <span className="text-lg font-bold">
                  {verificationResult.authenticityScore}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-medium">Confidence Level</span>
              </div>
              <div className="flex items-center space-x-3">
                <Progress 
                  value={verificationResult.confidence} 
                  className="flex-1"
                />
                <span className="text-lg font-bold">
                  {verificationResult.confidence}%
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-3">Analysis Summary</h3>
          <p className="text-muted-foreground text-lg leading-relaxed">{verificationResult.summary}</p>
        </Card>

        {/* Issues and Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Issues */}
          <Card className="p-6 border-destructive/20">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h3 className="font-semibold text-destructive">Issues Found</h3>
            </div>
            <ul className="space-y-2">
              {verificationResult.issues.map((issue, index) => (
                <li key={index} className="text-sm text-destructive/80 flex items-start space-x-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Recommendations */}
          <Card className="p-6 border-success/20">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="w-5 h-5 text-success" />
              <h3 className="font-semibold text-success">Recommendations</h3>
            </div>
            <ul className="space-y-2">
              {verificationResult.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-success/80 flex items-start space-x-2">
                  <span className="text-success mt-1">•</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    );
  }

  // Alterability Analysis Results
  if (activeTask === 'analyze' && alterabilityResult) {
    const riskLevel = alterabilityResult.alterabilityRisk;
    
    return (
      <div className="space-y-6">
        {/* Main Status Card */}
        <Card className={cn(
          "p-6 border-2",
          riskLevel === 'Low' ? "border-green-200 bg-green-50" : 
          riskLevel === 'Medium' ? "border-yellow-200 bg-yellow-50" : 
          "border-red-200 bg-red-50"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {riskLevel === 'Low' ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : riskLevel === 'Medium' ? (
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
              <div>
                <h2 className="text-2xl font-bold">
                  {riskLevel === 'Low' ? "✅ NO TAMPERING DETECTED" : 
                   riskLevel === 'Medium' ? "⚠️ MINOR TAMPERING RISK" : 
                   "🚨 TAMPERING DETECTED"}
                </h2>
                <p className="text-lg font-medium">
                  {riskLevel === 'Low' ? "Document is Authentic" : 
                   riskLevel === 'Medium' ? "Some Modifications Found" : 
                   "Document Has Been Altered"}
                </p>
              </div>
            </div>
            <Badge 
              variant={riskLevel === 'Low' ? "default" : riskLevel === 'Medium' ? "secondary" : "destructive"}
              className="text-lg px-4 py-2"
            >
              {riskLevel} Risk
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Detection Confidence</span>
              <span className="text-lg font-bold">{alterabilityResult.confidence}%</span>
            </div>
            <Progress value={alterabilityResult.confidence} />
          </div>
        </Card>

        {/* Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-3">Technical Analysis Summary</h3>
          <p className="text-muted-foreground text-lg leading-relaxed">{alterabilityResult.summary}</p>
        </Card>

        {/* Detailed Findings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Detailed Technical Findings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alterabilityResult.findings.map((finding, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 bg-muted/30 rounded-lg">
                <span className="text-sm">{finding}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Technical Details */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Technical Validation</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(alterabilityResult.technicalDetails).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                {value ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <X className="w-5 h-5 text-red-600" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return null;
};
