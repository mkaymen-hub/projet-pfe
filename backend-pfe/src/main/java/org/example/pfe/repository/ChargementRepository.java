package org.example.pfe.repository;

import org.example.pfe.dto.FluxStatusDTO;
import org.example.pfe.entity.Chargement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
@Repository
public interface ChargementRepository extends JpaRepository<Chargement, Long> {

    // Récupère les noms de flux distincts
    @Query("SELECT DISTINCT c.nomFlux FROM Chargement c")
    List<String> findDistinctFluxNames();

    // Récupère la dernière date de chargement pour un flux donné
    @Query("SELECT MAX(c.dateChargement) FROM Chargement c WHERE c.nomFlux = :nomFlux")
    LocalDateTime findLastChargementDateByFlux(String nomFlux);
}