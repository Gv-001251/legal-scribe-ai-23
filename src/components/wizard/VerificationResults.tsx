import { CheckCircle, XCircle, AlertTriangle, Shield, FileText, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { VerificationResult, AlterabilityAnalysis } from '@/services/mockApi';

interface VerificationResultsProps {
  verificationResult: VerificationResult | null;
  alterabilityResult: AlterabilityAnalysis | null;
  isLoading: boolean;
  error: string | null;
}

export const VerificationResults = ({
  verificationResult,
  alterabilityResult,
  isLoading,
  error,
}: VerificationResultsProps) => {
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

  if (!verificationResult && !alterabilityResult) {
    return null;
  }

  const getOverallStatus = () => {
    if (!verificationResult) return null;
    
    const isAuthentic = verificationResult.isAuthentic;
    const isValid = verificationResult.isValid;
    const riskLevel = verificationResult.riskLevel;
    
    if (isAuthentic && isValid && riskLevel === 'Low') {
      return { status: 'authentic', label: 'Document is Authentic', color: 'text-success' };
    } else if (isAuthentic && isValid) {
      return { status: 'valid', label: 'Document is Valid', color: 'text-warning' };
    } else if (!isAuthentic) {
      return { status: 'fake', label: 'Document appears to be Fake', color: 'text-destructive' };
    } else {
      return { status: 'invalid', label: 'Document has Issues', color: 'text-destructive' };
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      {overallStatus && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Document Verification Results</h2>
            <Badge 
              variant={overallStatus.status === 'authentic' ? 'default' : 'destructive'}
              className="text-sm"
            >
              {overallStatus.label}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Authenticity Score */}
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
                <span className="text-sm font-medium">
                  {verificationResult.authenticityScore}%
                </span>
              </div>
            </div>

            {/* Validity Score */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-medium">Validity Score</span>
              </div>
              <div className="flex items-center space-x-3">
                <Progress 
                  value={verificationResult.confidence} 
                  className="flex-1"
                />
                <span className="text-sm font-medium">
                  {verificationResult.confidence}%
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Summary */}
      {verificationResult && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-3">Analysis Summary</h3>
          <p className="text-muted-foreground">{verificationResult.summary}</p>
        </Card>
      )}

      {/* Detailed Analysis */}
      {verificationResult && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Detailed Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Structure Validation */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Structure Validation</h4>
              <div className="space-y-2">
                {Object.entries(verificationResult.analysisDetails).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    {value ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Compliance */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Legal Compliance</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Compliance Status</span>
                  <Badge variant={verificationResult.legalCompliance.isCompliant ? 'default' : 'destructive'}>
                    {verificationResult.legalCompliance.isCompliant ? 'Compliant' : 'Non-Compliant'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Compliance Score</span>
                  <span className="text-sm font-medium">
                    {verificationResult.legalCompliance.complianceScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Issues and Recommendations */}
      {verificationResult && (verificationResult.issues.length > 0 || verificationResult.recommendations.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Issues */}
          {verificationResult.issues.length > 0 && (
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
          )}

          {/* Recommendations */}
          {verificationResult.recommendations.length > 0 && (
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
          )}
        </div>
      )}

      {/* Alterability Analysis */}
      {alterabilityResult && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tampering Detection</h3>
          
          <div className="space-y-4">
            {/* Risk Level */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Alteration Risk</span>
              <Badge 
                variant={
                  alterabilityResult.alterabilityRisk === 'Low' ? 'default' : 
                  alterabilityResult.alterabilityRisk === 'Medium' ? 'secondary' : 'destructive'
                }
              >
                {alterabilityResult.alterabilityRisk} Risk
              </Badge>
            </div>

            {/* Confidence */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Detection Confidence</span>
                <span className="text-sm font-medium">{alterabilityResult.confidence}%</span>
              </div>
              <Progress value={alterabilityResult.confidence} />
            </div>

            {/* Technical Details */}
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Technical Analysis</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(alterabilityResult.technicalDetails).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    {value ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">{alterabilityResult.summary}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
