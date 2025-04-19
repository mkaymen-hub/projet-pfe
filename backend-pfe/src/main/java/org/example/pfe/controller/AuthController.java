package org.example.pfe.controller;


import org.example.pfe.entity.AuthResponse;
import org.example.pfe.entity.User;
import org.example.pfe.entity.Role;
import org.example.pfe.service.JwtService;
import org.example.pfe.dto.LoginRequest;
import org.example.pfe.dto.RegisterRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")


public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final org.example.pfe.repository.UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          PasswordEncoder passwordEncoder,
                          org.example.pfe.repository.UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }
    // Méthode d'enregistrement des utilisateurs
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        // Vérification si un utilisateur avec le même email existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }

        // Création de l'utilisateur
        User user = new User();
        user.setMatricule(request.getMatricule());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        System.out.println("Login attempt: " + request.getEmail() + ", pass=" + request.getPassword());
        user.setDirection(request.getDirection());
        user.setFonction(request.getFonction());
        user.setRole(Role.valueOf(request.getRole())); // ex: ADMIN

        userRepository.save(user);

        // Génération du JWT après l'enregistrement
        String jwtToken = jwtService.generateToken(user.getEmail());
        return ResponseEntity.ok(jwtToken);
    }
    /*@PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Génération du JWT après authentification réussie
        String jwtToken = jwtService.generateToken(user.getEmail());
        return ResponseEntity.ok(jwtToken);
    }*/
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Génération du JWT après authentification réussie
        String jwtToken = jwtService.generateToken(user.getEmail());

        // Créer une réponse qui contient à la fois le token et le rôle
        AuthResponse response = new AuthResponse(jwtToken, user.getRole().name());

        return ResponseEntity.ok(response);
    }

}