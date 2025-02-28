#!/bin/bash
# Test the authentication API endpoints

# Ensure scripts directory exists
mkdir -p scripts

# Navigate to the backend directory
cd backend

# Ensure the server is running
echo "Checking if the server is running..."
if ! curl -s http://localhost:8000/api/health-check > /dev/null; then
    echo "Error: Server is not running on http://localhost:8000"
    echo "Please start the server before running this test"
    exit 1
fi

# Create and activate virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate the virtual environment
source venv/bin/activate || source venv/Scripts/activate

# Ensure required packages are installed
pip install requests argparse

# Run the Python script
python ../scripts/test_auth_api.py "$@"

# Deactivate the virtual environment
deactivate