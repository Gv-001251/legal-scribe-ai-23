import { useState, useCallback } from 'react';
import { mockDocumentVerificationAPI, type VerificationResult, type AlterabilityAnalysis, type ChatResponse } from '@/services/mockApi';

export interface UseMockDocumentVerificationReturn {
  // States
  isLoading: boolean;
  error: string | null;
  verificationResult: VerificationResult | null;
  alterabilityResult: AlterabilityAnalysis | null;
  chatHistory: Array<{ role: 'user' | 'ai'; message: string }>;
  
  // Actions
  verifyDocument: (file: File, documentType: string) => Promise<void>;
  analyzeAlterability: (file: File) => Promise<void>;
  sendChatMessage: (file: File, message: string) => Promise<void>;
  clearError: () => void;
  resetResults: () => void;
  clearChatHistory: () => void;
}

export const useMockDocumentVerification = (): UseMockDocumentVerificationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [alterabilityResult, setAlterabilityResult] = useState<AlterabilityAnalysis | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; message: string }>>([]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetResults = useCallback(() => {
    setVerificationResult(null);
    setAlterabilityResult(null);
    setError(null);
  }, []);

  const clearChatHistory = useCallback(() => {
    setChatHistory([]);
  }, []);

  const verifyDocument = useCallback(async (file: File, documentType: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting mock document verification for:', file.name, documentType);
      const result = await mockDocumentVerificationAPI.verifyDocument({
        file,
        documentType,
      });
      console.log('Mock verification completed:', result);
      setVerificationResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Document verification failed';
      setError(errorMessage);
      console.error('Mock verification error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeAlterability = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting mock alterability analysis for:', file.name);
      const result = await mockDocumentVerificationAPI.analyzeAlterability(file);
      console.log('Mock alterability analysis completed:', result);
      setAlterabilityResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Alterability analysis failed';
      setError(errorMessage);
      console.error('Mock alterability analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendChatMessage = useCallback(async (file: File, message: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add user message to chat history
      const newChatHistory = [...chatHistory, { role: 'user' as const, message }];
      setChatHistory(newChatHistory);

      console.log('Sending mock chat message:', message);
      const response = await mockDocumentVerificationAPI.chatWithDocument(file, message, chatHistory);
      console.log('Mock chat response received:', response);
      
      // Add AI response to chat history
      setChatHistory(prev => [...prev, { role: 'ai' as const, message: response.response }]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Chat request failed';
      setError(errorMessage);
      console.error('Mock chat error:', err);
      
      // Remove the user message if the request failed
      setChatHistory(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [chatHistory]);

  return {
    // States
    isLoading,
    error,
    verificationResult,
    alterabilityResult,
    chatHistory,
    
    // Actions
    verifyDocument,
    analyzeAlterability,
    sendChatMessage,
    clearError,
    resetResults,
    clearChatHistory,
  };
};
