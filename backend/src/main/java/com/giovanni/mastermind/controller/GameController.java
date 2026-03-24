package com.giovanni.mastermind.controller;

import com.giovanni.mastermind.dto.GuessRequest;
import com.giovanni.mastermind.dto.GuessResponse;
import com.giovanni.mastermind.dto.StartGameRequest;
import com.giovanni.mastermind.dto.StartGameResponse;
import com.giovanni.mastermind.dto.GameListResponse;
import com.giovanni.mastermind.dto.GameDetailResponse;
import com.giovanni.mastermind.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    @GetMapping
    public ResponseEntity<List<GameListResponse>> getPlayerGames(Authentication authentication) {
        return ResponseEntity.ok(gameService.getPlayerGames(authentication));
    }

    @GetMapping("/{gameId}")
    public ResponseEntity<GameDetailResponse> getGameDetail(
            @PathVariable Long gameId,
            Authentication authentication) {
        return ResponseEntity.ok(gameService.getGameDetail(gameId, authentication));
    }
}