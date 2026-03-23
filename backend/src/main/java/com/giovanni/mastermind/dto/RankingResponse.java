package com.giovanni.mastermind.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RankingResponse {
    private String username;
    private Integer bestScore;
    private Integer totalGames;
    private Double averageDuration;
}