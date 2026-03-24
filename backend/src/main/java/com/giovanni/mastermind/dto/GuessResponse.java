package com.giovanni.mastermind.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuessResponse {
    private boolean gameOver;
    private String status; // "IN_PROGRESS", "WON", "LOST"
    private int exactMatches;
    private int partialMatches;
    private int currentAttempt;
    private int maxAttempts;
    private String message;
}