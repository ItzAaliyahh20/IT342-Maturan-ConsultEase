package com.example.consultease.dashboard

import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.consultease.R
import com.example.consultease.auth.StudentLoginActivity
import com.example.consultease.auth.storage.AuthStorage
import com.google.android.material.bottomnavigation.BottomNavigationView

class UserDashboardActivity : AppCompatActivity() {

    private lateinit var authStorage: AuthStorage
    
    // Header user info
    private lateinit var userNameText: TextView
    private lateinit var userRoleText: TextView
    
    // Account info display
    private lateinit var welcomeText: TextView
    private lateinit var userEmailText: TextView
    private lateinit var userRoleDisplay: TextView
    private lateinit var userProviderText: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_dashboard)
        
        authStorage = AuthStorage(this)
        
        // Check if user is logged in
        if (authStorage.getToken() == null) {
            navigateToLogin()
            return
        }
        
        // Initialize views
        initViews()
        
        // Load user data
        loadUserData()
        
        // Setup click listeners
        setupClickListeners()
        
        // Setup bottom navigation
        setupBottomNavigation()
    }
    
    private fun initViews() {
        // Header views
        userNameText = findViewById(R.id.userNameText)
        userRoleText = findViewById(R.id.userRoleText)
        
        // Content views
        welcomeText = findViewById(R.id.welcomeText)
        userEmailText = findViewById(R.id.userEmailText)
        userRoleDisplay = findViewById(R.id.userRoleDisplay)
        userProviderText = findViewById(R.id.userProviderText)
    }
    
    private fun loadUserData() {
        val user = authStorage.getUser()
        
        if (user != null) {
            // Set header user info
            userNameText.text = user.fullName
            userRoleText.text = user.role
            
            // Set welcome message
            welcomeText.text = "Welcome, ${user.fullName}!"
            
            // Set account info
            userEmailText.text = user.email
            
            // Format role for display (e.g., STUDENT -> Student)
            val displayRole = formatRole(user.role)
            userRoleDisplay.text = displayRole
            
            // Format provider for display (e.g., local -> Local)
            userProviderText.text = user.provider.replaceFirstChar { it.uppercase() }
        } else {
            // Fallback values if user data is not available
            userNameText.text = "User"
            userRoleText.text = "STUDENT"
            welcomeText.text = "Welcome!"
            userEmailText.text = "Not available"
            userRoleDisplay.text = "Student"
            userProviderText.text = "Local"
        }
    }
    
    private fun formatRole(role: String): String {
        return when (role.uppercase()) {
            "STUDENT" -> "Student"
            "FACULTY" -> "Faculty"
            "ADMIN" -> "Administrator"
            else -> role.replaceFirstChar { it.uppercase() }
        }
    }
    
    private fun setupClickListeners() {
        // Logout button
        findViewById<android.widget.ImageButton>(R.id.logoutButton).setOnClickListener {
            logout()
        }
        
        // Quick action buttons
        findViewById<android.view.View>(R.id.viewFacultyButton).setOnClickListener {
            // Navigate to View Faculty screen
            // TODO: Implement navigation
        }
        
        findViewById<android.view.View>(R.id.myBookingsButton).setOnClickListener {
            // Navigate to My Bookings screen
            // TODO: Implement navigation
        }
        
        findViewById<android.view.View>(R.id.profileSettingsButton).setOnClickListener {
            // Navigate to Profile Settings screen
            // TODO: Implement navigation
        }
    }
    
    private fun setupBottomNavigation() {
        val bottomNav = findViewById<BottomNavigationView>(R.id.bottomNavigation)
        
        bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_dashboard -> {
                    // Already on dashboard
                    true
                }
                R.id.nav_faculty -> {
                    // Navigate to Faculty screen
                    // TODO: Implement navigation
                    true
                }
                R.id.nav_bookings -> {
                    // Navigate to Bookings screen
                    // TODO: Implement navigation
                    true
                }
                R.id.nav_profile -> {
                    // Navigate to Profile screen
                    // TODO: Implement navigation
                    true
                }
                else -> false
            }
        }
    }
    
    private fun logout() {
        authStorage.clear()
        navigateToLogin()
    }
    
    private fun navigateToLogin() {
        val intent = Intent(this, StudentLoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}