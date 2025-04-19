package org.example.pfe.dto;


import java.time.LocalDateTime;

public class FluxStatusDTO {
    private String nomFlux;
    private String status;
    private LocalDateTime dernierChargement; // Ajout de l'attribut pour la date de chargement

    // Constructeur par défaut (utile pour Jackson)
    public FluxStatusDTO() {}

    // Constructeur avec paramètres (nomFlux, status, dernierChargement)
    public FluxStatusDTO(String nomFlux, String status, LocalDateTime dernierChargement) {
        this.nomFlux = nomFlux;
        this.status = status;
        this.dernierChargement = dernierChargement;
    }

    // Getter et Setter pour nomFlux
    public String getNomFlux() {
        return nomFlux;
    }

    public void setNomFlux(String nomFlux) {
        this.nomFlux = nomFlux;
    }

    // Getter et Setter pour status
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Getter et Setter pour dernierChargement
    public LocalDateTime getDernierChargement() {
        return dernierChargement;
    }

    public void setDernierChargement(LocalDateTime dernierChargement) {
        this.dernierChargement = dernierChargement;
    }
}