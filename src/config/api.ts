// API Configuration
export const API_CONFIG = {
  // Base URL for the FastAPI backend
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
  // API endpoints
  ENDPOINTS: {
    HEALTH: '/health',
    UPLOAD: '/upload',
    VERIFY: '/verify',
    ANALYZE_ALTERABILITY: '/analyze-alterability',
    CHAT: '/chat',
    SUMMARIZE: '/summarize',
  },
  
  // Request settings
  TIMEOUT: 60000, // 60 seconds for longer operations
  UPLOAD_TIMEOUT: 30000, // 30 seconds for uploads
  
  // File upload settings
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['.pdf', '.docx', '.txt', '.doc', '.rtf'],
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000, // 2 seconds between retries
  RETRY_BACKOFF_FACTOR: 1.5, // Exponential backoff
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to check if file type is allowed
export const isFileTypeAllowed = (fileName: string): boolean => {
  const extension = '.' + fileName.split('.').pop()?.toLowerCase();
  return API_CONFIG.ALLOWED_FILE_TYPES.includes(extension);
};

// Helper function to check if file size is within limits
export const isFileSizeAllowed = (fileSize: number): boolean => {
  return fileSize <= API_CONFIG.MAX_FILE_SIZE;
};
