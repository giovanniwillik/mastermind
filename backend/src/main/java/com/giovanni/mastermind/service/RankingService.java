package com.giovanni.mastermind.service;

import com.giovanni.mastermind.dto.RankingResponse;
import com.giovanni.mastermind.model.User;
import com.giovanni.mastermind.model.Game;
import com.giovanni.mastermind.model.GameStatus;
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
                    // Primeiro: ordenar por bestScore (decrescente)
                    if (!a.getBestScore().equals(b.getBestScore())) {
                        return b.getBestScore().compareTo(a.getBestScore());
                    }
                    // Tiebreaker: ordenar por totalGames (decrescente)
                    return b.getTotalGames().compareTo(a.getTotalGames());
                })
                .limit(limit)
                .collect(Collectors.toList());
    }

    private RankingResponse mapToRankingResponse(User user) {
        // Filtrar apenas as partidas finalizadas
        List<Game> finishedGames = user.getGames().stream()
                .filter(game -> game.getStatus() != GameStatus.IN_PROGRESS)
                .collect(Collectors.toList());

        int totalGames = finishedGames.size();

        // Calcular melhor pontuação a partir das partidas vencidas
        int bestScore = finishedGames.stream()
                .filter(game -> game.getStatus() == GameStatus.WON)
                .mapToInt(Game::getFinalScore)
                .max()
                .orElse(0);

        // Calcular duração média apenas das partidas finalizadas
        double avgDuration = totalGames > 0
                ? finishedGames.stream()
                        .mapToInt(Game::getDurationSeconds)
                        .average()
                        .orElse(0) : 0;

        return RankingResponse.builder()
                .username(user.getUsername())
                .bestScore(bestScore)
                .totalGames(totalGames)
                .averageDuration(Math.round(avgDuration * 100.0) / 100.0) // Arredondar para 2 casas decimais
                .build();
    }
}
