#!/bin/bash
# Create a test user with default credentials

# Ensure scripts directory exists
mkdir -p scripts

# Navigate to the backend directory
cd backend

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
python ../scripts/create_test_user.py "$@"

# Deactivate the virtual environment
deactivate

echo "-----------------------------------"
echo "Test user credentials:"
echo "Email: test@example.com"
echo "Username: testuser"
echo "Password: testpassword"
echo "-----------------------------------"
echo "You can now login using these credentials."