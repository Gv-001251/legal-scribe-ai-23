@echo off
echo Setting up the development environment...

REM Create and activate virtual environment
python -m venv venv
call venv\Scripts\activate.bat

REM Install backend dependencies
cd backend_example
pip install fastapi uvicorn[standard] python-multipart pydantic python-jose[cryptography] passlib[bcrypt] python-dotenv openai
cd ..

REM Install frontend dependencies
call npm install

echo Setup completed!