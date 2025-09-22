@echo off
echo Starting development servers...

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Start frontend and backend concurrently using npm's concurrently
call npm run start