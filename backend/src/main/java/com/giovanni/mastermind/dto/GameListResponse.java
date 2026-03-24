package com.giovanni.mastermind.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameListResponse {
    private Long id;
    private UUID gameCode;
    private String status; // WON, LOST, IN_PROGRESS
    private Integer finalScore;
    private Integer durationSeconds;
    private Integer currentAttempt;
    private Integer maxAttempts;
    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;
}
