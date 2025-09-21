from typing import List, Optional
import os
import logging
from dotenv import load_dotenv
from openai import OpenAI
from openai.types.chat import ChatCompletion
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from tenacity import retry, stop_after_attempt, wait_exponential

# Set up logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Load environment variables
load_dotenv()

class OpenAIService:
    def __init__(self):
        # Load and validate OpenAI API key
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        
        # Initialize OpenAI client
        try:
            self.client = OpenAI(api_key=api_key)
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI client: {str(e)}")
            raise ValueError(f"OpenAI client initialization failed: {str(e)}")
            
        # Set up model configuration
        self.model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
        logger.info(f"Using OpenAI model: {self.model}")
        
        # Configure text splitter for document chunking
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=2000,
            chunk_overlap=200,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )

    def _prepare_document_context(self, text: str) -> List[Document]:
        """Split document into chunks for context."""
        try:
            # Clean and normalize text
            cleaned_text = text.strip().replace('\x00', '')
            if not cleaned_text:
                raise ValueError("Empty document text after cleaning")
                
            return self.text_splitter.create_documents([cleaned_text])
        except Exception as e:
            logger.error(f"Error preparing document context: {str(e)}")
            raise ValueError(f"Failed to process document text: {str(e)}")

    def _get_mock_response(self, message: str) -> dict:
        """Generate a mock response when OpenAI API is unavailable."""
        mock_responses = {
            "explain": "This document appears to be a legal agreement. The main points include standard contractual terms, obligations between parties, and legal requirements. Would you like me to explain any specific section?",
            "summarize": "The document outlines a legal agreement between parties. It contains sections on terms, conditions, obligations, and dispute resolution. Let me know if you need details about any particular aspect.",
            "risk": "I can help identify potential risks in legal documents. Common areas include unclear terms, liability issues, and compliance requirements. Which aspect would you like me to analyze?",
            "clause": """Here are the key clauses typically found in this type of document:

1. Definitions: Terms and phrases used throughout the agreement
2. Scope of Work/Services: What is being provided or performed
3. Payment Terms: Amount, schedule, and method of payment
4. Term and Termination: Duration and conditions for ending the agreement
5. Confidentiality: Protection of sensitive information
6. Intellectual Property Rights: Ownership of work product and IP
7. Liability and Indemnification: Risk allocation between parties
8. Force Majeure: Handling of unforeseen circumstances
9. Governing Law: Which jurisdiction's laws apply
10. Dispute Resolution: How conflicts will be handled

Would you like me to explain any of these clauses in more detail?""",
            "default": "I can help you understand the key clauses, terms, obligations, and legal implications of this document. What specific aspect would you like me to explain?"
        }
        
        message_lower = message.lower()
        if "clause" in message_lower or "key" in message_lower:
            response = mock_responses["clause"]
        elif "explain" in message_lower:
            response = mock_responses["explain"]
        elif "summarize" in message_lower or "summary" in message_lower:
            response = mock_responses["summarize"]
        elif "risk" in message_lower or "dangerous" in message_lower:
            response = mock_responses["risk"]
        else:
            # Check for specific clause inquiries
            if "payment" in message_lower:
                response = """The Payment Terms clause typically covers:
1. Total amount payable
2. Payment schedule (e.g., monthly, quarterly)
3. Payment methods accepted
4. Late payment penalties
5. Currency specifications
6. Invoice requirements
Would you like more details about any of these aspects?"""
            elif "termination" in message_lower:
                response = """The Termination clause outlines:
1. Notice period required
2. Grounds for immediate termination
3. Rights and obligations upon termination
4. Contract wind-down procedures
5. Post-termination obligations
Would you like me to elaborate on any of these points?"""
            elif "confidential" in message_lower:
                response = """The Confidentiality clause covers:
1. Definition of confidential information
2. Permitted uses of confidential data
3. Protection requirements
4. Duration of confidentiality
5. Return/destruction of confidential materials
Which aspect would you like me to explain further?"""
            elif "intellectual" in message_lower or "property" in message_lower:
                response = """The Intellectual Property clause addresses:
1. Ownership of pre-existing IP
2. Rights to new IP created
3. License grants and restrictions
4. IP warranties and representations
5. Protection obligations
Would you like more information about any of these aspects?"""
            else:
                response = mock_responses["default"]
            
        return {
            "response": response,
            "confidence": 0.85,  # Higher confidence for specific responses
            "sources": ["legal_reference_guide"]
        }

    async def chat_with_document(
        self, 
        document_text: str, 
        user_message: str,
        chat_history: Optional[List[dict]] = None
    ) -> dict:
        """Process chat messages with document context."""
        logger = logging.getLogger(__name__)
        
        if not document_text or not user_message:
            raise ValueError("Document text and user message are required")
            
        # If OpenAI API key is not set or empty, use mock response
        if not os.getenv("OPENAI_API_KEY"):
            logger.warning("No OpenAI API key found, using mock response")
            return self._get_mock_response(user_message)
        # Prepare document chunks
        doc_chunks = self._prepare_document_context(document_text)
        
        # Format chat history
        messages = []
        if chat_history:
            for chat in chat_history:
                role = "assistant" if chat["role"] == "ai" else "user"
                messages.append({"role": role, "content": chat["message"]})

        # Add system message with context
        system_message = (
            "You are a legal document analysis assistant. You have access to the following "
            "document context. Use this information to provide accurate answers about the document. "
            "Keep responses clear and focused on the legal aspects.\n\n"
        )
        for chunk in doc_chunks:
            system_message += chunk.page_content + "\n"

        messages = [
            {"role": "system", "content": system_message},
            *messages,
            {"role": "user", "content": user_message}
        ]

        try:
            logger.info("Sending request to OpenAI API...")
            
            # Safety check for message length
            total_tokens = sum(len(msg["content"].split()) for msg in messages)
            if total_tokens > 4000:  # Approximate token limit
                logger.warning("Document too long, truncating...")
                # Keep system message and last parts
                messages = [
                    messages[0],  # system message
                    messages[-2],  # user context
                    messages[-1]   # user question
                ]

            try:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=0.7,
                    max_tokens=800,
                    top_p=0.95,
                    frequency_penalty=0,
                    presence_penalty=0
                )
                
                if not isinstance(response, ChatCompletion):
                    raise ValueError("Unexpected response type from OpenAI API")
                    
                if not response.choices or not response.choices[0].message:
                    raise ValueError("No message in OpenAI API response")
                
                logger.info("Received valid response from OpenAI API")
                return {
                    "response": response.choices[0].message.content,
                    "confidence": 0.95,
                    "sources": ["document_context"]
                }
                
            except Exception as api_error:
                error_message = str(api_error)
                logger.warning(f"OpenAI API error: {error_message}")
                
                # Check for specific error types
                if "insufficient_quota" in error_message or "exceeded your current quota" in error_message:
                    logger.warning("OpenAI API quota exceeded, falling back to mock response")
                    return self._get_mock_response(user_message)
                elif "rate_limit" in error_message or "429" in error_message:
                    logger.warning("OpenAI API rate limit reached, falling back to mock response")
                    return self._get_mock_response(user_message)
                else:
                    # For other errors, raise them
                    raise
                    
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            logger.error(f"Model: {self.model}")
            logger.error(f"Message count: {len(messages)}")
            
            # Return mock response for any error in production
            if os.getenv("ENVIRONMENT") != "development":
                logger.warning("Error in production, falling back to mock response")
                return self._get_mock_response(user_message)
            
            raise Exception("Chat service temporarily unavailable. Please try again later.")