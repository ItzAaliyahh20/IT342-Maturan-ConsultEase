package com.example.consultease.dashboard

import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.consultease.R
import com.example.consultease.auth.AdminLoginActivity
import com.example.consultease.auth.storage.AuthStorage
import com.google.android.material.bottomnavigation.BottomNavigationView

class AdminDashboardActivity : AppCompatActivity() {

    private lateinit var authStorage: AuthStorage
    private lateinit var welcomeText: TextView
    private lateinit var userInfoText: TextView
    private lateinit var userRoleDisplay: TextView
    private lateinit var totalUsersText: TextView
    private lateinit var activeSessionsText: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_dashboard)
        
        authStorage = AuthStorage(this)
        
        // Check if user is logged in and is admin
        val user = authStorage.getUser()
        if (user == null || user.role.uppercase() != "ADMIN") {
            // Not authorized, redirect to admin login
            val intent = Intent(this, AdminLoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            finish()
            return
        }
        
        initViews()
        displayUserInfo(user)
        setupClickListeners()
        setupBottomNavigation()
    }
    
    private fun initViews() {
        welcomeText = findViewById(R.id.welcomeText)
        userInfoText = findViewById(R.id.userInfoText)
        userRoleDisplay = findViewById(R.id.userRoleDisplay)
        totalUsersText = findViewById(R.id.totalUsersText)
        activeSessionsText = findViewById(R.id.activeSessionsText)
    }
    
    private fun displayUserInfo(user: com.example.consultease.auth.model.UserResponse) {
        welcomeText.text = "Welcome, Administrator!"
        userInfoText.text = user.email
        userRoleDisplay.text = "ADMINISTRATOR"
        
        // Placeholder statistics
        totalUsersText.text = "0"
        activeSessionsText.text = "0"
    }
    
    private fun setupClickListeners() {
        // Logout button
        findViewById<android.widget.ImageButton>(R.id.logoutButton)?.setOnClickListener {
            authStorage.clear()
            val intent = Intent(this, AdminLoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            finish()
        }
        
        // Manage Faculty
        findViewById<android.view.View>(R.id.manageFacultyButton)?.setOnClickListener {
            Toast.makeText(this, "Manage Faculty - Coming soon", Toast.LENGTH_SHORT).show()
        }
        
        // Add Faculty
        findViewById<android.view.View>(R.id.addFacultyButton)?.setOnClickListener {
            val intent = Intent(this, AddFacultyActivity::class.java)
            startActivity(intent)
        }
        
        // View All Users
        findViewById<android.view.View>(R.id.viewAllUsersButton)?.setOnClickListener {
            Toast.makeText(this, "View All Users - Coming soon", Toast.LENGTH_SHORT).show()
        }
        
        // System Settings
        findViewById<android.view.View>(R.id.systemSettingsButton)?.setOnClickListener {
            Toast.makeText(this, "System Settings - Coming soon", Toast.LENGTH_SHORT).show()
        }
    }
    
    private fun setupBottomNavigation() {
        val bottomNav = findViewById<BottomNavigationView>(R.id.bottomNavigation)
        bottomNav?.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_dashboard -> {
                    // Already on dashboard
                    true
                }
                R.id.nav_users -> {
                    Toast.makeText(this, "Users - Coming soon", Toast.LENGTH_SHORT).show()
                    true
                }
                R.id.nav_settings -> {
                    Toast.makeText(this, "Settings - Coming soon", Toast.LENGTH_SHORT).show()
                    true
                }
                else -> false
            }
        }
    }
}