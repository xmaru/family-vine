#!/usr/bin/env python
"""
Test script for the Family Vine authentication API.

This script tests the authentication API endpoints of the Family Vine application.
It creates a test user with random credentials, attempts to log in with those credentials,
and retrieves the user's data using the authentication token.

Usage:
    python test_auth_api.py [--url BASE_URL]

Example:
    python test_auth_api.py --url http://localhost:8000
"""
import requests
import json
import argparse
import random
import string

def generate_random_string(length=6):
    """Generate a random string of fixed length.
    
    Args:
        length (int, optional): The length of the random string to generate. Defaults to 6.
        
    Returns:
        str: A random string of lowercase letters with the specified length.
    """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

def test_auth_api(base_url):
    """Test the authentication API endpoints of the Family Vine application.
    
    This function performs the following tests:
    1. User registration with random credentials
    2. User login with the registered credentials
    3. Retrieving the current user's data using the authentication token
    
    Args:
        base_url (str): The base URL of the Family Vine API.
        
    Returns:
        bool: True if all tests pass, False otherwise.
    """
    
    # Generate random credentials to avoid conflicts
    random_suffix = generate_random_string()
    email = f"test_{random_suffix}@example.com"
    username = f"testuser_{random_suffix}"
    password = "testpassword123"
    full_name = f"Test User {random_suffix.capitalize()}"
    
    print(f"\n{'='*50}")
    print("Testing Family Vine Authentication API")
    print(f"{'='*50}")
    
    # 1. Test user registration
    print("\n1. Testing User Registration")
    print(f"{'~'*30}")
    
    register_url = f"{base_url}/api/auth/register"
    user_data = {
        "email": email,
        "username": username,
        "password": password,
        "full_name": full_name
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print(f"Registering user: {username}")
        register_response = requests.post(
            register_url, 
            headers=headers, 
            data=json.dumps(user_data)
        )
        
        print(f"Status Code: {register_response.status_code}")
        
        if register_response.status_code == 200:
            print("✅ Registration successful!")
            print(f"User details: {json.dumps(register_response.json(), indent=2)}")
        else:
            print(f"❌ Registration failed: {register_response.text}")
            return False
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return False
    
    # 2. Test user login
    print("\n2. Testing User Login")
    print(f"{'~'*30}")
    
    login_url = f"{base_url}/api/auth/login"
    
    # Using form data format as required by OAuth2 password flow
    login_data = {
        "username": username,  # Backend expects the username field
        "password": password
    }
    
    try:
        print(f"Logging in with username: {username}")
        login_response = requests.post(
            login_url, 
            data=login_data,  # Use data instead of json for form data
        )
        
        print(f"Status Code: {login_response.status_code}")
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            print("✅ Login successful!")
            print(f"Token: {token_data['access_token'][:15]}...")
            
            # 3. Test getting current user with the token
            print("\n3. Testing Get Current User")
            print(f"{'~'*30}")
            
            me_url = f"{base_url}/api/auth/me"
            auth_headers = {
                "Authorization": f"Bearer {token_data['access_token']}"
            }
            
            print("Getting current user data...")
            me_response = requests.get(me_url, headers=auth_headers)
            
            print(f"Status Code: {me_response.status_code}")
            
            if me_response.status_code == 200:
                print("✅ Successfully retrieved user data!")
                print(f"User data: {json.dumps(me_response.json(), indent=2)}")
            else:
                print(f"❌ Failed to retrieve user data: {me_response.text}")
        else:
            print(f"❌ Login failed: {login_response.text}")
            return False
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False
    
    print(f"\n{'='*50}")
    print("✅ All authentication tests passed!")
    print(f"{'='*50}")
    print("\nTest user credentials:")
    print(f"Email: {email}")
    print(f"Username: {username}")
    print(f"Password: {password}")
    
    return True

def main():
    """Parse command line arguments and run the authentication API tests.
    
    This function sets up the command line argument parser, parses the arguments,
    and calls the test_auth_api function with the provided base URL.
    """
    parser = argparse.ArgumentParser(description="Test the Family Vine authentication API")
    parser.add_argument("--url", default="http://localhost:8000", help="Base URL of the Family Vine API")
    
    args = parser.parse_args()
    
    test_auth_api(args.url)

if __name__ == "__main__":
    main()