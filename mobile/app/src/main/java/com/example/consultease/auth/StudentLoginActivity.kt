package com.example.consultease.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.consultease.R
import com.example.consultease.auth.model.LoginRequest
import com.example.consultease.auth.storage.AuthStorage
import com.example.consultease.dashboard.UserDashboardActivity
import com.example.consultease.network.RetrofitClient
import com.google.android.material.card.MaterialCardView
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class StudentLoginActivity : AppCompatActivity() {

    private lateinit var authStorage: AuthStorage
    
    // Views
    private lateinit var emailInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var loginButton: View
    private lateinit var loadingSpinner: ProgressBar
    private lateinit var loginButtonContent: View
    private lateinit var errorCard: MaterialCardView
    private lateinit var errorText: TextView
    private lateinit var registerLinkText: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_student_login)
        
        authStorage = AuthStorage(this)
        
        // Check if already logged in
        if (authStorage.getToken() != null) {
            // Already logged in, check role and redirect
            redirectBasedOnRole()
            return
        }
        
        initViews()
        setupClickListeners()
    }
    
    private fun initViews() {
        emailInput = findViewById(R.id.emailInput)
        passwordInput = findViewById(R.id.passwordInput)
        loginButton = findViewById(R.id.loginButton)
        loadingSpinner = findViewById(R.id.loadingSpinner)
        loginButtonContent = findViewById(R.id.loginButtonContent)
        errorCard = findViewById(R.id.errorCard)
        errorText = findViewById(R.id.errorText)
        registerLinkText = findViewById(R.id.registerLinkText)
    }
    
    private fun setupClickListeners() {
        // Login button
        loginButton.setOnClickListener {
            performLogin()
        }
        
        // Register link
        registerLinkText.setOnClickListener {
            val intent = Intent(this, StudentRegisterActivity::class.java)
            startActivity(intent)
        }
    }
    
    private fun performLogin() {
        val email = emailInput.text.toString().trim()
        val password = passwordInput.text.toString()
        
        // Validate inputs
        if (email.isEmpty()) {
            showError("Please enter your email address")
            return
        }
        
        if (password.isEmpty()) {
            showError("Please enter your password")
            return
        }
        
        // Show loading state
        setLoading(true)
        hideError()
        
        // Make login request
        val loginRequest = LoginRequest(email, password)
        RetrofitClient.authApi.login(loginRequest).enqueue(object : Callback<com.example.consultease.auth.model.AuthResponse> {
            override fun onResponse(
                call: Call<com.example.consultease.auth.model.AuthResponse>,
                response: Response<com.example.consultease.auth.model.AuthResponse>
            ) {
                setLoading(false)
                
                if (response.isSuccessful && response.body() != null) {
                    val authResponse = response.body()!!
                    
                    // Store auth data
                    authStorage.setAuth(authResponse)
                    
                    // Get user role and validate
                    val user = authResponse.user
                    if (user.role.uppercase() == "STUDENT") {
                        // Student role - redirect to user dashboard
                        redirectToUserDashboard()
                    } else {
                        // Not a student - show error and clear auth
                        authStorage.clear()
                        showError("Access denied. This login is for student users only. Please use the admin portal for faculty/administrator access.")
                    }
                } else {
                    // Handle error response
                    val errorMessage = when (response.code()) {
                        401 -> "Invalid email or password"
                        403 -> "Access denied"
                        404 -> "User not found"
                        else -> "Login failed. Please try again."
                    }
                    showError(errorMessage)
                }
            }
            
            override fun onFailure(
                call: Call<com.example.consultease.auth.model.AuthResponse>,
                t: Throwable
            ) {
                setLoading(false)
                showError("Network error. Please check your connection and try again.")
            }
        })
    }
    
    private fun redirectBasedOnRole() {
        val user = authStorage.getUser()
        if (user != null && user.role.uppercase() == "STUDENT") {
            redirectToUserDashboard()
        } else {
            // Not a valid student session, clear and show login
            authStorage.clear()
        }
    }
    
    private fun redirectToUserDashboard() {
        val intent = Intent(this, UserDashboardActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
    
    private fun setLoading(isLoading: Boolean) {
        if (isLoading) {
            loadingSpinner.visibility = View.VISIBLE
            loginButtonContent.visibility = View.GONE
            loginButton.isEnabled = false
        } else {
            loadingSpinner.visibility = View.GONE
            loginButtonContent.visibility = View.VISIBLE
            loginButton.isEnabled = true
        }
    }
    
    private fun showError(message: String) {
        errorText.text = message
        errorCard.visibility = View.VISIBLE
    }
    
    private fun hideError() {
        errorCard.visibility = View.GONE
    }
}