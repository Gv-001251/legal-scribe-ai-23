# FastAPI Backend for Document Verification

This is an example FastAPI backend that provides the endpoints needed for the document verification frontend.

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the development server:**
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Access the API documentation:**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

The backend provides the following endpoints that match the frontend requirements:

- `GET /health` - Health check
- `POST /upload` - File upload
- `POST /verify` - Document verification
- `POST /analyze-alterability` - Tampering detection
- `POST /chat` - Document chat
- `POST /summarize` - Document summarization

## Current Implementation

**Note:** This is a basic implementation with mock responses. You need to implement the actual NLP/AI logic for:

1. **Document Verification:**
   - Text extraction and analysis
   - Signature verification
   - Legal compliance checking
   - Fraud detection

2. **Alterability Analysis:**
   - PDF metadata analysis
   - Font consistency checking
   - Text insertion detection
   - Digital signature validation

3. **Document Chat:**
   - Natural language processing
   - Document understanding
   - Question answering

4. **Document Summarization:**
   - Key point extraction
   - Legal clause identification
   - Summary generation

## Adding Real NLP/AI Logic

To implement actual document verification, you'll need to:

1. **Install additional dependencies:**
   ```bash
   pip install PyPDF2 python-docx spacy transformers torch
   ```

2. **Add document processing logic:**
   - Extract text from PDFs and Word documents
   - Parse document structure
   - Analyze content for legal compliance

3. **Implement AI models:**
   - Use pre-trained models for text analysis
   - Implement fraud detection algorithms
   - Add signature verification logic

4. **Add database storage:**
   - Store uploaded files securely
   - Cache analysis results
   - Implement user sessions

## Security Considerations

- Add authentication and authorization
- Implement file validation and sanitization
- Add rate limiting
- Use HTTPS in production
- Implement proper error handling

## Production Deployment

For production deployment:

1. Use a production ASGI server like Gunicorn
2. Add proper logging and monitoring
3. Implement database storage
4. Add authentication and security measures
5. Use environment variables for configuration
6. Implement proper error handling and validation

## Example Usage

Once running, you can test the API:

```bash
# Health check
curl http://localhost:8000/health

# Upload a file
curl -X POST "http://localhost:8000/upload" -H "accept: application/json" -H "Content-Type: multipart/form-data" -F "file=@document.pdf"

# Verify document (replace file_id with actual ID)
curl -X POST "http://localhost:8000/verify" -H "accept: application/json" -H "Content-Type: application/json" -d '{"file_id":"your-file-id","document_type":"contract"}'
```
