#!/bin/bash

# Activate virtual environment
if [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Start both frontend and backend
echo "Starting the application..."
echo "Frontend will be available at: http://localhost:5173"
echo "Backend will be available at: http://localhost:8000"

# Run both servers using npm script
npm run start