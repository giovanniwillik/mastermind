package com.giovanni.mastermind.controller;

import com.giovanni.mastermind.dto.RankingResponse;
import com.giovanni.mastermind.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ranking")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    @GetMapping
    public ResponseEntity<List<RankingResponse>> getRanking(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(rankingService.getRanking(limit));
    }
}