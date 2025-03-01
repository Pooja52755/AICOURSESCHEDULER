# AI Course Scheduler Backend

This is the backend API for the AI Course Scheduler application. It provides endpoints for user authentication and task management.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. Run the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- **Register User**: `POST /api/users`
  - Request Body: `{ name, email, password }`
  - Response: User object with token

- **Login User**: `POST /api/users/login`
  - Request Body: `{ email, password }`
  - Response: User object with token

- **Get User Profile**: `GET /api/users/profile`
  - Headers: `Authorization: Bearer <token>`
  - Response: User object

- **Update User Profile**: `PUT /api/users/profile`
  - Headers: `Authorization: Bearer <token>`
  - Request Body: `{ name, email, password, preferences }`
  - Response: Updated user object with token

### Tasks

- **Get All Tasks**: `GET /api/tasks`
  - Headers: `Authorization: Bearer <token>`
  - Response: Array of task objects

- **Create Task**: `POST /api/tasks`
  - Headers: `Authorization: Bearer <token>`
  - Request Body: `{ title, description, startTime, endTime, priority, category, completed }`
  - Response: Created task object

- **Get Task by ID**: `GET /api/tasks/:id`
  - Headers: `Authorization: Bearer <token>`
  - Response: Task object

- **Update Task**: `PUT /api/tasks/:id`
  - Headers: `Authorization: Bearer <token>`
  - Request Body: Task fields to update
  - Response: Updated task object

- **Delete Task**: `DELETE /api/tasks/:id`
  - Headers: `Authorization: Bearer <token>`
  - Response: Success message

- **Get Tasks by Date Range**: `GET /api/tasks/range?startDate=<date>&endDate=<date>`
  - Headers: `Authorization: Bearer <token>`
  - Query Parameters: `startDate`, `endDate` (ISO format)
  - Response: Array of task objects within the date range

## Models

### User

- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, min length 6)
- `preferences`: Object
  - `theme`: String (enum: 'light', 'dark')
  - `defaultView`: String (enum: 'weekly', 'timetable', 'list')
- `timestamps`: Created and updated timestamps

### Task

- `userId`: String (required)
- `title`: String (required)
- `description`: String
- `startTime`: Date (required)
- `endTime`: Date (required)
- `priority`: String (enum: 'low', 'medium', 'high')
- `category`: String (enum: 'class', 'study', 'work', 'personal', 'other')
- `completed`: Boolean
- `timestamps`: Created and updated timestamps 