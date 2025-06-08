# Task Management Application

A modern task management application built with React, Next.js, and Node.js. This application helps teams organize and track their tasks efficiently with features like drag-and-drop task management, real-time updates, and team collaboration.

## Features

- 📋 Task Management with drag-and-drop functionality
- 👥 Team Collaboration
- 📅 Calendar View
- 📊 Task Analytics
- 🔍 Advanced Search and Filtering
- 📱 Responsive Design
- 🔐 User Authentication
- 📧 Email Notifications

## Tech Stack

### Frontend
- React
- Next.js
- Tailwind CSS
- Redux Toolkit
- React DnD (Drag and Drop)

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Nodemailer

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd task-management
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

4. Start the development servers
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd ../frontend
npm run dev
```

The application will be available at `http://localhost:3000`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 