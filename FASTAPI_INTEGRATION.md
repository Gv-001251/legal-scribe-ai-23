# FastAPI Integration for Document Verification

This document explains how to integrate the React frontend with the FastAPI backend for document verification and authenticity checking.

## Overview

The application is designed to verify the authenticity of legal documents and detect potential fraud using AI-powered analysis. The frontend communicates with a FastAPI backend that performs the actual document analysis.

## API Endpoints

The FastAPI backend should implement the following endpoints:

### 1. Health Check
```
GET /health
```
Returns the status and version of the API.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

### 2. File Upload
```
POST /upload
```
Uploads a document file for analysis.

**Request:** Multipart form data with `file` field
**Response:**
```json
{
  "file_id": "unique_file_identifier",
  "filename": "document.pdf",
  "size": 1024000
}
```

### 3. Document Verification
```
POST /verify
```
Verifies document authenticity and validity.

**Request:**
```json
{
  "file_id": "unique_file_identifier",
  "document_type": "contract"
}
```

**Response:**
```json
{
  "isValid": true,
  "confidence": 95,
  "isAuthentic": true,
  "authenticityScore": 92,
  "issues": ["Missing witness signature on page 3"],
  "recommendations": ["Add witness signature", "Verify notary stamp"],
  "summary": "Document appears to be valid with minor formatting issues.",
  "riskLevel": "Low",
  "analysisDetails": {
    "structureValidation": true,
    "signatureVerification": false,
    "contentIntegrity": true,
    "metadataAnalysis": true,
    "tamperingDetection": true
  },
  "legalCompliance": {
    "isCompliant": true,
    "missingElements": ["witness_signature"],
    "complianceScore": 85
  }
}
```

### 4. Alterability Analysis
```
POST /analyze-alterability
```
Analyzes document for potential tampering or alterations.

**Request:**
```json
{
  "file_id": "unique_file_identifier"
}
```

**Response:**
```json
{
  "alterabilityRisk": "Low",
  "confidence": 88,
  "findings": [
    "Consistent font usage",
    "No text insertion detected",
    "Original PDF metadata intact"
  ],
  "summary": "Low risk of alteration detected. Document appears authentic.",
  "technicalDetails": {
    "fontConsistency": true,
    "textInsertion": false,
    "metadataIntact": true,
    "digitalSignature": false,
    "timestampValidation": true
  }
}
```

### 5. Chat with Document
```
POST /chat
```
Allows users to ask questions about the document.

**Request:**
```json
{
  "file_id": "unique_file_identifier",
  "message": "What does clause 3.2 mean?",
  "chat_history": [
    {"role": "user", "message": "Previous question"},
    {"role": "ai", "message": "Previous answer"}
  ]
}
```

**Response:**
```json
{
  "response": "Clause 3.2 refers to the termination conditions...",
  "confidence": 92,
  "sources": ["page_3", "legal_database"]
}
```

### 6. Document Summary
```
POST /summarize
```
Provides a summary of the document.

**Request:**
```json
{
  "file_id": "unique_file_identifier"
}
```

**Response:**
```json
{
  "summary": "This is a standard employment contract...",
  "keyPoints": [
    "Employment duration: 2 years",
    "Salary: $75,000 annually",
    "Benefits: Health insurance, 401k"
  ]
}
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# FastAPI Backend Configuration
VITE_API_BASE_URL=http://localhost:8000

# Optional: API Key if your FastAPI requires authentication
VITE_API_KEY=your_api_key_here

# Development settings
VITE_DEBUG=true
```

### API Configuration

The API configuration is managed in `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  ENDPOINTS: {
    HEALTH: '/health',
    UPLOAD: '/upload',
    VERIFY: '/verify',
    ANALYZE_ALTERABILITY: '/analyze-alterability',
    CHAT: '/chat',
    SUMMARIZE: '/summarize',
  },
  TIMEOUT: 30000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['.pdf', '.docx', '.txt'],
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};
```

## Usage

### 1. Start the FastAPI Backend

Make sure your FastAPI backend is running on the configured port (default: 8000).

### 2. Start the React Frontend

```bash
npm run dev
```

### 3. Test the Integration

1. Navigate to the document verification page
2. Select a document type
3. Upload a document file
4. Run verification and analysis tasks
5. View the results

## Error Handling

The application includes comprehensive error handling:

- Network errors are caught and displayed to users
- File validation ensures only supported file types and sizes are uploaded
- API errors are logged and user-friendly messages are shown
- Loading states provide feedback during API calls

## Security Considerations

- Files are uploaded securely and deleted after analysis
- API endpoints should implement proper authentication if needed
- File size and type validation prevents malicious uploads
- CORS should be configured properly for cross-origin requests

## Development

### Adding New Endpoints

1. Add the endpoint to `API_CONFIG.ENDPOINTS` in `src/config/api.ts`
2. Add the method to the `DocumentVerificationAPI` class in `src/services/api.ts`
3. Update the hook in `src/hooks/useDocumentVerification.ts` if needed
4. Update components to use the new functionality

### Testing

The application includes mock data for development when the API is not available. To test with real API:

1. Ensure FastAPI backend is running
2. Set `VITE_API_BASE_URL` to your backend URL
3. Test all functionality with real documents

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your FastAPI backend has CORS configured
2. **File Upload Issues**: Check file size limits and allowed file types
3. **API Connection**: Verify the `VITE_API_BASE_URL` is correct
4. **Authentication**: Add API key to headers if required

### Debug Mode

Enable debug mode by setting `VITE_DEBUG=true` in your environment variables. This will provide additional logging information.
