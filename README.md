# Family Vine

Family Vine is a web application designed to help users manage and visualize family documents, relationships, and genealogical information. It consists of a React frontend for user interaction and a FastAPI backend for data processing and storage.

## Project Overview

The Family Vine application allows users to:

- Upload and manage family documents
- Add metadata to documents (who, what, when, where, why information)
- Create and manage profiles for family members
- Define relationships between family members
- Visualize family connections and document relationships

## System Architecture

Family Vine is built with:

- **Frontend**: React-based single-page application
- **Backend**: Python FastAPI RESTful API
- **Database**: SQLite by default (configurable to other databases)
- **Authentication**: JWT-based authentication system
- **Container**: Containerized by Docker 

## Prerequisites

- **Docker**: Docker must installed and accessible
- **If you don't want to use docker:**
   - **Frontend**: Node.js (version 14 or later) and npm (version 6 or later)
   - **Backend**: Python 3.8 or later and pip


## Setup Instructions

### Using Docker
1. **Initial build or when changes are made to the app**
   ```bash
   docker-compose build
   ```
2. **Run the container**
   ```bash
   docker-compose up
   ```
3. **Stop the container**
   ```bash
   docker-compose down
   ```
### Docker takes care of all prerequisites and dependency installations so backend and frontend setup can be skipped
### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd app/backend
   ```

2. **Create and activate a virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**

   Create a `.env` file in the backend directory with the following variables:
   ```
   # Database connection
   DATABASE_URL=sqlite:///./family_vine.db

   # JWT settings
   SECRET_KEY=your-secret-key-change-this-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 1 week

   # CORS settings
   BACKEND_CORS_ORIGINS=["http://localhost:3000"]

   # File upload settings
   UPLOAD_DIRECTORY=./uploads
   ```

5. **Start the backend server:**

   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at [http://localhost:8000](http://localhost:8000).

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd app/frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the frontend development server:**

   ```bash
   npm start
   ```

   The frontend will be available at [http://localhost:3000](http://localhost:3000).

## API Documentation

Once the backend server is running, you can access the interactive API documentation at:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## API Endpoints

The Family Vine API is organized into the following resource categories:

- **Authentication**: `/api/auth/*`
  - POST `/api/auth/register` - Register a new user
  - POST `/api/auth/login` - Log in and obtain JWT token
  - GET `/api/auth/me` - Get current user information

- **Users**: `/api/users/*`
  - PUT `/api/users/me` - Update current user profile

- **Documents**: `/api/documents/*`
  - POST `/api/documents/` - Upload a new document
  - GET `/api/documents/` - List all user documents
  - GET `/api/documents/{id}` - Get document details
  - PUT `/api/documents/{id}` - Update document details
  - DELETE `/api/documents/{id}` - Delete a document
  - GET `/api/documents/{id}/download` - Download document file

- **Metadata**: `/api/documents/{id}/metadata`
  - POST `/api/documents/{id}/metadata` - Add metadata to document
  - GET `/api/documents/{id}/metadata` - Get document metadata
  - PUT `/api/documents/{id}/metadata` - Update document metadata
  - DELETE `/api/documents/{id}/metadata` - Delete document metadata

- **People**: `/api/people/*`
  - POST `/api/people/` - Create a new person
  - GET `/api/people/` - List all people
  - GET `/api/people/{id}` - Get person details
  - PUT `/api/people/{id}` - Update person details
  - DELETE `/api/people/{id}` - Delete a person

- **Relationships**: `/api/relationships/*`
  - POST `/api/relationships/` - Create a relationship between people
  - GET `/api/relationships/` - List all relationships
  - GET `/api/relationships/{id}` - Get relationship details
  - PUT `/api/relationships/{id}` - Update relationship details
  - DELETE `/api/relationships/{id}` - Delete a relationship

- **Visualization**: `/api/visualization/*` (Coming soon)

## Database Schema

The database schema includes the following main entities:

- **Users**: Store user account information
- **Documents**: Track uploaded files and their properties
- **Metadata**: Store document metadata (who, what, when, where, why)
- **People**: Store information about individuals in a family network
- **Relationships**: Define connections between people
- **DocumentPerson**: Link documents to relevant people

## Project Structure

```
|── backend/
│   ├── api/          # API endpoints
│   ├── core/         # Core functionality
│   ├── db/           # Database connections
│   ├── models/       # SQLAlchemy models
│   ├── schemas/      # Pydantic schemas
│   ├── services/     # Business logic
│   └── utils/        # Utility functions
│
└── frontend/
    ├── public/       # Static files
    └── src/
        ├── api/      # API client
        ├── components/  # React components
        ├── context/  # React context
        ├── hooks/    # Custom hooks
        ├── pages/    # Page components
        └── utils/    # Utility functions
```

## Development
### Code Style

- Backend: Follow PEP 8 guidelines
- Frontend: Follow ESLint configuration

### Testing
#### Backend tests
```bash
cd backend
```
```bash
pytest
```
#### Frontend tests
```bash
cd frontend
```
```bash
npm test
```

## License

## Contributors

Luis Guillen luis.a.guillen.arcos-1@ou.edu
John Cervantes john.f.cervantes-1@ou.edu
Umar Mian umian3@ou.edu
Samuel Lupton samuel@ou.edu
Katherine Liggins katherine.e.liggins-1@ou.edu
