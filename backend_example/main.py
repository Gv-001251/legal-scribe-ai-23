"""
FastAPI backend for document verification with OpenAI integration
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uuid
import os
from datetime import datetime
import logging
from services.openai_service import OpenAIService

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI with configuration
app = FastAPI(
    title="Document Verification API",
    version="1.0.0",
    docs_url="/docs" if os.getenv("DEBUG", "False").lower() == "true" else None,
    redoc_url="/redoc" if os.getenv("DEBUG", "False").lower() == "true" else None
)

# Initialize OpenAI service
try:
    openai_service = OpenAIService()
    logger.info("OpenAI service initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize OpenAI service: {str(e)}")
    raise

# CORS middleware with production configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
if not allowed_origins or allowed_origins == [""]:
    # Default origins if not specified
    allowed_origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://legal-scribe-ai-23.netlify.app",
        "https://*.netlify.app"
    ]

logger.info(f"Configuring CORS with allowed origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Credentials"
    ],
    expose_headers=["*"],
    max_age=3600
)

# In-memory storage for demo (use database in production)
uploaded_files = {}
analysis_results = {}

# Pydantic models
class VerificationRequest(BaseModel):
    file_id: str
    document_type: str

class AlterabilityRequest(BaseModel):
    file_id: str

class ChatRequest(BaseModel):
    file_id: str
    message: str
    chat_history: List[Dict[str, str]] = []

class ChatMessage(BaseModel):
    role: str
    message: str

# Health check endpoint
@app.get("/health")
async def health_check():
    logger.info("Health check requested")
    return {"status": "healthy", "version": "1.0.0"}

# Add middleware to log all requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response: {response.status_code}")
    return response

# File upload endpoint
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Debug logging
        logger.info(f"Received file upload request: {file.filename if file else 'None'}")
        logger.info(f"File type: {file.content_type if file else 'None'}")
        
        # Check if file is provided
        if not file or not file.filename:
            logger.error("Error: No file provided")
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        
        # Read file content (in production, save to disk/database)
        content = await file.read()
        
        # Store file info (in production, save to disk/database)
        uploaded_files[file_id] = {
            "filename": file.filename,
            "content_type": file.content_type,
            "size": len(content),
            "uploaded_at": datetime.now().isoformat(),
            "content": content  # Store content for demo purposes
        }
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "size": len(content)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

# Document verification endpoint
@app.post("/verify")
async def verify_document(request: VerificationRequest):
    try:
        if request.file_id not in uploaded_files:
            raise HTTPException(status_code=404, detail="File not found")
        
        # TODO: Implement actual document verification logic here
        # This is a mock response - replace with your NLP/AI verification logic
        
        # Mock verification result
        verification_result = {
            "isValid": True,
            "confidence": 95,
            "isAuthentic": True,
            "authenticityScore": 92,
            "issues": ["Missing witness signature on page 3"],
            "recommendations": [
                "Add witness signature",
                "Verify notary stamp",
                "Check document formatting"
            ],
            "summary": "Document appears to be valid with minor formatting issues. Overall authenticity is high.",
            "riskLevel": "Low",
            "analysisDetails": {
                "structureValidation": True,
                "signatureVerification": False,
                "contentIntegrity": True,
                "metadataAnalysis": True,
                "tamperingDetection": True
            },
            "legalCompliance": {
                "isCompliant": True,
                "missingElements": ["witness_signature"],
                "complianceScore": 85
            }
        }
        
        # Store result
        analysis_results[request.file_id] = verification_result
        
        return verification_result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")

# Alterability analysis endpoint
@app.post("/analyze-alterability")
async def analyze_alterability(request: AlterabilityRequest):
    try:
        if request.file_id not in uploaded_files:
            raise HTTPException(status_code=404, detail="File not found")
        
        # TODO: Implement actual alterability analysis logic here
        # This is a mock response - replace with your tampering detection logic
        
        # Mock alterability result
        alterability_result = {
            "alterabilityRisk": "Low",
            "confidence": 88,
            "findings": [
                "Consistent font usage throughout document",
                "No text insertion detected",
                "Original PDF metadata intact",
                "No suspicious formatting changes"
            ],
            "summary": "Low risk of alteration detected. Document appears authentic with consistent formatting and metadata.",
            "technicalDetails": {
                "fontConsistency": True,
                "textInsertion": False,
                "metadataIntact": True,
                "digitalSignature": False,
                "timestampValidation": True
            }
        }
        
        return alterability_result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Alterability analysis failed: {str(e)}")

# Chat endpoint
@app.post("/chat")
async def chat_with_document(request: ChatRequest):
    logger.info(f"Received chat request for file_id: {request.file_id}")
    logger.info(f"Message: {request.message[:100]}...")  # Log first 100 chars of message
    
    try:
        # Validate file exists
        if request.file_id not in uploaded_files:
            logger.error(f"File not found: {request.file_id}")
            raise HTTPException(status_code=404, detail="File not found")
        
        # Get file content and info
        file_info = uploaded_files[request.file_id]
        file_content = file_info["content"]
        logger.info(f"Retrieved file. Size: {len(file_content)} bytes, Type: {file_info['content_type']}")
        
        # Decode binary content to text
        try:
            logger.info("Attempting UTF-8 decode...")
            document_text = file_content.decode('utf-8')
        except UnicodeDecodeError:
            logger.warning("UTF-8 decode failed, trying latin-1")
            try:
                document_text = file_content.decode('latin-1')
            except:
                logger.error("All decoding attempts failed")
                raise HTTPException(
                    status_code=400, 
                    detail="Unable to process the document content. Please ensure it's a valid text document."
                )
        
        logger.info(f"Successfully decoded file content. Length: {len(document_text)}")
        
        # Use OpenAI service for chat
        logger.info("Sending request to OpenAI service...")
        try:
            chat_response = await openai_service.chat_with_document(
                document_text=document_text,
                user_message=request.message,
                chat_history=request.chat_history
            )
            
            if chat_response.get("sources") == ["mock_response"]:
                logger.info("Using mock response due to API limitations")
                # Still return 200 since we have a valid fallback response
                return chat_response
            
            logger.info("Received response from OpenAI service")
            return chat_response
            
        except Exception as openai_error:
            error_msg = str(openai_error)
            logger.error(f"OpenAI service error: {error_msg}")
            
            if "insufficient_quota" in error_msg or "exceeded your current quota" in error_msg:
                # Return a user-friendly message
                raise HTTPException(
                    status_code=503,
                    detail="AI service is currently unavailable. Using alternative response method."
                )
            elif "rate_limit" in error_msg:
                raise HTTPException(
                    status_code=429,
                    detail="Too many requests. Please try again in a few moments."
                )
            else:
                raise HTTPException(
                    status_code=500,
                    detail="Unable to process your request at this time. Please try again later."
                )
        
    except HTTPException as http_ex:
        logger.error(f"HTTP Exception in chat endpoint: {http_ex.detail}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Our team has been notified."
        )

# Document summary endpoint
@app.post("/summarize")
async def summarize_document(request: AlterabilityRequest):
    try:
        if request.file_id not in uploaded_files:
            raise HTTPException(status_code=404, detail="File not found")
        
        # TODO: Implement actual document summarization logic here
        # This is a mock response - replace with your NLP summarization logic
        
        # Mock summary result
        summary_result = {
            "summary": "This is a legal document containing standard clauses and terms. The document appears to be properly formatted and contains typical legal language and structure.",
            "keyPoints": [
                "Document type: Legal contract",
                "Key parties involved",
                "Main terms and conditions",
                "Signatures and dates",
                "Legal compliance requirements"
            ]
        }
        
        return summary_result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
