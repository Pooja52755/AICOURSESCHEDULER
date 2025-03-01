# AI Course Scheduler

A comprehensive course scheduling application that uses AI to help students organize their academic and personal schedules efficiently.

## Features

- **AI-Powered Scheduling**: Generate optimized daily and weekly schedules based on your courses, study time, and personal activities.
- **Multiple Views**: View your schedule in weekly, timetable, or list format.
- **Task Management**: Create, edit, and organize tasks with priorities and categories.
- **User Authentication**: Secure login and registration system.
- **Responsive Design**: Works on desktop and mobile devices.

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Context API for state management
- Axios for API requests

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

### AI Integration
- Google Gemini API for schedule generation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB installation)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ai-course-scheduler.git
   cd ai-course-scheduler
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

5. Create a `.env` file in the root directory with your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. In a new terminal, start the frontend development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Register a new account or login with existing credentials.
2. Use the AI input section to generate a schedule based on your needs.
3. View and manage your tasks in different views (weekly, timetable, list).
4. Edit tasks by clicking on them.
5. Add notes about your schedule or learning journey.

## API Documentation

For detailed API documentation, see the [Backend README](./backend/README.md).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini API for AI capabilities
- MongoDB Atlas for database hosting
- All contributors and supporters of the project 