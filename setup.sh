#!/bin/bash

echo "Setting up the development environment..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python is not installed! Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed! Please install Node.js 14 or higher."
    exit 1
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install
npm install --save-dev concurrently cross-env

# Create and activate Python virtual environment
echo "Creating Python virtual environment..."
if [ ! -d "venv" ]; then
    python -m venv venv
fi

# Activate virtual environment
# Check if running in Git Bash on Windows
if [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend_example
pip install -r requirements.txt
cd ..

echo "Setup completed successfully!"
echo "To start the application, run: ./start-dev.sh"