@echo off
SETLOCAL

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Start both frontend and backend
echo Starting the application...
echo Frontend will be available at: http://localhost:5173
echo Backend will be available at: http://localhost:8000

REM Run both servers using npm script
npm run start

ENDLOCAL