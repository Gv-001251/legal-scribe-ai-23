// Mock API Configuration and Responses
import { API_CONFIG } from './api';

// Types
export interface MockDocument {
  id: string;
  name: string;
  type: string;
  content: string;
  uploadedAt: string;
}

export interface MockVerificationResult {
  isValid: boolean;
  confidence: number;
  isAuthentic: boolean;
  authenticityScore: number;
  issues: string[];
  recommendations: string[];
  summary: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  analysisDetails: {
    structureValidation: boolean;
    signatureVerification: boolean;
    contentIntegrity: boolean;
    metadataAnalysis: boolean;
    tamperingDetection: boolean;
  };
}

export interface MockChatResponse {
  response: string;
  confidence: number;
  sources: string[];
}

// Mock Data
export const MOCK_DATA = {
  documents: new Map<string, MockDocument>(),
  
  verificationResults: {
    success: {
      isValid: true,
      confidence: 95,
      isAuthentic: true,
      authenticityScore: 92,
      issues: ["Missing witness signature on page 3"],
      recommendations: [
        "Add witness signature",
        "Verify notary stamp",
        "Check document formatting"
      ],
      summary: "Document appears to be valid with minor formatting issues.",
      riskLevel: "Low" as const,
      analysisDetails: {
        structureValidation: true,
        signatureVerification: false,
        contentIntegrity: true,
        metadataAnalysis: true,
        tamperingDetection: true
      }
    },
    error: {
      isValid: false,
      confidence: 85,
      isAuthentic: false,
      authenticityScore: 45,
      issues: [
        "Multiple font inconsistencies detected",
        "Digital signature validation failed",
        "Metadata tampering detected"
      ],
      recommendations: [
        "Request original document",
        "Verify with issuing authority",
        "Check document authenticity"
      ],
      summary: "Document shows signs of potential alterations.",
      riskLevel: "High" as const,
      analysisDetails: {
        structureValidation: false,
        signatureVerification: false,
        contentIntegrity: false,
        metadataAnalysis: false,
        tamperingDetection: false
      }
    }
  },

  chatResponses: [
    {
      response: "Based on my analysis of the document, this appears to be a standard legal contract. The key points include terms and conditions, liability clauses, and termination procedures. Would you like me to explain any specific section in more detail?",
      confidence: 95,
      sources: ["document_analysis", "legal_database"]
    },
    {
      response: "The document contains several important clauses regarding intellectual property rights, confidentiality, and dispute resolution. Each party has specific obligations and rights outlined in sections 3.1 through 3.5. Is there a particular aspect you'd like me to clarify?",
      confidence: 92,
      sources: ["document_content", "legal_precedents"]
    }
  ]
};

// Mock API Functions
export const mockApiService = {
  uploadDocument: async (file: File): Promise<{ id: string; name: string }> => {
    const id = Math.random().toString(36).substring(7);
    const doc: MockDocument = {
      id,
      name: file.name,
      type: file.type,
      content: await file.text(),
      uploadedAt: new Date().toISOString()
    };
    MOCK_DATA.documents.set(id, doc);
    return { id, name: file.name };
  },

  verifyDocument: async (documentId: string): Promise<MockVerificationResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return Math.random() > 0.2 
      ? MOCK_DATA.verificationResults.success 
      : MOCK_DATA.verificationResults.error;
  },

  chatWithAI: async (
    documentId: string, 
    message: string, 
    chatHistory: Array<{ role: string; message: string }>
  ): Promise<MockChatResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = MOCK_DATA.chatResponses;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    if (message.toLowerCase().includes("explain") || message.toLowerCase().includes("what")) {
      return {
        response: `I'll help explain that. ${randomResponse.response}`,
        confidence: randomResponse.confidence,
        sources: randomResponse.sources
      };
    }
    
    return randomResponse;
  }
};

// Export configuration
export const MOCK_API_CONFIG = {
  ...API_CONFIG,
  MOCK_ENABLED: true,
  MOCK_DELAY: {
    MIN: 500,
    MAX: 2000
  }
};