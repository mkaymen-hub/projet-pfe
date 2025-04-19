package org.example.pfe.controller;

import lombok.RequiredArgsConstructor;
import org.example.pfe.dto.FluxStatusDTO;
import org.example.pfe.service.FluxService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/api/flux")
public class FluxController {

    private final FluxService fluxService;

    public FluxController(FluxService fluxService) {
        this.fluxService = fluxService;
    }

    @GetMapping("/status")
    public ResponseEntity<List<FluxStatusDTO>> getFluxStatus() {
        return ResponseEntity.ok(fluxService.getAllFluxStatus());
    }
}