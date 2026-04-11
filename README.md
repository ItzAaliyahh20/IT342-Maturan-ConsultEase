# ConsultEase - Faculty Consultation Booking System

ConsultEase is a full-stack web application for faculty consultation booking, designed to streamline the process of scheduling appointments between students and faculty members.

> **Note**: The current dashboard implementation is temporary and serves only to demonstrate proper user authentication functionality. Future development will include role-specific dashboards for students and faculty.

## Overview

ConsultEase eliminates the need for physical queues by providing a digital platform where students can easily book consultation slots with their professors. The system supports role-based access for students, faculty, and administrators.

## Features

### Authentication & Authorization
- **JWT-based Authentication**: Secure token-based login system
- **Role-based Access Control**: Three user roles - STUDENT, FACULTY, ADMIN
- **Public Registration**: Students can self-register with university email
- **Password Management**: Secure password change functionality for faculty

### User Features
- **Student Portal**: Register and login, view faculty, book consultations
- **Faculty Portal**: Manage availability, view/manage bookings
- **Admin Dashboard**: Manage faculty accounts, view statistics

### Recent Changes (Consultation Slots & Booking)

#### Main Feature Description
- Faculty can create and manage consultation slots.
- Students can browse available slots and create bookings.
- Faculty can update consultation/booking status for assigned bookings.

#### Inputs and Validations Used
- Create Consultation Slot
  - `date` (required)
  - `startTime` (required)
  - `duration` (required, minimum: 1)
- Create Booking
  - `slotId` (required)
  - `purpose` (required, non-blank)
- Business Validation
  - Only FACULTY can create/delete slots.
  - Only STUDENT can create bookings.
  - Slot must exist and must not already be booked.
  - Faculty can only delete their own slots.
  - Booked slots cannot be deleted.
  - Status updates validate allowed booking statuses: `PENDING`, `APPROVED`, `REJECTED`.

#### How the Feature Works
1. Faculty creates a slot, which is saved as available (`isBooked = false`).
2. Student selects an available slot and submits booking purpose.
3. System creates booking with default status `PENDING` and marks slot as booked.
4. Faculty can later update booking status for consultations assigned to them.

#### API Endpoints Used
- Consultation Slots
  - `GET /consultation-slots`
  - `POST /consultation-slots` (FACULTY)
  - `DELETE /consultation-slots/{id}` (FACULTY)
- Bookings
  - `GET /bookings`
  - `POST /bookings` (STUDENT)
  - `PUT /bookings/{id}` (STUDENT/FACULTY/ADMIN with service-level ownership checks)

#### Database Tables Involved
- `users` (role and ownership checks)
- `consultation_slots` (slot schedule and availability)
- `bookings` (slot booking record, purpose, status, student/faculty references)

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Tailwind CSS, Lucide React, Axios |
| Backend | Spring Boot 3.x, Java 17, PostgreSQL, JWT |
| Database | PostgreSQL (Supabase) with PgBouncer |

---

## User Authentication

### User Types

| Type | Description | Registration Method |
|------|-------------|---------------------|
| STUDENT | University students | Self-registration form (public) |
| FACULTY | Professors/instructors | Created by Admin |
| ADMIN | System administrators | Created by Admin |

---

### User Registration

**Registration Fields:**
- `fullName` - User's full name
- `email` - University email address
- `password` - Account password

> **Note:** Faculty accounts are manually added by the administrator through the admin panel.

**Validation Process:**
- Email format validation
- Password requirements: min 8 characters, uppercase, lowercase, number, special character
- Frontend and backend validation

**Duplicate Prevention:**
- Backend checks if email already exists
- Returns 409 Conflict if duplicate

**Password Storage:**
- BCrypt hashing with 12 rounds
- Never stored in plain text

---

### User Login

**Login Credentials:**
- `email` - User's registered email
- `password` - Account password

**Verification Process:**
1. Backend receives email/password
2. Finds user by email in database
3. Validates password using BCrypt
4. Generates JWT token with user role
5. Returns token + user info

**After Successful Login:**
- Token stored in localStorage
- Redirect based on role:
  - ADMIN → /admin
  - STUDENT/FACULTY → /dashboard

---

### Database Table

```
Table: users
Columns:
  - id BIGINT (primary key, auto-generated)
  - email VARCHAR(255) (unique)
  - password VARCHAR(255) (BCrypt hashed)
  - full_name VARCHAR(255)
  - role VARCHAR(20) -- STUDENT, FACULTY, ADMIN
  - created_at TIMESTAMP
```

---

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Student self-registration |
| POST | `/auth/login` | User login |
| POST | `/auth/change-password` | Change password (faculty) |
| GET | `/auth/me` | Get current user |

---

### Role-Based Access Control

**Backend Security:**
- `/auth/login`, `/auth/register` - Public
- `/auth/change-password` - Requires FACULTY or ADMIN
- `/admin/**` - Requires ADMIN only
- All other endpoints - Require authentication

**Frontend Routing:**
- Unauthenticated → /login
- Authenticated accessing /login/register → /dashboard
- ADMIN → /admin
- STUDENT/FACULTY → /dashboard

---

## Project Structure

```
ConsultEase/
├── web/
│   └── frontend/               # React frontend
│       ├── src/
│       │   ├── api/axios.ts    # Axios with interceptors
│       │   ├── auth/           # Auth components
│       │   ├── pages/          # Student/Faculty/Admin pages
│       │   └── App.js          # Routing
├── backend/consultease/        # Spring Boot
│   └── src/main/java/.../
│       ├── config/SecurityConfig.java
│       ├── controller/AuthController.java
│       ├── controller/ConsultationSlotController.java
│       ├── controller/BookingController.java
│       ├── entity/User.java
│       ├── entity/ConsultationSlot.java
│       ├── entity/Booking.java
│       └── security/JwtTokenProvider.java
└── README.md
```

## Getting Started

### Frontend
```bash
cd web/frontend
npm install
npm start
```

### Backend
```bash
cd backend/consultease
mvn spring-boot:run
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080

## Security Features

- BCrypt password hashing (12 rounds)
- JWT tokens with 256-bit encryption
- Token expiration (24 hours)
- Protected routes with auth guards
- CORS configuration

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

---

## Mobile App (Android)

ConsultEase includes a native Android application for student registration and login.

### Technology Stack

| Component | Technology |
|-----------|------------|
| Language | Kotlin 1.9 |
| UI | Android Views, Material Design |
| Network | Retrofit 2 + OkHttp |
| Storage | SharedPreferences |
| Min SDK | 24 (Android 7.0) |

---

### User Authentication (Mobile)

#### User Registration (Student Only)

**Registration Fields:**
- `fullName` - User's full name (min 2 characters)
- `email` - University email address
- `password` - Account password

> **Note:** Faculty accounts are manually added by the administrator through the admin panel.

**Validation Process:**
- Email format validation (Android Patterns.EMAIL_ADDRESS)
- Password requirements: min 8 characters, uppercase, lowercase, number, special character
- Real-time validation with error feedback

**Duplicate Prevention:**
- Backend checks if email already exists
- Returns 409 Conflict if duplicate
- Error card displays "An account with this email already exists."

**Password Storage:**
- BCrypt hashing with 12 rounds (backend)
- Never stored in plain text

---

#### User Login

**Login Credentials:**
- `email` - User's registered email
- `password` - Account password

**Verification Process:**
1. App sends email/password to backend
2. Spring Security validates using BCrypt
3. Backend returns JWT token + user info
4. App stores token in SharedPreferences

**After Successful Login:**
- Token stored in SharedPreferences
- Navigate to Student Dashboard

---

### Mobile API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Create new student account |
| POST | `/auth/login` | Public | Authenticate user |
| POST | `/auth/logout` | Authenticated | Clear session |
| PUT | `/auth/change-password` | Authenticated (FACULTY) | Update password |

---

### Mobile Database Schema

```
Table: users
Columns:
  - id BIGINT (primary key, auto-generated)
  - email VARCHAR(255) (unique)
  - password_hash VARCHAR(255) (BCrypt hashed)
  - full_name VARCHAR(255)
  - role VARCHAR(20) -- STUDENT, FACULTY, ADMIN
  - provider VARCHAR(50) -- LOCAL, GOOGLE
  - created_at TIMESTAMP
```

---

### Mobile App Structure

```
mobile/
├── app/src/main/
│   ├── java/com/example/consultease/
│   │   ├── auth/
│   │   │   ├── StudentRegisterActivity.kt    # Registration screen
│   │   │   ├── model/AuthModels.kt          # Data classes
│   │   │   └── storage/AuthStorage.kt       # Token storage
│   │   ├── network/
│   │   │   ├── AuthApiService.kt             # Retrofit API
│   │   │   └── RetrofitClient.kt             # HTTP client
│   │   └── dashboard/
│   │       └── StudentDashboardActivity.kt  # Main dashboard
│   └── res/
│       ├── drawable/                         # Icons
│       │   ├── ic_user_plus (grad cap)       # Logo icon
│       │   ├── ic_user_outline.png           # Name field icon
│       │   ├── ic_mail_outline.png           # Email field icon
│       │   └── ic_lock_outline.png           # Password field icon
│       └── layout/
│           └── activity_student_register.xml # Registration layout
```

---

### Icon System

| Icon File | Usage | Size | Color |
|-----------|-------|------|-------|
| `ic_user_plus` | Logo header (graduation cap) | 46dp/24dp | @color/button_accent |
| `ic_user_outline` | Full name field | 24dp | @color/button_accent |
| `ic_mail_outline` | Email field | 24dp | @color/button_accent |
| `ic_lock_outline` | Password field | 24dp | @color/button_accent |

---

### Building the Mobile App

```bash
cd mobile
./gradlew assembleDebug
```

The APK will be generated at:
`mobile/app/build/outputs/apk/debug/app-debug.apk`

**Note:** For Android Emulator, the backend must be accessible at `http://10.0.2.2:8080` (emulator localhost mapping).
