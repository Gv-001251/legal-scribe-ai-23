// Mock API service for document verification
// This simulates the FastAPI backend responses for demonstration purposes

export interface DocumentVerificationRequest {
  file: File;
  documentType: string;
}

export interface VerificationResult {
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
  legalCompliance: {
    isCompliant: boolean;
    missingElements: string[];
    complianceScore: number;
  };
}

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

export interface ChatResponse {
  response: string;
  confidence: number;
  sources: string[];
}

class MockDocumentVerificationAPI {
  private generateMockVerificationResult(fileName: string, documentType: string): VerificationResult {
    // Simulate different results based on file name and document type
    const isLikelyAuthentic = !fileName.toLowerCase().includes('fake') && 
                             !fileName.toLowerCase().includes('test') &&
                             !fileName.toLowerCase().includes('sample') &&
                             !fileName.toLowerCase().includes('fraud');
    
    const isDefinitelyFake = fileName.toLowerCase().includes('fake') || 
                            fileName.toLowerCase().includes('fraud') ||
                            fileName.toLowerCase().includes('forged');
    
    let authenticityScore, confidence, issues, recommendations, summary, riskLevel;
    
    if (isDefinitelyFake) {
      authenticityScore = Math.floor(Math.random() * 20) + 15; // 15-35 for fake
      confidence = Math.floor(Math.random() * 10) + 85; // 85-95
      issues = [
        'Document structure appears manipulated',
        'Signatures do not match official records',
        'Inconsistent formatting and typography',
        'Metadata shows signs of editing',
        'Legal language patterns are suspicious'
      ];
      recommendations = [
        'DO NOT USE this document for legal purposes',
        'Contact legal authorities if this was presented as authentic',
        'Verify document source through official channels',
        'Consider this document as potentially fraudulent'
      ];
      summary = '⚠️ WARNING: This document shows strong indicators of being FAKE or FRAUDULENT. Multiple red flags detected including manipulated structure, suspicious signatures, and inconsistent formatting. This document should NOT be used for any legal purposes.';
      riskLevel = 'High';
    } else if (isLikelyAuthentic) {
      authenticityScore = Math.floor(Math.random() * 15) + 80; // 80-95 for authentic
      confidence = Math.floor(Math.random() * 10) + 88; // 88-98
      issues = ['No major issues detected'];
      recommendations = [
        'Document appears to be legally valid',
        'All required elements are present',
        'Signatures and formatting are consistent',
        'Safe to use for legal purposes'
      ];
      summary = '✅ VERIFIED: This document appears to be LEGITIMATE and legally valid. All verification checks passed with high confidence. The document structure, signatures, and formatting are consistent with authentic legal documents.';
      riskLevel = 'Low';
    } else {
      authenticityScore = Math.floor(Math.random() * 25) + 45; // 45-70 for questionable
      confidence = Math.floor(Math.random() * 15) + 75; // 75-90
      issues = [
        'Some formatting inconsistencies detected',
        'Missing some standard legal elements',
        'Signature verification incomplete'
      ];
      recommendations = [
        'Verify document source through official channels',
        'Cross-check with original records if possible',
        'Consult with legal expert before use',
        'Additional verification recommended'
      ];
      summary = '⚠️ CAUTION: This document shows some inconsistencies that require further verification. While not definitively fake, additional checks are recommended before using for legal purposes.';
      riskLevel = 'Medium';
    }
    
    return {
      isValid: authenticityScore > 60,
      confidence,
      isAuthentic: authenticityScore > 70,
      authenticityScore,
      issues,
      recommendations,
      summary,
      riskLevel,
      analysisDetails: {
        structureValidation: authenticityScore > 70,
        signatureVerification: authenticityScore > 75,
        contentIntegrity: authenticityScore > 65,
        metadataAnalysis: authenticityScore > 70,
        tamperingDetection: authenticityScore > 80,
      },
      legalCompliance: {
        isCompliant: authenticityScore > 70,
        missingElements: authenticityScore < 80 ? ['witness_signature', 'notary_stamp', 'official_seal'] : [],
        complianceScore: Math.floor(authenticityScore * 0.9),
      }
    };
  }
  
  private generateMockAlterabilityResult(fileName: string): AlterabilityAnalysis {
    const isLikelyTampered = fileName.toLowerCase().includes('modified') || 
                            fileName.toLowerCase().includes('edited') ||
                            fileName.toLowerCase().includes('tampered') ||
                            fileName.toLowerCase().includes('altered');
    
    const isDefinitelyTampered = fileName.toLowerCase().includes('tampered') ||
                                fileName.toLowerCase().includes('forged') ||
                                fileName.toLowerCase().includes('fake');
    
    let riskLevel, confidence, findings, summary, technicalDetails;
    
    if (isDefinitelyTampered) {
      riskLevel = 'High';
      confidence = Math.floor(Math.random() * 10) + 90; // 90-100
      findings = [
        '🔍 CRITICAL: Multiple text insertions detected',
        '⚠️ Document metadata has been significantly altered',
        '🚨 Font inconsistencies indicate copy-paste operations',
        '📝 Digital signature verification failed',
        '⏰ Timestamp anomalies detected',
        '🔧 PDF structure shows signs of manipulation',
        '📄 Original document properties have been modified',
        '🎯 Watermark and security features compromised'
      ];
      summary = '🚨 HIGH RISK: This document shows clear evidence of tampering and alteration. Multiple technical indicators suggest the document has been modified after its original creation. The integrity of this document cannot be trusted.';
      technicalDetails = {
        fontConsistency: false,
        textInsertion: true,
        metadataIntact: false,
        digitalSignature: false,
        timestampValidation: false,
      };
    } else if (isLikelyTampered) {
      riskLevel = 'Medium';
      confidence = Math.floor(Math.random() * 15) + 80; // 80-95
      findings = [
        '⚠️ Some text modifications detected',
        '📝 Minor metadata discrepancies found',
        '🔍 Font variations in certain sections',
        '⏰ Timestamp inconsistencies noted',
        '📄 Some document properties appear modified',
        '🔧 PDF structure shows minor anomalies'
      ];
      summary = '⚠️ MEDIUM RISK: This document shows some signs of potential alteration. While not definitively tampered with, several inconsistencies suggest the document may have been modified. Further investigation recommended.';
      technicalDetails = {
        fontConsistency: false,
        textInsertion: true,
        metadataIntact: false,
        digitalSignature: Math.random() > 0.3,
        timestampValidation: false,
      };
    } else {
      riskLevel = 'Low';
      confidence = Math.floor(Math.random() * 10) + 88; // 88-98
      findings = [
        '✅ Consistent font usage throughout document',
        '✅ No text insertion or modification detected',
        '✅ Original PDF metadata intact and valid',
        '✅ Digital signature verification passed',
        '✅ Timestamp validation successful',
        '✅ Document structure appears authentic',
        '✅ No signs of copy-paste operations',
        '✅ Security features and watermarks intact'
      ];
      summary = '✅ LOW RISK: This document shows no signs of tampering or alteration. All technical indicators suggest the document is authentic and has not been modified since its original creation.';
      technicalDetails = {
        fontConsistency: true,
        textInsertion: false,
        metadataIntact: true,
        digitalSignature: true,
        timestampValidation: true,
      };
    }
    
    return {
      alterabilityRisk: riskLevel,
      confidence,
      findings,
      summary,
      technicalDetails
    };
  }
  
  private generateMockChatResponse(message: string, fileName: string): ChatResponse {
    const lowerMessage = message.toLowerCase();
    let response = '';
    let confidence = 95;
    
    // Context-aware responses based on the question
    if (lowerMessage.includes('what') && lowerMessage.includes('document')) {
      response = `Based on your document "${fileName}", this appears to be a legal document. I can analyze its structure, identify key clauses, and explain legal terms. The document contains standard legal language and follows proper formatting conventions. Would you like me to explain any specific section or clause?`;
    } else if (lowerMessage.includes('clause') || lowerMessage.includes('section')) {
      response = `I can help you understand the clauses in your document. Legal documents typically contain several key sections including: definitions, terms and conditions, obligations of parties, termination clauses, and dispute resolution. Each clause serves a specific legal purpose. Which particular clause would you like me to explain in detail?`;
    } else if (lowerMessage.includes('legal') && lowerMessage.includes('meaning')) {
      response = `Legal documents use precise language that may seem complex. I can break down legal terms into plain language. For example, "consideration" means something of value exchanged between parties, "indemnification" means protection against losses, and "force majeure" refers to circumstances beyond control. What specific legal term would you like me to explain?`;
    } else if (lowerMessage.includes('valid') || lowerMessage.includes('binding')) {
      response = `For a document to be legally valid and binding, it typically needs: proper signatures from all parties, clear terms and conditions, consideration (exchange of value), and compliance with applicable laws. Your document appears to follow these requirements. However, I recommend consulting with a legal professional for specific legal advice.`;
    } else if (lowerMessage.includes('risk') || lowerMessage.includes('danger')) {
      response = `I can help identify potential risks in your document. Common areas to review include: unclear terms, missing deadlines, inadequate dispute resolution clauses, and lack of termination conditions. Legal documents should be clear, specific, and protect all parties' interests. What specific concern do you have about your document?`;
    } else if (lowerMessage.includes('signature') || lowerMessage.includes('sign')) {
      response = `Signatures are crucial for document validity. They indicate agreement to the terms. In your document, I can see signature lines for all parties. Digital signatures are also legally valid in most jurisdictions. Make sure all required parties sign and date the document. Do you have questions about the signature requirements?`;
    } else if (lowerMessage.includes('termination') || lowerMessage.includes('end')) {
      response = `Termination clauses specify how and when the agreement can end. They typically include: notice periods, breach conditions, mutual agreement, and automatic expiration dates. These clauses protect both parties by providing clear exit strategies. Would you like me to explain the termination conditions in your document?`;
    } else if (lowerMessage.includes('dispute') || lowerMessage.includes('conflict')) {
      response = `Dispute resolution clauses outline how conflicts will be handled. Common methods include: negotiation, mediation, arbitration, and litigation. Your document likely includes one of these methods. This is important for avoiding costly court battles. What questions do you have about dispute resolution?`;
    } else if (lowerMessage.includes('obligation') || lowerMessage.includes('duty')) {
      response = `Obligations are the duties and responsibilities each party must fulfill under the agreement. These are usually clearly outlined in the document and may include: payment terms, delivery requirements, confidentiality obligations, and performance standards. Understanding these is crucial for compliance. Which obligations would you like me to clarify?`;
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('money')) {
      response = `Payment terms specify when, how, and how much money is to be exchanged. This typically includes: payment amounts, due dates, payment methods, late fees, and currency. Clear payment terms prevent disputes and ensure timely compensation. Do you need clarification on any payment-related clauses?`;
    } else {
      // Default intelligent response
      const defaultResponses = [
        `I can help you understand your "${fileName}" document. I can explain legal terms, identify key clauses, analyze risks, and clarify obligations. What specific aspect of the document would you like me to help you with?`,
        `Your document appears to be well-structured with standard legal language. I can break down complex legal concepts, explain your rights and obligations, and identify important clauses. What would you like to know more about?`,
        `I'm here to help you understand your legal document. I can explain terminology, highlight important sections, and answer questions about legal implications. What specific question do you have about your document?`
      ];
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    return {
      response,
      confidence,
      sources: ['document_analysis', 'legal_database', 'standard_practices', 'case_law']
    };
  }

  async verifyDocument(request: DocumentVerificationRequest): Promise<VerificationResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    return this.generateMockVerificationResult(request.file.name, request.documentType);
  }

  async analyzeAlterability(file: File): Promise<AlterabilityAnalysis> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    return this.generateMockAlterabilityResult(file.name);
  }

  async chatWithDocument(
    file: File,
    message: string,
    chatHistory: Array<{ role: 'user' | 'ai'; message: string }> = []
  ): Promise<ChatResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
    
    return this.generateMockChatResponse(message, file.name);
  }

  async getDocumentSummary(file: File): Promise<{ summary: string; keyPoints: string[] }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      summary: `This is a legal document (${file.name}) containing standard legal language and structure. The document appears to be professionally drafted and follows common legal document formatting practices.`,
      keyPoints: [
        'Standard legal document structure',
        'Professional formatting and language',
        'Contains typical legal clauses and terms',
        'Appears to be properly executed',
        'Follows legal document best practices'
      ]
    };
  }

  // Health check endpoint
  async healthCheck(): Promise<{ status: string; version: string }> {
    return { status: 'healthy', version: '1.0.0-mock' };
  }
}

// Export singleton instance
export const mockDocumentVerificationAPI = new MockDocumentVerificationAPI();

// Note: Types are already exported above as interfaces
