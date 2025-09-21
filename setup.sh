#!/bin/bash

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install
npm install --save-dev concurrently cross-env

# Create and activate Python virtual environment
echo "Setting up Python virtual environment..."
python -m venv venv
source venv/Scripts/activate

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend_example
pip install -r requirements.txt
cd ..

echo "Setup complete! You can now run both servers with 'npm run start'"