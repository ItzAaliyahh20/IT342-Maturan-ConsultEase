package com.example.consultease.auth.storage

import android.content.Context
import com.example.consultease.auth.model.AuthResponse
import com.google.gson.Gson

class AuthStorage(context: Context) {

    private val sharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    private val gson = Gson()

    fun setAuth(authResponse: AuthResponse) {
        sharedPreferences.edit()
            .putString(KEY_ACCESS_TOKEN, authResponse.accessToken)
            .putString(KEY_USER, gson.toJson(authResponse.user))
            .apply()
    }

    fun getToken(): String? = sharedPreferences.getString(KEY_ACCESS_TOKEN, null)

    fun getUser(): UserResponse? {
        val userJson = sharedPreferences.getString(KEY_USER, null) ?: return null
        return try {
            gson.fromJson(userJson, UserResponse::class.java)
        } catch (e: Exception) {
            null
        }
    }

    fun clear() {
        sharedPreferences.edit().clear().apply()
    }

    companion object {
        private const val PREF_NAME = "consultease_auth"
        private const val KEY_ACCESS_TOKEN = "accessToken"
        private const val KEY_USER = "user"
    }
}
