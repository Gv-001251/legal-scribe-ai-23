@echo off
SETLOCAL

echo Setting up the development environment...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed! Please install Python 3.8 or higher.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed! Please install Node.js 14 or higher.
    exit /b 1
)

REM Install frontend dependencies
echo Installing frontend dependencies...
call npm install
call npm install --save-dev concurrently cross-env

REM Create and activate Python virtual environment
echo Creating Python virtual environment...
if not exist "venv" (
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install backend dependencies
echo Installing backend dependencies...
cd backend_example
pip install -r requirements.txt
cd ..

echo Setup completed successfully!
echo To start the application, run: npm run start

ENDLOCAL