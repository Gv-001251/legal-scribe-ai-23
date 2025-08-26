// API service for document verification
import { API_CONFIG, getApiUrl } from '@/config/api';

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

class DocumentVerificationAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = getApiUrl(endpoint);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 
          errorData.message || 
          `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
    console.log('Upload URL:', getApiUrl(API_CONFIG.ENDPOINTS.UPLOAD));

    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.UPLOAD), {
      method: 'POST',
      body: formData,
    });

    console.log('Upload response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Upload error:', errorData);
      throw new Error(
        errorData.detail || 
        errorData.message || 
        `Upload failed with status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log('Upload successful, file_id:', result.file_id);
    return result.file_id;
  }

  async verifyDocument(request: DocumentVerificationRequest): Promise<VerificationResult> {
    try {
      console.log('Starting document verification for:', request.documentType);
      
      // First upload the file
      const fileId = await this.uploadFile(request.file);
      console.log('File uploaded successfully, file_id:', fileId);

      // Then verify the document
      console.log('Sending verification request...');
      const result = await this.makeRequest<VerificationResult>(API_CONFIG.ENDPOINTS.VERIFY, {
        method: 'POST',
        body: JSON.stringify({
          file_id: fileId,
          document_type: request.documentType,
        }),
      });
      
      console.log('Verification completed successfully:', result);
      return result;
    } catch (error) {
      console.error('Document verification failed:', error);
      throw error;
    }
  }

  async analyzeAlterability(file: File): Promise<AlterabilityAnalysis> {
    try {
      const fileId = await this.uploadFile(file);

      return await this.makeRequest<AlterabilityAnalysis>(API_CONFIG.ENDPOINTS.ANALYZE_ALTERABILITY, {
        method: 'POST',
        body: JSON.stringify({
          file_id: fileId,
        }),
      });
    } catch (error) {
      console.error('Alterability analysis failed:', error);
      throw error;
    }
  }

  async chatWithDocument(
    file: File,
    message: string,
    chatHistory: Array<{ role: 'user' | 'ai'; message: string }> = []
  ): Promise<ChatResponse> {
    try {
      const fileId = await this.uploadFile(file);

      return await this.makeRequest<ChatResponse>(API_CONFIG.ENDPOINTS.CHAT, {
        method: 'POST',
        body: JSON.stringify({
          file_id: fileId,
          message,
          chat_history: chatHistory,
        }),
      });
    } catch (error) {
      console.error('Chat request failed:', error);
      throw error;
    }
  }

  async getDocumentSummary(file: File): Promise<{ summary: string; keyPoints: string[] }> {
    try {
      const fileId = await this.uploadFile(file);

      return await this.makeRequest<{ summary: string; keyPoints: string[] }>(API_CONFIG.ENDPOINTS.SUMMARIZE, {
        method: 'POST',
        body: JSON.stringify({
          file_id: fileId,
        }),
      });
    } catch (error) {
      console.error('Document summarization failed:', error);
      throw error;
    }
  }

  // Health check endpoint
  async healthCheck(): Promise<{ status: string; version: string }> {
    return await this.makeRequest<{ status: string; version: string }>(API_CONFIG.ENDPOINTS.HEALTH);
  }
}

// Export singleton instance
export const documentVerificationAPI = new DocumentVerificationAPI();

// Export types for use in components
export type { DocumentVerificationRequest, VerificationResult, AlterabilityAnalysis, ChatResponse };
