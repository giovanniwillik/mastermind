package com.giovanni.mastermind.controller;

import com.giovanni.mastermind.dto.GuessRequest;
import com.giovanni.mastermind.dto.GuessResponse;
import com.giovanni.mastermind.dto.StartGameRequest;
import com.giovanni.mastermind.dto.StartGameResponse;
import com.giovanni.mastermind.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/games")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @PostMapping("/start")
    public ResponseEntity<StartGameResponse> startGame(
            @RequestBody(required = false) StartGameRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(gameService.startGame(authentication));
    }

    @PostMapping("/{gameCode}/guess")
    public ResponseEntity<GuessResponse> submitGuess(
            @PathVariable UUID gameCode,
            @RequestBody GuessRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(gameService.submitGuess(gameCode, request.getGuess(), authentication));
    }
}