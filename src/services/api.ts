// API service for document verification
import { API_CONFIG, getApiUrl } from '@/config/api';

// Define API response types
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

export class DocumentVerificationAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = getApiUrl(endpoint);
    const isUpload = endpoint === API_CONFIG.ENDPOINTS.UPLOAD;
    const timeout = isUpload ? API_CONFIG.UPLOAD_TIMEOUT : API_CONFIG.TIMEOUT;
    
    // Initialize retry count
    let retryCount = 0;
    let lastError: Error | null = null;
    
    while (retryCount <= API_CONFIG.MAX_RETRIES) {
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        console.log(`Making request to ${endpoint} (attempt ${retryCount + 1}/${API_CONFIG.MAX_RETRIES + 1})`);
        
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          signal: controller.signal,
          ...options,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.detail || 
            errorData.message || 
            `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        console.log(`Request to ${endpoint} successful:`, data);
        return data;
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`Request attempt ${retryCount + 1} failed:`, lastError);
        
        if (error instanceof Error && error.name === 'AbortError') {
          console.error('Request timed out after', timeout, 'ms');
        }
        
        // Check if we should retry
        if (retryCount < API_CONFIG.MAX_RETRIES) {
          const delay = API_CONFIG.RETRY_DELAY * Math.pow(API_CONFIG.RETRY_BACKOFF_FACTOR, retryCount);
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retryCount++;
        } else {
          console.error('Max retries reached. Giving up.');
          throw new Error(`Request failed after ${API_CONFIG.MAX_RETRIES + 1} attempts: ${lastError.message}`);
        }
      }
    }
    
    // This should never happen due to the throw above, but TypeScript needs it
    throw lastError || new Error('Request failed');
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
      console.log('Starting chat request for file:', file.name);
      console.log('Message:', message);
      console.log('Chat history length:', chatHistory.length);

      // Upload file first
      console.log('Uploading file...');
      const fileId = await this.uploadFile(file);
      console.log('File uploaded successfully, file_id:', fileId);

      // Prepare request body
      const requestBody = {
        file_id: fileId,
        message,
        chat_history: chatHistory,
      };
      console.log('Sending chat request with body:', requestBody);

      // Make the chat request
      const response = await this.makeRequest<ChatResponse>(API_CONFIG.ENDPOINTS.CHAT, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      console.log('Chat response received:', response);
      return response;
    } catch (error) {
      console.error('Chat request failed:', error);
      // Enhanced error handling
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      }
      throw new Error(
        error instanceof Error 
          ? `Chat failed: ${error.message}`
          : 'Chat request failed due to an unknown error'
      );
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

// Note: Types are already exported above as interfaces
