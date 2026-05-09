# Mobile App - Vertical Slice Architecture Migration Guide

## NEW STRUCTURE CREATED

### Shared Layer (Location: `app/src/main/java/com/example/consultease/shared/`)
**Directories Created & Ready:**
- `shared/network/` - RetrofitClient, ApiService, AuthInterceptor
- `shared/model/` - User, ApiResponse entity classes
- `shared/util/` - Constants, ErrorHandler, DateUtils
- `shared/ui/theme/` - ConsulteaseTheme
- `shared/ui/components/` - LoadingDialog, ErrorDialog
- `shared/extensions/` - ContextExtensions
- `shared/viewmodel/` - BaseViewModel

### Feature Layer Directories Created

**Auth Feature** (`features/auth/`)
- `activities/` - StudentLoginActivity, StudentRegisterActivity, AdminLoginActivity
- `model/` - LoginRequest, RegisterRequest, AuthResponse
- `storage/` - AuthStorage
- `service/` - AuthService

**ConsultationSlots Feature** (`features/consultationslots/`)
- `activities/` - SlotsActivity
- `fragments/` - SlotsFragment
- `adapter/` - SlotsAdapter
- `model/` - ConsultationSlot, CreateSlotRequest
- `service/` - ConsultationSlotService

**Bookings Feature** (`features/bookings/`)
- `activities/` - BookingsActivity
- `fragments/` - BookingListFragment, CreateBookingFragment
- `adapter/` - BookingsAdapter
- `model/` - Booking, CreateBookingRequest
- `service/` - BookingService

**Dashboard Feature** (`features/dashboard/`)
- `activities/` - StudentDashboardActivity, UserDashboardActivity, FacultyDashboardActivity
- `fragments/` - DashboardFragment
- `viewmodel/` - DashboardViewModel

**Admin Feature** (`features/admin/`)
- `activities/` - AddFacultyActivity
- `model/` - CreateFacultyRequest
- `service/` - AdminService

---

## MIGRATION STEPS

### Step 1: Migrate Auth Activities

Copy files:
```
OLD: app/src/main/java/com/example/consultease/auth/StudentLoginActivity.kt
  → NEW: app/src/main/java/com/example/consultease/features/auth/activities/StudentLoginActivity.kt

OLD: app/src/main/java/com/example/consultease/auth/StudentRegisterActivity.kt
  → NEW: app/src/main/java/com/example/consultease/features/auth/activities/StudentRegisterActivity.kt

OLD: app/src/main/java/com/example/consultease/auth/AdminLoginActivity.kt
  → NEW: app/src/main/java/com/example/consultease/features/auth/activities/AdminLoginActivity.kt
```

Update package declarations in each file:
```kotlin
// OLD
package com.example.consultease.auth

// NEW
package com.example.consultease.features.auth.activities
```

Update imports:
```kotlin
// OLD
import com.example.consultease.auth.model.LoginRequest
import com.example.consultease.auth.storage.AuthStorage

// NEW
import com.example.consultease.features.auth.model.LoginRequest
import com.example.consultease.features.auth.storage.AuthStorage
```

Update AndroidManifest.xml:
```xml
<!-- OLD -->
<activity android:name=".auth.StudentLoginActivity" />

<!-- NEW -->
<activity android:name=".features.auth.activities.StudentLoginActivity" />
```

### Step 2: Migrate Auth Models & Storage

Copy files:
```
OLD: app/src/main/java/com/example/consultease/auth/model/LoginRequest.kt
  → NEW: app/src/main/java/com/example/consultease/features/auth/model/LoginRequest.kt

OLD: app/src/main/java/com/example/consultease/auth/model/RegisterRequest.kt
  → NEW: app/src/main/java/com/example/consultease/features/auth/model/RegisterRequest.kt

OLD: app/src/main/java/com/example/consultease/auth/storage/AuthStorage.kt
  → NEW: app/src/main/java/com/example/consultease/features/auth/storage/AuthStorage.kt
```

Update package declarations:
```kotlin
// OLD
package com.example.consultease.auth.model

// NEW
package com.example.consultease.features.auth.model
```

### Step 3: Migrate Dashboard Activities

Copy files:
```
OLD: app/src/main/java/com/example/consultease/dashboard/StudentDashboardActivity.kt
  → NEW: app/src/main/java/com/example/consultease/features/dashboard/activities/StudentDashboardActivity.kt

OLD: app/src/main/java/com/example/consultease/dashboard/UserDashboardActivity.kt
  → NEW: app/src/main/java/com/example/consultease/features/dashboard/activities/UserDashboardActivity.kt

OLD: app/src/main/java/com/example/consultease/dashboard/AdminDashboardActivity.kt
  → NEW: app/src/main/java/com/example/consultease/features/dashboard/activities/AdminDashboardActivity.kt
```

Update package declarations and imports:
```kotlin
// OLD
package com.example.consultease.dashboard

import com.example.consultease.auth.storage.AuthStorage

// NEW
package com.example.consultease.features.dashboard.activities

import com.example.consultease.features.auth.storage.AuthStorage
```

Update AndroidManifest.xml:
```xml
<!-- OLD -->
<activity android:name=".dashboard.StudentDashboardActivity" />
<activity android:name=".dashboard.AdminDashboardActivity" />

<!-- NEW -->
<activity android:name=".features.dashboard.activities.StudentDashboardActivity" />
<activity android:name=".features.dashboard.activities.AdminDashboardActivity" />
```

### Step 4: Migrate Admin Activities

Copy files:
```
OLD: app/src/main/java/com/example/consultease/dashboard/AddFacultyActivity.kt
  → NEW: app/src/main/java/com/example/consultease/features/admin/activities/AddFacultyActivity.kt
```

Update package declaration:
```kotlin
// OLD
package com.example.consultease.dashboard

// NEW
package com.example.consultease.features.admin.activities
```

Update imports:
```kotlin
// OLD
import com.example.consultease.auth.storage.AuthStorage

// NEW
import com.example.consultease.features.auth.storage.AuthStorage
```

Update AndroidManifest.xml:
```xml
<!-- OLD -->
<activity android:name=".dashboard.AddFacultyActivity" />

<!-- NEW -->
<activity android:name=".features.admin.activities.AddFacultyActivity" />
```

### Step 5: Migrate Network & Shared Services

Copy files to shared:
```
OLD: app/src/main/java/com/example/consultease/network/RetrofitClient.kt
  → NEW: app/src/main/java/com/example/consultease/shared/network/RetrofitClient.kt

OLD: app/src/main/java/com/example/consultease/auth/model/AuthResponse.kt
  → NEW: app/src/main/java/com/example/consultease/shared/model/AuthResponse.kt

OLD: app/src/main/java/com/example/consultease/auth/model/User.kt
  → NEW: app/src/main/java/com/example/consultease/shared/model/User.kt
```

Update package declarations:
```kotlin
// OLD
package com.example.consultease.network

// NEW
package com.example.consultease.shared.network
```

Update imports in all activities:
```kotlin
// OLD
import com.example.consultease.network.RetrofitClient
import com.example.consultease.auth.model.User

// NEW
import com.example.consultease.shared.network.RetrofitClient
import com.example.consultease.shared.model.User
```

### Step 6: Update MainActivity & ConsulteaseApp

Update main app files:
```kotlin
// MainActivity.kt - Update package if moved
package com.example.consultease

// ConsulteaseApp.kt - Update package if moved
package com.example.consultease
```

### Step 7: Update AndroidManifest.xml - Complete

After all activities are migrated, update complete manifest:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.example.consultease">

    <!-- Permissions unchanged -->
    <uses-permission android:name="android.permission.INTERNET" />
    
    <application>
        <!-- Auth Activities -->
        <activity
            android:name=".features.auth.activities.StudentLoginActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <activity
            android:name=".features.auth.activities.StudentRegisterActivity"
            android:exported="false" />

        <activity
            android:name=".features.auth.activities.AdminLoginActivity"
            android:exported="false" />

        <!-- Dashboard Activities -->
        <activity
            android:name=".features.dashboard.activities.StudentDashboardActivity"
            android:exported="false" />

        <activity
            android:name=".features.dashboard.activities.UserDashboardActivity"
            android:exported="false" />

        <activity
            android:name=".features.dashboard.activities.AdminDashboardActivity"
            android:exported="false" />

        <!-- Admin Activities -->
        <activity
            android:name=".features.admin.activities.AddFacultyActivity"
            android:exported="false" />

        <!-- Main Activity -->
        <activity
            android:name=".MainActivity"
            android:exported="false" />
    </application>

</manifest>
```

---

## IMPORT REFERENCE GUIDE

### Auth Feature
```kotlin
import com.example.consultease.features.auth.activities.StudentLoginActivity
import com.example.consultease.features.auth.storage.AuthStorage
import com.example.consultease.features.auth.model.LoginRequest
```

### Dashboard Feature
```kotlin
import com.example.consultease.features.dashboard.activities.UserDashboardActivity
```

### Admin Feature
```kotlin
import com.example.consultease.features.admin.activities.AddFacultyActivity
```

### Shared
```kotlin
import com.example.consultease.shared.network.RetrofitClient
import com.example.consultease.shared.model.User
import com.example.consultease.shared.util.Constants
```

---

## PACKAGE MIGRATION REFERENCE

| OLD Package | NEW Package |
|------------|------------|
| `com.example.consultease.auth` | `com.example.consultease.features.auth` |
| `com.example.consultease.dashboard` | `com.example.consultease.features.dashboard` |
| `com.example.consultease.network` | `com.example.consultease.shared.network` |
| `com.example.consultease.auth.model` | `com.example.consultease.features.auth.model` |
| `com.example.consultease.auth.storage` | `com.example.consultease.features.auth.storage` |

---

## FIND & REPLACE COMMANDS

Use IDE Find & Replace (Ctrl+H) for efficient migration:

### Replace all auth package references:
```
Find:    package com.example.consultease.auth
Replace: package com.example.consultease.features.auth

Find:    import com.example.consultease.auth.
Replace: import com.example.consultease.features.auth.
```

### Replace all dashboard package references:
```
Find:    package com.example.consultease.dashboard
Replace: package com.example.consultease.features.dashboard

Find:    import com.example.consultease.dashboard.
Replace: import com.example.consultease.features.dashboard.
```

### Replace network imports:
```
Find:    import com.example.consultease.network.
Replace: import com.example.consultease.shared.network.
```

---

## VERIFICATION CHECKLIST

- [ ] All activities moved to features directories
- [ ] All package declarations updated
- [ ] All import statements updated
- [ ] AndroidManifest.xml activity paths updated
- [ ] No IDE compilation errors
- [ ] App builds successfully: `./gradlew build`
- [ ] App installs: `./gradlew installDebug`
- [ ] Auth flow works (login, register)
- [ ] Dashboard displays correctly
- [ ] Admin functionality works
- [ ] Network calls work correctly

---

## COMMON ERRORS & FIXES

**Error**: "Package does not exist: com.example.consultease.auth"
**Fix**: Update imports to `com.example.consultease.features.auth`

**Error**: "Activity not found" at runtime
**Fix**: Verify AndroidManifest.xml has correct activity paths with new packages

**Error**: "Unresolved reference: RetrofitClient"
**Fix**: Update import to `import com.example.consultease.shared.network.RetrofitClient`

**Error**: Activity won't start
**Fix**: Check manifest for correct android:name attribute (should match new package path)

---

## API ENDPOINTS (UNCHANGED)

All API endpoints work exactly as before. Network client configuration remains the same:
- Base URL: `http://localhost:8080/api`
- All endpoints at same paths

---

## TESTING

After migration, test each feature:
```
1. Launch app → StudentLoginActivity
2. Test login
3. Navigate to StudentDashboardActivity
4. Test consultation slots view
5. Test booking functionality
6. Admin flow: AdminLoginActivity → AdminDashboardActivity
```

---

## OPTIONAL: Future Improvements

Once migration is complete:
- Add feature-specific ViewModels
- Implement dependency injection (Hilt)
- Create feature-specific Network clients
- Add unit tests per feature
- Implement feature flags for A/B testing
