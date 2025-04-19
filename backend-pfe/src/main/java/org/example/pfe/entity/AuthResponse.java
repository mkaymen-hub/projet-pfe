package org.example.pfe.entity;
public class AuthResponse {
    private String token;
    private String role;

    // Constructeur avec arguments
    public AuthResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }

    // Getters et Setters
    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setRole(String role) {
        this.role = role;
    }
}