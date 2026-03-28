package com.example.consultease.network

import com.example.consultease.auth.model.AuthResponse
import com.example.consultease.auth.model.RegisterRequest
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApiService {

    @POST("/auth/register")
    fun register(@Body request: RegisterRequest): Call<AuthResponse>
}
