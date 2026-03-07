# ConsultEase - Faculty Consultation Booking System

ConsultEase is a full-stack web application for faculty consultation booking, designed to streamline the process of scheduling appointments between students and faculty members.

## Overview

ConsultEase eliminates the need for physical queues by providing a digital platform where students can easily book consultation slots with their professors. The system supports role-based access for students, faculty, and administrators.

## Features

### Authentication & Authorization
- **JWT-based Authentication**: Secure token-based login system
- **Role-based Access Control**: Three user roles - STUDENT, FACULTY, ADMIN
- **Public Registration**: Students can self-register with university email
- **Password Management**: Secure password change functionality for faculty

### User Features
- **Student Portal**:
  - Register and login with university email
  - View available faculty and their consultation slots
  - Book, view, and manage appointments
  - Receive booking confirmations

- **Faculty Portal**:
  - Manage consultation availability
  - View and manage student bookings
  - Set weekly consultation schedules
  - Accept or decline appointment requests

- **Admin Dashboard**:
  - Manage faculty accounts
  - View system-wide statistics
  - User management capabilities

### UI/UX Features
- Responsive design for mobile and desktop
- Animated left panel with visual enhancements
- Dynamic page titles
- Loading states and error handling
- Google OAuth integration (planned)

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router v6

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT (Spring Security)
- **ORM**: Spring Data JPA / Hibernate
- **Connection Pooling**: PgBouncer

## Project Structure

```
ConsultEase/
├── frontend/                    # React frontend application
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── src/
│   │   ├── api/               # API configuration
│   │   │   └── axios.ts       # Axios instance with interceptors
│   │   ├── auth/              # Authentication components
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ChangePasswordPage.tsx
│   │   │   └── authService.ts
│   │   ├── pages/             # Page components
│   │   │   └── Dashboard.tsx
│   │   ├── App.js             # Main app with routing
│   │   └── index.css          # Global styles
│   └── package.json
│
├── backend/                    # Spring Boot backend
│   └── consultease/
│       └── src/main/
│           ├── java/edu/cit/maturan/consultease/
│           │   ├── config/     # Configuration classes
│           │   │   └── SecurityConfig.java
│           │   ├── controller/ # REST controllers
│           │   │   ├── AuthController.java
│           │   │   └── AdminController.java
│           │   ├── dto/        # Data Transfer Objects
│           │   ├── entity/     # JPA entities
│           │   │   └── User.java
│           │   ├── exception/  # Exception handlers
│           │   ├── repository/ # Data repositories
│           │   ├── security/   # JWT utilities
│           │   │   ├── JwtTokenProvider.java
│           │   │   └── JwtAuthenticationFilter.java
│           │   └── service/    # Business logic
│           │       └── UserService.java
│           └── resources/
│               ├── application.properties
│               └── migrations/ # SQL migrations
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- PostgreSQL database (local or Supabase)

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend runs on http://localhost:3000

### Backend Setup

1. Configure database connection in `backend/consultease/src/main/resources/application.properties`

2. Build and run:
```bash
cd backend/consultease
mvn spring-boot:run
```

The backend runs on http://localhost:8080

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/login` | User login | Public |
| POST | `/auth/register` | Student registration | Public |
| POST | `/auth/change-password` | Change password | Faculty |
| GET | `/auth/me` | Get current user | Authenticated |

### Admin
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/admin/faculty` | Create faculty account | Admin |
| GET | `/admin/users` | List all users | Admin |

## Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| email | VARCHAR(255) | Unique email |
| password | VARCHAR(255) | BCrypt hashed |
| full_name | VARCHAR(255) | User's full name |
| role | VARCHAR(20) | STUDENT, FACULTY, ADMIN |
| created_at | TIMESTAMP | Account creation time |

## Environment Variables

### Backend (application.properties)
```properties
# Database
spring.datasource.url=jdbc:postgresql://host:port/database
spring.datasource.username=username
spring.datasource.password=password

# JWT
app.jwt.secret=your-256-bit-base64-secret-key
app.jwt.expiration=86400000
```

### Frontend
- API base URL is configured in `frontend/src/api/axios.ts`

## Security Features

- BCrypt password hashing (12 rounds)
- JWT tokens with 256-bit encryption
- Token expiration (24 hours)
- Protected routes with auth guards
- CORS configuration
- Prepared statement cache disabled for PgBouncer compatibility

## Development Notes

- Student registration is public (self-service)
- Faculty and Admin accounts are created by administrators
- Passwords must meet complexity requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&_+-=)

## License

This project is for educational purposes as part of IT342 course requirements.
