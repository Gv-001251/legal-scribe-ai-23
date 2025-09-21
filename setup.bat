@echo off
echo Installing frontend dependencies...
call npm install
call npm install --save-dev concurrently cross-env

echo Setting up Python virtual environment...
python -m venv venv
call venv\Scripts\activate.bat

echo Installing backend dependencies...
cd backend_example
pip install -r requirements.txt
cd ..

echo Setup complete! You can now run both servers with 'npm run start'
pause