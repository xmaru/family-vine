#!/usr/bin/env python
"""
Create a test user in the Family Vine application.

This script provides functionality to create test users through the Family Vine API.
It can be run from the command line with various parameters to customize the user creation.

Example:
    python create_test_user.py --email test@example.com --username testuser --password testpassword

Note:
    This script should be run from the backend directory.
"""
import requests
import json
import argparse

def create_test_user(base_url, email, username, password, full_name=None):
    """Create a test user using the registration API.
    
    Args:
        base_url (str): The base URL of the Family Vine API.
        email (str): Email address for the test user.
        username (str): Username for the test user.
        password (str): Password for the test user.
        full_name (str, optional): Full name for the test user. Defaults to None.
    
    Returns:
        bool: True if user creation was successful, False otherwise.
    
    Raises:
        requests.exceptions.RequestException: If there's an error with the API request.
    """
    url = f"{base_url}/api/auth/register"
    
    user_data = {
        "email": email,
        "username": username,
        "password": password
    }
    
    if full_name:
        user_data["full_name"] = full_name
        
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(user_data))
        
        if response.status_code == 200:
            print(f"User '{username}' created successfully!")
            print("User details:")
            print(json.dumps(response.json(), indent=2))
            return True
        else:
            print(f"Failed to create user. Status code: {response.status_code}")
            print("Response:", response.text)
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    """Parse command line arguments and create a test user.
    
    This function sets up the argument parser with default values and calls
    the create_test_user function with the provided arguments.
    
    Command line arguments:
        --url: Base URL of the Family Vine API (default: http://localhost:8000)
        --email: Email address for the test user (default: test@example.com)
        --username: Username for the test user (default: testuser)
        --password: Password for the test user (default: testpassword)
        --full-name: Full name for the test user (default: Test User)
    """
    parser = argparse.ArgumentParser(description="Create a test user for Family Vine")
    parser.add_argument("--url", default="http://localhost:8000", help="Base URL of the Family Vine API")
    parser.add_argument("--email", default="test@example.com", help="Email address for the test user")
    parser.add_argument("--username", default="testuser", help="Username for the test user")
    parser.add_argument("--password", default="testpassword", help="Password for the test user")
    parser.add_argument("--full-name", default="Test User", help="Full name for the test user")
    
    args = parser.parse_args()
    
    create_test_user(
        args.url,
        args.email,
        args.username,
        args.password,
        args.full_name
    )

if __name__ == "__main__":
    main()