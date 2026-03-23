package com.giovanni.mastermind.service;

import com.giovanni.mastermind.dto.RankingResponse;
import com.giovanni.mastermind.model.User;
import com.giovanni.mastermind.model.Game;
import com.giovanni.mastermind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RankingService {

    private final UserRepository userRepository;

    public List<RankingResponse> getRanking(int limit) {
        return userRepository.findAll().stream()
                .map(this::mapToRankingResponse)
                .sorted((a, b) -> {
                    if (!a.getBestScore().equals(b.getBestScore())) {
                        return b.getBestScore().compareTo(a.getBestScore());
                    }
                    return b.getTotalGames().compareTo(a.getTotalGames());
                })
                .limit(limit)
                .collect(Collectors.toList());
    }

    private RankingResponse mapToRankingResponse(User user) {
        // Lógica simplificada - em produção, use queries otimizadas
        int totalGames = user.getGames().size();
        double avgDuration = totalGames > 0 ?
                user.getGames().stream().mapToInt(Game::getDurationSeconds).average().orElse(0) : 0;

        return RankingResponse.builder()
                .username(user.getUsername())
                .bestScore(user.getBestScore())
                .totalGames(totalGames)
                .averageDuration((double) Math.round(avgDuration))
                .build();
    }
}