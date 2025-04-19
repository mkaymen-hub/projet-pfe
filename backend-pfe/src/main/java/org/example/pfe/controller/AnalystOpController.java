package org.example.pfe.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analyst-op")
public class AnalystOpController {

    @GetMapping("/hello")
    public String helloOp() {
        return "Bonjour Analyste Opérationnel !";
    }
}