package com.example.consultease.dashboard

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.consultease.R
import com.example.consultease.auth.model.CreateFacultyRequest
import com.example.consultease.auth.model.AuthResponse
import com.example.consultease.auth.storage.AuthStorage
import com.example.consultease.network.RetrofitClient
import com.google.android.material.card.MaterialCardView
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class AddFacultyActivity : AppCompatActivity() {

    private lateinit var authStorage: AuthStorage
    
    // Views
    private lateinit var fullNameInput: EditText
    private lateinit var emailInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var createButton: View
    private lateinit var loadingSpinner: ProgressBar
    private lateinit var createButtonContent: View
    private lateinit var errorCard: MaterialCardView
    private lateinit var errorText: TextView
    private lateinit var successCard: MaterialCardView
    private lateinit var successText: TextView
    private lateinit var backButton: View

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_faculty)
        
        authStorage = AuthStorage(this)
        
        // Check if user is admin
        val user = authStorage.getUser()
        if (user == null || user.role.uppercase() != "ADMIN") {
            // Not authorized
            finish()
            return
        }
        
        initViews()
        setupClickListeners()
    }
    
    private fun initViews() {
        fullNameInput = findViewById(R.id.fullNameInput)
        emailInput = findViewById(R.id.emailInput)
        passwordInput = findViewById(R.id.passwordInput)
        createButton = findViewById(R.id.createButton)
        loadingSpinner = findViewById(R.id.loadingSpinner)
        createButtonContent = findViewById(R.id.createButtonContent)
        errorCard = findViewById(R.id.errorCard)
        errorText = findViewById(R.id.errorText)
        successCard = findViewById(R.id.successCard)
        successText = findViewById(R.id.successText)
        backButton = findViewById(R.id.backButton)
    }
    
    private fun setupClickListeners() {
        backButton.setOnClickListener {
            finish()
        }
        
        createButton.setOnClickListener {
            createFaculty()
        }
    }
    
    private fun createFaculty() {
        val fullName = fullNameInput.text.toString().trim()
        val email = emailInput.text.toString().trim()
        val password = passwordInput.text.toString()
        
        // Validation
        if (fullName.length < 2) {
            showError("Full name must be at least 2 characters")
            return
        }
        
        if (email.isEmpty() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            showError("Please enter a valid email address")
            return
        }
        
        if (password.length < 8) {
            showError("Password must be at least 8 characters")
            return
        }
        
        hideMessages()
        
        // Set the JWT token for the request
        RetrofitClient.setAuthToken(authStorage.getToken())
        
        setLoading(true)
        
        val request = CreateFacultyRequest(
            fullName = fullName,
            email = email,
            department = "", // Department is not in the layout, will be set by backend
            password = password
        )
        
        RetrofitClient.authApi.createFaculty(request).enqueue(object : Callback<AuthResponse> {
            override fun onResponse(call: Call<AuthResponse>, response: Response<AuthResponse>) {
                setLoading(false)
                
                if (response.isSuccessful && response.body() != null) {
                    successCard.visibility = View.VISIBLE
                    // Clear inputs
                    fullNameInput.text?.clear()
                    emailInput.text?.clear()
                    passwordInput.text?.clear()
                } else {
                    val errorMsg = when (response.code()) {
                        409 -> "An account with this email already exists"
                        401 -> "Unauthorized - Admin access required"
                        else -> "Failed to create faculty account"
                    }
                    showError(errorMsg)
                }
            }
            
            override fun onFailure(call: Call<AuthResponse>, t: Throwable) {
                setLoading(false)
                showError("Network error. Please check your connection.")
            }
        })
    }
    
    private fun setLoading(loading: Boolean) {
        createButton.isEnabled = !loading
        fullNameInput.isEnabled = !loading
        emailInput.isEnabled = !loading
        passwordInput.isEnabled = !loading
        
        if (loading) {
            loadingSpinner.visibility = View.VISIBLE
            createButtonContent.visibility = View.GONE
        } else {
            loadingSpinner.visibility = View.GONE
            createButtonContent.visibility = View.VISIBLE
        }
    }
    
    private fun showError(message: String) {
        errorText.text = message
        errorCard.visibility = View.VISIBLE
        successCard.visibility = View.GONE
    }
    
    private fun hideMessages() {
        errorCard.visibility = View.GONE
        successCard.visibility = View.GONE
    }
}