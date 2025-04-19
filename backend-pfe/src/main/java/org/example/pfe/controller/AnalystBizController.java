package org.example.pfe.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analyst-biz")
public class AnalystBizController {

    @GetMapping("/hello")
    public String helloBiz() {
        return "Bonjour Analyste Business !";
    }
}