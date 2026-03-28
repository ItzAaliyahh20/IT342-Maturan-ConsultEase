package com.example.consultease.network

import com.example.consultease.auth.model.AuthResponse
import com.example.consultease.auth.model.RegisterRequest
import com.example.consultease.auth.model.LoginRequest
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApiService {

    @POST("/auth/login")
    fun login(@Body request: LoginRequest): Call<AuthResponse>

    @POST("/auth/register")
    fun register(@Body request: RegisterRequest): Call<AuthResponse>
}
