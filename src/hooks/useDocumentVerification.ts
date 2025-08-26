import { useState, useCallback } from 'react';
import { documentVerificationAPI, type VerificationResult, type AlterabilityAnalysis, type ChatResponse } from '@/services/api';

export interface UseDocumentVerificationReturn {
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

export const useDocumentVerification = (): UseDocumentVerificationReturn => {
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
      const result = await documentVerificationAPI.verifyDocument({
        file,
        documentType,
      });
      setVerificationResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Document verification failed';
      setError(errorMessage);
      console.error('Verification error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeAlterability = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await documentVerificationAPI.analyzeAlterability(file);
      setAlterabilityResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Alterability analysis failed';
      setError(errorMessage);
      console.error('Alterability analysis error:', err);
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

      const response = await documentVerificationAPI.chatWithDocument(file, message, chatHistory);
      
      // Add AI response to chat history
      setChatHistory(prev => [...prev, { role: 'ai' as const, message: response.response }]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Chat request failed';
      setError(errorMessage);
      console.error('Chat error:', err);
      
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
