package org.example.pfe.controller;

import lombok.RequiredArgsConstructor;
import org.example.pfe.dto.ChargementCountDTO;
import org.example.pfe.dto.FluxStatusDTO;
import org.example.pfe.service.CsvToOracle;
import org.example.pfe.service.FluxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
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
    @GetMapping("/trends")

    public ResponseEntity<List<FluxStatusDTO>> getFluxTrends(
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return ResponseEntity.ok(fluxService.getFluxStatusWithTrends(startDate, endDate));


    }
    @GetMapping("/count")
    public ResponseEntity<List<ChargementCountDTO>> getChargementCounts() {
        List<ChargementCountDTO> counts = fluxService.getChargementCounts();
        return ResponseEntity.ok(counts);
    }
    }
