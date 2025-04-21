package org.example.pfe.dto;


import java.time.LocalDateTime;
import java.util.List;

public class FluxStatusDTO {
    private String nomFlux;
    private String status;
    private LocalDateTime dernierChargement;
    private List<LocalDateTime> tendances; // 🔥 Ajoute cette liste

    public FluxStatusDTO() {}

    public FluxStatusDTO(String nomFlux, String status, LocalDateTime dernierChargement) {
        this.nomFlux = nomFlux;
        this.status = status;
        this.dernierChargement = dernierChargement;
    }

    // 🔧 👉 Ajoute ce constructeur à 4 paramètres :
    public FluxStatusDTO(String nomFlux, String status, LocalDateTime dernierChargement, List<LocalDateTime> tendances) {
        this.nomFlux = nomFlux;
        this.status = status;
        this.dernierChargement = dernierChargement;
        this.tendances = tendances;
    }

    // Getters et Setters

    public String getNomFlux() {
        return nomFlux;
    }

    public void setNomFlux(String nomFlux) {
        this.nomFlux = nomFlux;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getDernierChargement() {
        return dernierChargement;
    }

    public void setDernierChargement(LocalDateTime dernierChargement) {
        this.dernierChargement = dernierChargement;
    }

    public List<LocalDateTime> getTendances() {
        return tendances;
    }

    public void setTendances(List<LocalDateTime> tendances) {
        this.tendances = tendances;
    }
}