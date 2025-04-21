package org.example.pfe.service;

import lombok.RequiredArgsConstructor;
import org.example.pfe.dto.ChargementCountDTO;
import org.example.pfe.dto.FluxStatusDTO;
import org.example.pfe.entity.Chargement;
import org.example.pfe.repository.ChargementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class FluxService {

    private final ChargementRepository chargementRepository;

    public FluxService(ChargementRepository chargementRepository) {
        this.chargementRepository = chargementRepository;
    }

    public List<FluxStatusDTO> getAllFluxStatus() {
        List<String> fluxNames = chargementRepository.findDistinctFluxNames();

        return fluxNames.stream().map(nomFlux -> {
            // Récupérer la dernière date de chargement sous forme de LocalDateTime
            LocalDateTime dernierChargement = chargementRepository.findLastChargementDateByFlux(nomFlux);

            // Déterminer le status
            String status = (dernierChargement != null && dernierChargement.isAfter(LocalDateTime.now().minusDays(1)))
                    ? "UP"
                    : "DOWN";

            // Retourner un objet FluxStatusDTO avec LocalDateTime pour la dernière date de chargement
            return new FluxStatusDTO(nomFlux, status, dernierChargement);
        }).collect(Collectors.toList());
    }
    public List<FluxStatusDTO> getFluxStatusWithTrends(LocalDate startDate, LocalDate endDate) {
        List<String> fluxNames = chargementRepository.findDistinctFluxNames();

        return fluxNames.stream().map(nomFlux -> {
            // Récupère la dernière date de chargement
            LocalDateTime dernierChargement = chargementRepository.findLastChargementDateByFlux(nomFlux);

            // Convertir les LocalDate en LocalDateTime
            LocalDateTime startDateTime = startDate.atStartOfDay();
            LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

            // Récupère les tendances avec les LocalDateTime
            List<LocalDateTime> tendances = chargementRepository.findFluxTrendsByFluxAndDateRange(
                    nomFlux, startDateTime, endDateTime);

            // Déterminer le statut
            String status = (dernierChargement != null &&
                    dernierChargement.isAfter(LocalDateTime.now().minusDays(1))) ? "UP" : "DOWN";

            return new FluxStatusDTO(nomFlux, status, dernierChargement, tendances);
        }).collect(Collectors.toList());
    }

    public List<ChargementCountDTO> getChargementCounts() {
        List<Object[]> rawData = chargementRepository.countChargementParFlux();
        return rawData.stream()
                .map(obj -> new ChargementCountDTO((String) obj[0], (Long) obj[1]))
                .collect(Collectors.toList());
    }

}