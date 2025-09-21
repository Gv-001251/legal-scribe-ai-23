export interface AlterabilityAnalysis {
  alterabilityRisk: 'Low' | 'Medium' | 'High';
  confidence: number;
  findings: string[];
  summary: string;
  technicalDetails: {
    fontConsistency: boolean;
    textInsertion: boolean;
    metadataIntact: boolean;
    digitalSignature: boolean;
    timestampValidation: boolean;
  };
}