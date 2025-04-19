package org.example.pfe.service;

import lombok.RequiredArgsConstructor;
import org.example.pfe.dto.FluxStatusDTO;
import org.example.pfe.repository.ChargementRepository;
import org.springframework.stereotype.Service;

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
}