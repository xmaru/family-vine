# Backend - Family Vine

This is the backend API for the Family Vine project, built with FastAPI.

## Overview

The Family Vine backend provides a RESTful API for managing family documents, relationships, and visualizations. It handles user authentication, document management, and data processing.

## Prerequisites

- Python 3.8 or later
- pip

## Setup

1. **Create a virtual environment and activate it:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

2. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Update environment variables:**

   Edit the `.env` file with your specific configuration.

4. **Start the server:**

   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at [http://localhost:8000](http://localhost:8000).

## Project Structure

- **api/**: Contains the API routes and dependencies
- **core/**: Contains core functionality (security, config)
- **db/**: Contains database models and session management
- **models/**: Contains SQLAlchemy models
- **schemas/**: Contains Pydantic schemas for validation
- **services/**: Contains business logic

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## TODO

### API Endpoints
- [ ] Complete metadata API endpoints (`/api/metadata/`)
- [ ] Complete relationships API endpoints (`/api/relationships/`)
- [ ] Complete visualization API endpoints (`/api/visualization/`)
- [ ] Add user management endpoints (`/api/users/`)
- [ ] Implement pagination for list endpoints

### Data Models
- [ ] Enhance person model with additional fields (gender, occupation, etc.)
- [ ] Implement relationship types and rules
- [ ] Add event model for timeline visualization

### Infrastructure
- [ ] Set up Alembic for database migrations
- [ ] Configure proper logging
- [ ] Add comprehensive error handling
- [ ] Implement rate limiting
- [ ] Set up unit and integration tests
- [ ] Optimize database queries with proper indexing

### Security
- [ ] Add refresh token implementation
- [ ] Implement password reset functionality
- [ ] Add CSRF protection
- [ ] Set up role-based access control
- [ ] Add API key authentication for external services

### Deployment
- [ ] Create Dockerfile and docker-compose setup
- [ ] Set up production-ready configuration
- [ ] Add health check endpoints
- [ ] Configure monitoring and alerting

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
