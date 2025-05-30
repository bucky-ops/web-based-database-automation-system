# Running the Web-based DAS System

This guide explains how to set up and run the Web-based Database Automation System (DAS).

## Prerequisites

- Node.js (v14 or higher)
- Python 3.8+
- PostgreSQL 12+
- npm or yarn

## Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/bucky-ops/web-based-database-automation-system.git
   cd web-based-database-automation-system
   ```

2. Create a `.env` file in the `backend` directory with the following variables:
   ```
   PORT=5000
   DB_USER=your_db_user
   DB_HOST=localhost
   DB_NAME=your_db_name
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret
   ```

3. Create a `.env` file in the `frontend` directory (if needed for API URL configuration):
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

## Database Setup

1. Ensure PostgreSQL is running and create a database for the project.
2. Run the database schema:
   ```bash
   cd database
   psql -U your_db_user -d your_db_name -f schema.sql
   ```

## Installing Dependencies

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

### Backend

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
   The server should start on http://localhost:5000.

### Frontend

1. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```
   The frontend should open in your browser at http://localhost:3000.

## Testing Authentication Endpoints

You can test the authentication endpoints using tools like Postman or curl.

### Register a New User

- **Endpoint:** `POST /api/auth/register`
- **Body:**
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Expected Response:** A JSON object containing the user details and a JWT token.

### Login

- **Endpoint:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Expected Response:** A JSON object containing the user details and a JWT token.

## Troubleshooting

- Ensure all environment variables are correctly set.
- Check that PostgreSQL is running and accessible.
- Verify that the backend and frontend servers are running without errors.

## Additional Information

For more details, refer to the project's [README](README.md) and [LICENSE](LICENSE) files. 