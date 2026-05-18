VERTICAL SLICE ARCHITECTURE REFACTORING - MIGRATION GUIDE
===========================================================

## COMPLETED WORK

### ✅ BACKEND (Java/Spring) - 100% COMPLETE

The backend has been fully refactored into a Vertical Slice Architecture:

**Shared Layer** (All features can access):
- shared/entity/User.java
- shared/repository/UserRepository.java
- shared/service/UserService.java
- shared/dto/UserResponse.java
- shared/exception/ (BadRequestException, ResourceNotFoundException, DuplicateResourceException, GlobalExceptionHandler)
- shared/security/ (JwtTokenProvider, JwtAuthenticationFilter, CustomUserDetailsService)
- shared/config/ (SecurityConfig, DataInitializer)

**Feature: Auth** (/auth endpoints)
- features/auth/controller/AuthController.java
- features/auth/service/AuthService.java
- features/auth/dto/ (LoginRequest, RegisterRequest, AuthResponse, ChangePasswordRequest)

**Feature: ConsultationSlots** (/consultation-slots endpoints)
- features/consultationslots/controller/ConsultationSlotController.java
- features/consultationslots/service/ConsultationSlotService.java
- features/consultationslots/entity/ConsultationSlot.java
- features/consultationslots/repository/ConsultationSlotRepository.java
- features/consultationslots/dto/ (ConsultationSlotRequest, ConsultationSlotResponse)

**Feature: Bookings** (/bookings endpoints)
- features/bookings/controller/BookingController.java
- features/bookings/service/BookingService.java
- features/bookings/entity/Booking.java
- features/bookings/repository/BookingRepository.java
- features/bookings/dto/ (BookingRequest, BookingResponse, BookingUpdateRequest)

**Feature: Admin** (/admin endpoints)
- features/admin/controller/AdminController.java
- features/admin/service/AdminService.java
- features/admin/dto/CreateFacultyRequest.java

### NEXT STEPS - WEB FRONTEND

The directory structure has been created. Now migrate files from old to new locations:

OLD -> NEW Mapping:

Auth Pages:
- auth/LoginPage.tsx -> features/auth/pages/LoginPage.tsx
- auth/RegisterPage.tsx -> features/auth/pages/RegisterPage.tsx
- auth/AdminLoginPage.tsx -> features/auth/pages/AdminLoginPage.tsx
- auth/ChangePasswordPage.tsx -> features/auth/pages/ChangePasswordPage.tsx
- auth/AuthLayout.tsx -> features/auth/components/AuthLayout.tsx

Auth Service & Hooks:
- auth/authService.ts -> features/auth/services/authService.ts
- auth/useAuth.ts (create) -> features/auth/hooks/useAuth.ts

Consultation Slots:
- pages/SlotsPage.tsx -> features/consultationslots/pages/SlotsPage.tsx
- pages/CreateSlotPage.tsx -> features/consultationslots/pages/CreateSlotPage.tsx
- components/faculty/SlotTable.tsx -> features/consultationslots/components/SlotTable.tsx
- components/faculty/SlotForm.tsx -> features/consultationslots/components/SlotForm.tsx
- components/faculty/FacultySidebar.tsx -> features/consultationslots/components/FacultySidebar.tsx
- services/consultationSlotService.ts -> features/consultationslots/services/consultationSlotService.ts

Bookings:
- pages/BookConsultationPage.tsx -> features/bookings/pages/BookConsultationPage.tsx
- pages/MyBookingsPage.tsx -> features/bookings/pages/MyBookingsPage.tsx
- components/dashboard/BookingForm.tsx -> features/bookings/components/BookingForm.tsx
- components/dashboard/BookingList.tsx -> features/bookings/components/BookingList.tsx
- services/bookingService.ts -> features/bookings/services/bookingService.ts

Dashboard (Multi-role):
- pages/Dashboard.tsx -> features/dashboard/pages/Dashboard.tsx
- pages/DashboardHomePage.tsx -> features/dashboard/pages/DashboardHomePage.tsx
- pages/FacultyDashboard.tsx -> features/dashboard/pages/FacultyDashboard.tsx
- pages/FacultyHomePage.tsx -> features/dashboard/pages/FacultyHomePage.tsx
- components/dashboard/Sidebar.tsx -> features/dashboard/components/Sidebar.tsx
- components/dashboard/ConsultationSlotCard.tsx -> features/dashboard/components/ConsultationSlotCard.tsx

Admin:
- pages/AdminDashboard.tsx -> features/admin/pages/AdminDashboard.tsx
- pages/AddFacultyPage.tsx -> features/admin/pages/AddFacultyPage.tsx

Protected Routes:
- Create features/auth/guards/ProtectedRoute.tsx

Shared (Common utilities):
- api/axiosConfig.ts -> shared/api/axiosConfig.ts
- services/* (non-feature specific) -> shared/utils/
- components/LoadingSpinner.tsx -> shared/components/LoadingSpinner.tsx
- App.css -> shared/styles/App.css
- App.tsx (update routes) -> root level

### NEXT STEPS - MOBILE APP

The mobile app follows a similar pattern with activities, fragments, and services organized by feature.

**Status**: Structure ready for implementation
**Key Steps**:
1. Create feature-based directories under app/src/main/java/com/example/consultease/features/
2. Move auth activities to features/auth/activities/
3. Move dashboard activities to features/dashboard/activities/
4. Move booking/slot activities to respective features/
5. Update package declarations and imports
6. Move network/API services to shared/network/
7. Move models to respective feature/model directories

## IMPORT MIGRATION PATTERNS

### Backend (Java)
OLD: `import edu.cit.maturan.consultease.service.AuthService;`
NEW: `import edu.cit.maturan.consultease.features.auth.service.AuthService;`

OLD: `import edu.cit.maturan.consultease.entity.User;`
NEW: `import edu.cit.maturan.consultease.shared.entity.User;`

OLD: `import edu.cit.maturan.consultease.exception.BadRequestException;`
NEW: `import edu.cit.maturan.consultease.shared.exception.BadRequestException;`

### Frontend (React/TypeScript)
OLD: `import authService from '../auth/authService';`
NEW: `import authService from '../../features/auth/services/authService';`

OLD: `import LoginPage from './auth/LoginPage';`
NEW: `import LoginPage from '../features/auth/pages/LoginPage';`

## API ENDPOINTS (UNCHANGED)
All API endpoints remain the same - backward compatible:
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- PUT /auth/change-password
- GET /consultation-slots
- POST /consultation-slots
- DELETE /consultation-slots/{id}
- GET /bookings
- POST /bookings
- PUT /bookings/{id}
- POST /admin/faculty

## CROSS-FEATURE DEPENDENCIES

### Acceptable Dependencies:
1. **ConsultationSlots → Bookings**: 
   - ConsultationSlotService imports BookingRepository
   - Reason: Need to check if slot is booked

2. **Bookings → ConsultationSlots**:
   - BookingService imports ConsultationSlotRepository
   - Reason: Need to fetch and update slot details

3. **All Features → Shared**:
   - Import User, UserService, UserRepository, exceptions
   - Reason: Core domain model and utilities

### Avoid These Dependencies:
- Don't import between admin, auth, consultationslots, bookings (except above)
- Keep feature-specific logic self-contained

## VERIFICATION STEPS

After migration:
1. ✅ All files moved to correct locations
2. ✅ All import paths updated
3. ✅ Package declarations updated (Java)
4. ✅ No broken imports
5. ✅ Application compiles/builds successfully
6. ✅ API endpoints work as before
7. ✅ Authentication flows work
8. ✅ Unit tests pass

## BUILD COMMANDS

Backend:
```
mvn clean install
mvn spring-boot:run
```

Frontend:
```
npm install
npm start
```

Mobile:
```
./gradlew build
./gradlew installDebug
```

---

Next Action: Use migration guide to update web frontend and mobile files.
All backend files are ready in their new locations.
