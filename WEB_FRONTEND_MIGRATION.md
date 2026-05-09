# Web Frontend - Vertical Slice Architecture Migration Guide

## NEW STRUCTURE CREATED

### Shared Layer (Location: `src/shared/`)
✅ Created shared utilities and components for all features:

**Files Created:**
- `shared/api/apiClient.ts` - Axios instance with auth interceptors
- `shared/types/common.types.ts` - Shared type definitions
- `shared/utils/errorHandler.ts` - Error handling utilities
- `shared/constants/apiConstants.ts` - API and route constants

**Directories Ready:**
- `shared/components/` - Common UI components (LoadingSpinner, ErrorAlert)
- `shared/hooks/` - Shared React hooks
- `shared/styles/` - Global styles

### Feature Layer Directories Created

**Auth Feature** (`features/auth/`)
- ✅ `services/authService.ts` - Auth API client (CREATED)
- ✅ `types/auth.types.ts` - Auth TypeScript interfaces (CREATED)
- ✅ `hooks/useAuth.ts` - Auth custom hook (CREATED)
- ✅ `guards/ProtectedRoute.tsx` - Route protection components (CREATED)
- `pages/` - Auth pages (need migration)
- `components/` - Auth layout component (need migration)

**ConsultationSlots Feature** (`features/consultationslots/`)
- ✅ `types/consultationslots.types.ts` - Types (CREATED)
- `pages/` - SlotsPage.tsx, CreateSlotPage.tsx (need migration)
- `components/` - SlotTable, SlotForm, FacultySidebar (need migration)
- `services/` - consultationSlotService.ts (need migration)
- `hooks/` - useConsultationSlots.ts (need creation)

**Bookings Feature** (`features/bookings/`)
- ✅ `types/bookings.types.ts` - Types (CREATED)
- `pages/` - BookConsultationPage, MyBookingsPage (need migration)
- `components/` - BookingForm, BookingList (need migration)
- `services/` - bookingService.ts (need migration)
- `hooks/` - useBookings.ts (need creation)

**Dashboard Feature** (`features/dashboard/`)
- `pages/` - Dashboard.tsx, DashboardHomePage.tsx, etc. (need migration)
- `components/` - Sidebar, ConsultationSlotCard (need migration)
- `types/` - Dashboard types (need creation)

**Admin Feature** (`features/admin/`)
- `pages/` - AdminDashboard.tsx, AddFacultyPage.tsx (need migration)
- `components/` - AdminSidebar (need creation)
- `services/` - adminService.ts (need creation)
- `types/` - Admin types (need creation)

---

## MIGRATION STEPS

### Step 1: Migrate Auth Files

Copy files:
```
OLD: src/auth/LoginPage.tsx → NEW: src/features/auth/pages/LoginPage.tsx
OLD: src/auth/RegisterPage.tsx → NEW: src/features/auth/pages/RegisterPage.tsx
OLD: src/auth/AdminLoginPage.tsx → NEW: src/features/auth/pages/AdminLoginPage.tsx
OLD: src/auth/ChangePasswordPage.tsx → NEW: src/features/auth/pages/ChangePasswordPage.tsx
OLD: src/auth/AuthLayout.tsx → NEW: src/features/auth/components/AuthLayout.tsx
```

Update imports in each file:
```typescript
// OLD
import authService from './authService';
import AuthLayout from './AuthLayout';

// NEW
import authService from '../services/authService';
import AuthLayout from '../components/AuthLayout';
import { LoginRequest, RegisterRequest } from '../types/auth.types';
```

### Step 2: Migrate ConsultationSlots Files

Copy files:
```
OLD: src/pages/SlotsPage.tsx → NEW: src/features/consultationslots/pages/SlotsPage.tsx
OLD: src/pages/CreateSlotPage.tsx → NEW: src/features/consultationslots/pages/CreateSlotPage.tsx
OLD: src/components/faculty/SlotTable.tsx → NEW: src/features/consultationslots/components/SlotTable.tsx
OLD: src/components/faculty/SlotForm.tsx → NEW: src/features/consultationslots/components/SlotForm.tsx
OLD: src/components/faculty/FacultySidebar.tsx → NEW: src/features/consultationslots/components/FacultySidebar.tsx
OLD: src/services/consultationSlotService.ts → NEW: src/features/consultationslots/services/consultationSlotService.ts
```

Update imports:
```typescript
// OLD
import consultationSlotService from '../services/consultationSlotService';
import SlotTable from '../components/faculty/SlotTable';
import authService from '../auth/authService';

// NEW
import consultationSlotService from '../services/consultationSlotService';
import SlotTable from '../components/SlotTable';
import authService from '../../features/auth/services/authService';
import { ConsultationSlot } from '../types/consultationslots.types';
```

### Step 3: Migrate Bookings Files

Copy files:
```
OLD: src/pages/BookConsultationPage.tsx → NEW: src/features/bookings/pages/BookConsultationPage.tsx
OLD: src/pages/MyBookingsPage.tsx → NEW: src/features/bookings/pages/MyBookingsPage.tsx
OLD: src/components/dashboard/BookingForm.tsx → NEW: src/features/bookings/components/BookingForm.tsx
OLD: src/components/dashboard/BookingList.tsx → NEW: src/features/bookings/components/BookingList.tsx
OLD: src/services/bookingService.ts → NEW: src/features/bookings/services/bookingService.ts
```

Update imports:
```typescript
// OLD
import bookingService from '../services/bookingService';
import consultationSlotService from '../services/consultationSlotService';
import BookingForm from '../components/dashboard/BookingForm';

// NEW
import bookingService from '../services/bookingService';
import consultationSlotService from '../../features/consultationslots/services/consultationSlotService';
import BookingForm from '../components/BookingForm';
import { Booking, CreateBookingRequest } from '../types/bookings.types';
```

### Step 4: Migrate Dashboard Files

Copy files:
```
OLD: src/pages/Dashboard.tsx → NEW: src/features/dashboard/pages/Dashboard.tsx
OLD: src/pages/DashboardHomePage.tsx → NEW: src/features/dashboard/pages/DashboardHomePage.tsx
OLD: src/pages/FacultyDashboard.tsx → NEW: src/features/dashboard/pages/FacultyDashboard.tsx
OLD: src/pages/FacultyHomePage.tsx → NEW: src/features/dashboard/pages/FacultyHomePage.tsx
OLD: src/components/dashboard/Sidebar.tsx → NEW: src/features/dashboard/components/Sidebar.tsx
OLD: src/components/dashboard/ConsultationSlotCard.tsx → NEW: src/features/dashboard/components/ConsultationSlotCard.tsx
```

Update imports:
```typescript
// OLD
import authService from '../auth/authService';
import Sidebar from '../components/dashboard/Sidebar';
import consultationSlotService from '../services/consultationSlotService';

// NEW
import authService from '../../features/auth/services/authService';
import Sidebar from '../components/Sidebar';
import consultationSlotService from '../../features/consultationslots/services/consultationSlotService';
import { ProtectedRoute } from '../../features/auth/guards/ProtectedRoute';
```

### Step 5: Migrate Admin Files

Copy files:
```
OLD: src/pages/AdminDashboard.tsx → NEW: src/features/admin/pages/AdminDashboard.tsx
OLD: src/pages/AddFacultyPage.tsx → NEW: src/features/admin/pages/AddFacultyPage.tsx
```

Update imports:
```typescript
// OLD
import authService from '../auth/authService';

// NEW
import authService from '../../features/auth/services/authService';
```

### Step 6: Update App.tsx Routes

Update the main App.tsx file to use new import paths:

```typescript
// OLD
import LoginPage from './auth/LoginPage';
import Dashboard from './pages/Dashboard';
import BookConsultationPage from './pages/BookConsultationPage';

// NEW
import LoginPage from './features/auth/pages/LoginPage';
import Dashboard from './features/dashboard/pages/Dashboard';
import BookConsultationPage from './features/bookings/pages/BookConsultationPage';
import { ProtectedRoute, AdminProtectedRoute, StudentProtectedRoute, FacultyProtectedRoute } from './features/auth/guards/ProtectedRoute';
```

Update routes:
```typescript
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/auth/admin/login" element={<AdminLoginPage />} />
  
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
    <Route index element={<DashboardHomePage />} />
    <Route path="book" element={<StudentProtectedRoute><BookConsultationPage /></StudentProtectedRoute>} />
    <Route path="bookings" element={<MyBookingsPage />} />
  </Route>

  <Route path="/faculty" element={<FacultyProtectedRoute><FacultyDashboard /></FacultyProtectedRoute>}>
    <Route index element={<FacultyHomePage />} />
    <Route path="consultation-slots" element={<SlotsPage />} />
  </Route>

  <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
  <Route path="/admin/faculty/add" element={<AdminProtectedRoute><AddFacultyPage /></AdminProtectedRoute>} />
</Routes>
```

### Step 7: Migrate Shared Components

Move common components to shared:
```
OLD: src/components/LoadingSpinner.tsx → NEW: src/shared/components/LoadingSpinner.tsx
OLD: src/components/ErrorAlert.tsx → NEW: src/shared/components/ErrorAlert.tsx
OLD: src/App.css → NEW: src/shared/styles/App.css
```

### Step 8: Delete Old Directories

Once all files are migrated:
```bash
rm -rf src/auth/
rm -rf src/pages/ (after moving all files)
rm -rf src/components/ (after moving all files)
rm -rf src/services/
```

---

## IMPORT REFERENCE GUIDE

### From Auth Feature
```typescript
import authService from '../features/auth/services/authService';
import { useAuth } from '../features/auth/hooks/useAuth';
import { ProtectedRoute } from '../features/auth/guards/ProtectedRoute';
import { AuthResponse, User } from '../features/auth/types/auth.types';
```

### From ConsultationSlots Feature
```typescript
import consultationSlotService from '../features/consultationslots/services/consultationSlotService';
import { ConsultationSlot } from '../features/consultationslots/types/consultationslots.types';
import SlotTable from '../features/consultationslots/components/SlotTable';
```

### From Bookings Feature
```typescript
import bookingService from '../features/bookings/services/bookingService';
import { Booking } from '../features/bookings/types/bookings.types';
import BookingForm from '../features/bookings/components/BookingForm';
```

### From Shared
```typescript
import { apiClient } from '../shared/api/apiClient';
import { getErrorMessage } from '../shared/utils/errorHandler';
import { API_ROUTES, ROUTES } from '../shared/constants/apiConstants';
import { CommonUser } from '../shared/types/common.types';
```

---

## VERIFICATION CHECKLIST

- [ ] All files copied to new locations
- [ ] All import paths updated (run IDE find & replace)
- [ ] No import errors in IDE
- [ ] Application builds successfully: `npm run build`
- [ ] Dev server starts: `npm start`
- [ ] Auth flow works (login, register, logout)
- [ ] Protected routes work correctly
- [ ] Consultation slots page loads
- [ ] Booking flow works
- [ ] Dashboard displays correctly
- [ ] Admin dashboard accessible

---

## COMMON ERRORS & FIXES

**Error**: "Cannot find module '../auth/authService'"
**Fix**: Update import to `'../../features/auth/services/authService'`

**Error**: "useAuth is not a function"
**Fix**: Ensure you're importing from hooks: `import { useAuth } from '../../features/auth/hooks/useAuth'`

**Error**: "Type is not defined"
**Fix**: Import types from feature types: `import { User } from '../../features/auth/types/auth.types'`

---

## API ENDPOINTS (UNCHANGED)

All API endpoints work exactly as before:
- POST `/api/auth/login`
- POST `/api/auth/register`
- PUT `/api/auth/change-password`
- GET `/api/consultation-slots`
- POST `/api/consultation-slots`
- DELETE `/api/consultation-slots/{id}`
- GET `/api/bookings`
- POST `/api/bookings`
- PUT `/api/bookings/{id}`
- POST `/api/admin/faculty`

---

## NEXT: Mobile App Migration

After completing web frontend, follow similar pattern for mobile:
- Move Android activities to `features/{feature}/activities/`
- Move fragments to `features/{feature}/fragments/`
- Move models to `features/{feature}/model/`
- Update package declarations
- Update import statements
