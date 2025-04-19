package org.example.pfe.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/hello")
    public String helloAdmin() {
        return "Bonjour ADMIN !";
    }
}