package org.example.pfe.dto;


import lombok.Data;

@Data
public class RegisterRequest {
    private String matricule;
    private String email;
    private String password;

    private String direction;
    private String fonction;
    private String role; // exemple : "ADMIN", "ANALYSTE_OP", "ANALYSTE_BUSINESS"

    public String getMatricule() {
        return matricule;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }



    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getFonction() {
        return fonction;
    }

    public void setFonction(String fonction) {
        this.fonction = fonction;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}

