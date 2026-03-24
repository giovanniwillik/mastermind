package com.giovanni.mastermind.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameDetailResponse {

    private UUID gameCode;
    private String status; // WON, LOST, IN_PROGRESS
    private String expectedCode;
    private Integer finalScore;
    private Integer durationSeconds;
    private Integer currentAttempt;
    private Integer maxAttempts;
    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;
    private List<AttemptResponse> attempts;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttemptResponse {

        private Integer attemptNumber;
        private String guess;
        private Integer exactMatches;
        private Integer partialMatches;
        private LocalDateTime createdAt;
    }
}
