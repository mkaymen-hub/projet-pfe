package org.example.pfe.repository;

import org.example.pfe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);  // Vérifie si un utilisateur avec l'email existe déjà
}