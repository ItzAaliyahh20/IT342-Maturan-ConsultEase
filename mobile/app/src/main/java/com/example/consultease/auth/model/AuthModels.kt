package com.example.consultease.auth.model

import com.google.gson.annotations.SerializedName

data class RegisterRequest(
    val fullName: String,
    val email: String,
    val password: String
)

data class UserResponse(
    val id: Long,
    val email: String,
    val fullName: String,
    val role: String,
    val provider: String,
    val createdAt: String
)

data class AuthResponse(
    val accessToken: String,
    val tokenType: String,
    val expiresIn: Long,
    val user: UserResponse
)

data class ApiErrorResponse(
    val timestamp: String? = null,
    val status: Int? = null,
    val error: String? = null,
    val message: String? = null,
    @SerializedName("errors")
    val validationErrors: Map<String, String>? = null
)
