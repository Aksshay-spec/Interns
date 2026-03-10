# TutoApp - Educational Platform

A full-stack educational platform supporting multiple user roles (Admin, Tenant, Tutor, Student) with class management, authentication, and email notifications.

## Project Overview

**TutoApp** is a comprehensive web-based educational management system that enables:
- **Admins** to manage the platform, approve tenants, and oversee all activities
- **Tenants** (Organizations) to manage tutors and classes
- **Tutors** to create and manage classes
- **Students** to enroll in and attend classes

## Tech Stack

### Frontend (Client)
- **Framework**: React 19 with Vite
- **UI Framework**: TailwindCSS + Radix UI components
- **State Management**: React Query (@tanstack/react-query)
- **Forms**: React Hook Form
- **Routing**: React Router v7
- **HTTP**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **File Upload**: Multer
- **Email**: Nodemailer
- **Development**: Nodemon

## Project Structure

```
tuto_app/
├── Client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── admin/      # Admin role components
│   │   │   ├── tenant/     # Tenant role components
│   │   │   ├── tutor/      # Tutor role components
│   │   │   ├── student/    # Student role components
│   │   │   ├── common/     # Shared components (Loader, etc)
│   │   │   └── ui/         # Base UI components (Button, Input, Card, etc)
│   │   ├── contexts/       # React Context (AuthContext)
│   │   ├── hooks/          # Custom hooks organized by role
│   │   ├── layouts/        # Page layouts for each role
│   │   ├── pages/          # Page components organized by role
│   │   ├── routes/         # Route protection & configuration
│   │   ├── services/       # API service calls (axios)
│   │   ├── utils/          # Utility functions
│   │   ├── lib/            # Helper libraries
│   │   └── App.jsx         # Main app component
│   └── vite.config.js      # Vite configuration
│
└── server/                # Node.js/Express backend
    ├── controllers/        # Request handlers for each feature
    ├── models/            # Mongoose data models
    ├── routes/            # API endpoint definitions
    ├── middlewares/       # Auth & role verification
    ├── configs/           # Database, mail, and file upload config
    ├── services/          # Business logic (email templates, etc)
    ├── templates/         # Email templates for various events
    ├── uploads/           # Temporary file storage
    └── server.js          # Express app entry point
```

## User Roles & Features

### Admin
- Approve/block tenant registrations
- Manage platform users
- Monitor system activities

### Tenant (Organization)
- Create and manage organization
- Register and manage tutors
- Create classes and manage courses

### Tutor
- Create and manage classes
- Upload course materials
- Track student attendance

### Student
- Browse available classes
- Enroll in classes
- Attend online or offline classes

## API Services

**Available API services** (in `server/services/admin.api.js`, etc.):
- **Authentication**: Login, signUp, passwordReset
- **Admin Operations**: User management, tenant approval, statistics
- **Class Management**: Create, update, delete classes
- **Student Management**: Enrollments, attendance tracking
- **Tenant Management**: Organization profile, tutor roster
- **Tutor Management**: Profile, class management

## Authentication Flow

1. User registers/logs in via `/auth` endpoints
2. Backend validates credentials and issues JWT token
3. JWT stored in client-side session/storage
4. Protected routes verify token via `ProtectedRoutes` component
5. Role-based middleware enforces access control

## Email Notifications

The system sends automated emails for:
- Tenant registration confirmation (admin)
- Tenant approval notification
- Tenant blocking notification
- Tenant status changes (active/inactive)
- Student enrollment confirmation
- Tutor invitation

**Email templates** located in `server/templates/`

## Getting Started

### Backend Setup
```bash
cd server
npm install
# Create .env with database credentials
npm run dev  # Start with nodemon
```

### Frontend Setup
```bash
cd Client
npm install
npm run dev  # Start Vite dev server
```

### Environment Variables
Backend `.env` should include:
- MongoDB connection string
- JWT secret
- Email service credentials
- API port

## Key Middleware

- **auth.middleware.js**: Verifies JWT tokens
- **role.middleware.js**: Validates user role permissions
- **multer.js**: Handles file uploads

## Database Models

- **User**: Base user with common fields
- **Admin**: Extends User
- **Tenant**: Organization profile
- **Tutor**: Instructor profile
- **Student**: Learner profile
- **Class**: Course/class definition

## Component Architecture

Components are organized by user role for easy maintainability:
- Each role has: Header, Footer, Sidebar navigation
- Common components (Loader, Unauthorized) shared across roles
- Base UI components in `components/ui/` (Button, Input, Card, Dialog, etc)

## Contributing

When adding features:
1. Create API endpoints in appropriate `routes/` file
2. Add business logic in `controllers/`
3. Create React components in role-specific folder
4. Add API service calls in `services/`
5. Update relevant hooks if needed
6. Add email template if notification required
