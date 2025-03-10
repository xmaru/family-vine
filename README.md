# Family Vine

Family Vine is a web application designed to help users manage and visualize family documents and relationships. It consists of a frontend built with React and a backend powered by FastAPI.

## Overview

The Family Vine project is divided into two main components:

- **Frontend**: A single-page application (SPA) built with React, providing a user-friendly interface for managing documents and visualizations.
- **Backend**: A RESTful API built with FastAPI, handling user authentication, document management, and data processing.

## Prerequisites

- **Frontend**: Node.js (version 14 or later) and npm (version 6 or later)
- **Backend**: Python 3.8 or later and pip

## Setup

### Frontend

1. **Navigate to the frontend directory:**

   ```bash
   cd app/frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the frontend server:**

   ```bash
   npm start
   ```

   The frontend will be available at [http://localhost:3000](http://localhost:3000).

### Backend

1. **Navigate to the backend directory:**

   ```bash
   cd app/backend
   ```

2. **Create a virtual environment and activate it:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Start the backend server:**

   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at [http://localhost:8000](http://localhost:8000).

## Project Structure

- **app/frontend**: Contains the React frontend application.
- **app/backend**: Contains the FastAPI backend application.

## API Documentation

Once the backend server is running, you can access the API documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

## TODO

### High Priority
- Complete implementation of metadata and relationship management
- Add advanced visualization features for family trees and relationships
- Implement proper error handling across both frontend and backend
- Set up unit and integration testing frameworks
- Complete UI components (login, register, document management)
- Add form validation on the frontend

### Medium Priority
- Set up Docker containerization for easier deployment
- Implement CI/CD pipeline
- Add database migrations
- Improve security features (rate limiting, CSRF protection)
- Enhance documentation with API examples
- Implement user preferences and settings

### Low Priority
- Add internationalization support
- Optimize performance for large family trees
- Create admin dashboard
- Add advanced search capabilities
- Implement batch document processing

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.