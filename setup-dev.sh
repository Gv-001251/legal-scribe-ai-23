#!/bin/bash

# Create and activate Python virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/Scripts/activate

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend_example
pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install
npm install --save-dev concurrently cross-env

echo "Setup complete!"