package com.example.consultease.auth

import android.content.Intent
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Patterns
import android.view.View
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.widget.doAfterTextChanged
import com.example.consultease.R
import com.example.consultease.auth.model.ApiErrorResponse
import com.example.consultease.auth.model.AuthResponse
import com.example.consultease.auth.model.RegisterRequest
import com.example.consultease.auth.storage.AuthStorage
import com.example.consultease.dashboard.StudentDashboardActivity
import com.example.consultease.network.RetrofitClient
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView
import com.google.android.material.textfield.TextInputLayout
import com.google.gson.Gson
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class StudentRegisterActivity : AppCompatActivity() {

    private lateinit var fullNameInput: EditText
    private lateinit var emailInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var passwordLayout: TextInputLayout
    private lateinit var passwordHintText: TextView
    private lateinit var registerButton: FrameLayout
    private lateinit var registerLoadingSpinner: ProgressBar
    private lateinit var registerButtonContent: LinearLayout
    private lateinit var googleSignInButton: View
    private lateinit var loginLinkText: TextView

    private lateinit var errorCard: MaterialCardView
    private lateinit var errorText: TextView
    private lateinit var successCard: MaterialCardView

    private lateinit var authStorage: AuthStorage

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_student_register)

        authStorage = AuthStorage(this)

        bindViews()
        setupButtonBackground()
        bindListeners()
    }

    private fun bindViews() {
        fullNameInput = findViewById(R.id.fullNameInput)
        emailInput = findViewById(R.id.emailInput)
        passwordInput = findViewById(R.id.passwordInput)
        passwordLayout = findViewById(R.id.passwordLayout)
        passwordHintText = findViewById(R.id.passwordHintText)
        registerButton = findViewById(R.id.registerButton)
        registerLoadingSpinner = findViewById(R.id.registerLoadingSpinner)
        registerButtonContent = findViewById(R.id.registerButtonContent)
        googleSignInButton = findViewById(R.id.googleSignInButton)
        loginLinkText = findViewById(R.id.loginLinkText)

        errorCard = findViewById(R.id.errorCard)
        errorText = findViewById(R.id.errorText)
        successCard = findViewById(R.id.successCard)
    }

    private fun setupButtonBackground() {
        // Button uses solid color from XML (android:background="@color/button_accent")
        // No additional setup needed - using solid #F1980A color
    }

    private fun bindListeners() {
        passwordInput.doAfterTextChanged { text ->
            val value = text?.toString().orEmpty()
            val validationError = validatePassword(value)
            if (validationError == null || value.isEmpty()) {
                passwordLayout.error = null
                passwordHintText.setTextColor(getColor(R.color.text_muted))
                passwordHintText.text =
                    "Min 8 chars, with uppercase, lowercase, number, special char (@$!%*?&_+-=)"
            } else {
                passwordLayout.error = validationError
                passwordHintText.setTextColor(getColor(R.color.error_text))
                passwordHintText.text = validationError
            }
        }

        registerButton.setOnClickListener {
            submitRegistration()
        }

        googleSignInButton.setOnClickListener {
            Toast.makeText(this, "Google Sign-In coming soon.", Toast.LENGTH_SHORT).show()
        }

        loginLinkText.setOnClickListener {
            Toast.makeText(this, "Student/Faculty login screen is next.", Toast.LENGTH_SHORT).show()
        }
    }

    private fun submitRegistration() {
        hideMessages()

        val fullName = fullNameInput.text?.toString()?.trim().orEmpty()
        val email = emailInput.text?.toString()?.trim().orEmpty()
        val password = passwordInput.text?.toString().orEmpty()

        if (fullName.length < 2) {
            showError("Full name must be at least 2 characters")
            return
        }

        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            showError("Invalid email format")
            return
        }

        val passwordError = validatePassword(password)
        if (passwordError != null) {
            showError(passwordError)
            return
        }

        setLoading(true)

        val request = RegisterRequest(
            fullName = fullName,
            email = email,
            password = password
        )

        RetrofitClient.authApi.register(request).enqueue(object : Callback<AuthResponse> {
            override fun onResponse(call: Call<AuthResponse>, response: Response<AuthResponse>) {
                setLoading(false)

                if (response.isSuccessful && response.body() != null) {
                    val authResponse = response.body()!!
                    authStorage.setAuth(authResponse)
                    successCard.visibility = View.VISIBLE

                    // Mirrors web behavior: register then proceed to authenticated area.
                    Handler(Looper.getMainLooper()).postDelayed({
                        val intent = Intent(this@StudentRegisterActivity, StudentDashboardActivity::class.java)
                        startActivity(intent)
                        finish()
                    }, 900)
                } else {
                    val apiError = parseApiError(response)
                    when {
                        response.code() == 409 -> showError("An account with this email already exists.")
                        !apiError.message.isNullOrBlank() -> showError(apiError.message)
                        !apiError.validationErrors.isNullOrEmpty() -> {
                            val flattened = apiError.validationErrors.values.joinToString(", ")
                            showError(flattened)
                        }
                        else -> showError("Registration failed. Please try again.")
                    }
                }
            }

            override fun onFailure(call: Call<AuthResponse>, t: Throwable) {
                setLoading(false)
                showError("Unable to connect to server. Please check your network and API URL.")
            }
        })
    }

    private fun parseApiError(response: Response<AuthResponse>): ApiErrorResponse {
        return try {
            val errorBody = response.errorBody()?.string().orEmpty()
            if (errorBody.isBlank()) {
                ApiErrorResponse()
            } else {
                Gson().fromJson(errorBody, ApiErrorResponse::class.java) ?: ApiErrorResponse()
            }
        } catch (_: Exception) {
            ApiErrorResponse()
        }
    }

    private fun validatePassword(password: String): String? {
        if (password.length < 8) {
            return "Password must be at least 8 characters"
        }
        if (!Regex(".*[a-z].*").matches(password)) {
            return "Password must contain at least one lowercase letter"
        }
        if (!Regex(".*[A-Z].*").matches(password)) {
            return "Password must contain at least one uppercase letter"
        }
        if (!Regex(".*\\d.*").matches(password)) {
            return "Password must contain at least one number"
        }
        if (!Regex(".*[@$!%*?&_\\-+=].*").matches(password)) {
            return "Password must contain at least one special character (@$!%*?&_+-=)"
        }
        return null
    }

    private fun setLoading(loading: Boolean) {
        registerButton.isEnabled = !loading
        fullNameInput.isEnabled = !loading
        emailInput.isEnabled = !loading
        passwordInput.isEnabled = !loading

        if (loading) {
            registerLoadingSpinner.visibility = View.VISIBLE
            registerButtonContent.visibility = View.GONE
        } else {
            registerLoadingSpinner.visibility = View.GONE
            registerButtonContent.visibility = View.VISIBLE
        }
    }

    private fun hideMessages() {
        errorCard.visibility = View.GONE
        successCard.visibility = View.GONE
    }

    private fun showError(message: String) {
        errorText.text = message
        errorCard.visibility = View.VISIBLE
        successCard.visibility = View.GONE
    }
}
