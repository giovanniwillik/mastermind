package com.giovanni.mastermind.service;

import com.giovanni.mastermind.dto.GuessResponse;
import com.giovanni.mastermind.dto.StartGameResponse;
import com.giovanni.mastermind.dto.GameListResponse;
import com.giovanni.mastermind.dto.GameDetailResponse;
import com.giovanni.mastermind.model.*;
import com.giovanni.mastermind.repository.AttemptRepository;
import com.giovanni.mastermind.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
    private final AttemptRepository attemptRepository;
    private final Random random = new Random();
    private final UserService userService;

    public StartGameResponse startGame(Authentication authentication) {
        User user = getCurrentUser(authentication);

        String secretCode = generateSecretCode();
        UUID gameCode = UUID.randomUUID();

        Game game = Game.builder()
                .gameCode(gameCode)
                .user(user)
                .expectedCode(secretCode)
                .status(GameStatus.IN_PROGRESS)
                .finalScore(0)
                .durationSeconds(0)
                .maxAttempts(10)
                .currentAttempt(0)
                .startedAt(LocalDateTime.now())
                .build();

        gameRepository.save(game);

        return new StartGameResponse(gameCode, "Partida iniciada!");
    }

    public GuessResponse submitGuess(UUID gameCode, String guess, Authentication authentication) {
        Game game = gameRepository.findByGameCode(gameCode)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada"));

        // Verificar se é o dono da partida
        if (!game.getUser().getUsername().equals(authentication.getName())) {
            throw new RuntimeException("Não autorizado");
        }

        // Verificar se ainda pode jogar
        if (game.getStatus() != GameStatus.IN_PROGRESS || game.getAttempts().size() >= game.getMaxAttempts()) {
            throw new RuntimeException("Partida encerrada");
        }

        // Calcular feedback
        int[] feedback = calculateFeedback(game.getExpectedCode(), guess);
        int exact = feedback[0];
        int partial = feedback[1];

        // Salvar tentativa
        Attempt attempt = Attempt.builder()
                .game(game)
                .attemptNumber(game.getCurrentAttempt() + 1)
                .guess(guess)
                .exactMatches(exact)
                .partialMatches(partial)
                .createdAt(LocalDateTime.now())
                .build();

        attemptRepository.save(attempt);
        game.getAttempts().add(attempt);
        game.setCurrentAttempt(game.getCurrentAttempt() + 1);

        // Verificar vitória ou derrota
        boolean gameOver = false;
        String status = game.getStatus().name();
        if (exact == 4) {
            game.setStatus(GameStatus.WON);
            gameOver = true;
            status = "WON";
            // Calcular pontuação e duração ao vencer
            finishGame(game, true);
        } else if (game.getCurrentAttempt() >= game.getMaxAttempts()) {
            game.setStatus(GameStatus.LOST);
            gameOver = true;
            status = "LOST";
            // Calcular duração ao perder
            finishGame(game, false);
        }

        gameRepository.save(game);

        return GuessResponse.builder()
                .gameOver(gameOver)
                .status(status)
                .exactMatches(exact)
                .partialMatches(partial)
                .currentAttempt(game.getCurrentAttempt())
                .maxAttempts(game.getMaxAttempts())
                .message(gameOver ? "Partida finalizada!" : "Continue tentando!")
                .build();
    }

    private String generateSecretCode() {
        String colors = "ABCDEF";
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 4; i++) {
            code.append(colors.charAt(random.nextInt(colors.length())));
        }
        return code.toString();
    }

    private int[] calculateFeedback(String secret, String guess) {
        int exact = 0;
        int partial = 0;
        boolean[] secretUsed = new boolean[4];
        boolean[] guessUsed = new boolean[4];

        // Acertos exatos
        for (int i = 0; i < 4; i++) {
            if (secret.charAt(i) == guess.charAt(i)) {
                exact++;
                secretUsed[i] = true;
                guessUsed[i] = true;
            }
        }

        // Cores corretas, posição errada
        for (int i = 0; i < 4; i++) {
            if (!guessUsed[i]) {
                for (int j = 0; j < 4; j++) {
                    if (!secretUsed[j] && guess.charAt(i) == secret.charAt(j)) {
                        partial++;
                        secretUsed[j] = true;
                        break;
                    }
                }
            }
        }

        return new int[]{exact, partial};
    }

    private void finishGame(Game game, boolean won) {
        LocalDateTime finishedAt = LocalDateTime.now();
        game.setFinishedAt(finishedAt);
        
        // Calcular duração em segundos
        long durationSeconds = java.time.temporal.ChronoUnit.SECONDS.between(game.getStartedAt(), finishedAt);
        game.setDurationSeconds((int) durationSeconds);
        
        // Calcular pontuação final: baseada em tentativas restantes se vitória, 0 se derrota
        if (won) {
            int attemptsRemaining = game.getMaxAttempts() - game.getCurrentAttempt();
            int finalScore = (attemptsRemaining * 100) + (1000 - (int)durationSeconds); // Bônus por tentativas restantes e penalidade por tempo
            finalScore = Math.max(finalScore, 100); // Mínimo de 100 pontos para vitória
            game.setFinalScore(finalScore);
            
            // Atualizar bestScore do usuário se necessário
            User user = game.getUser();
            if (finalScore > user.getBestScore()) {
                user.setBestScore(finalScore);
                userService.updateUser(user);
            }
        } else {
            game.setFinalScore(0); // Derrota = 0 pontos
        }
    }

    public List<GameListResponse> getPlayerGames(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return gameRepository.findByUserOrderByStartedAtDesc(user).stream()
                .map(this::mapToGameListResponse)
                .collect(Collectors.toList());
    }

    public GameDetailResponse getGameDetail(Long gameId, Authentication authentication) {
        User user = getCurrentUser(authentication);
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada"));
        
        // Verificar se o usuário é o dono da partida
        if (!game.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Não autorizado");
        }
        
        return mapToGameDetailResponse(game);
    }

    private GameListResponse mapToGameListResponse(Game game) {
        return GameListResponse.builder()
                .id(game.getId())
                .gameCode(game.getGameCode())
                .status(game.getStatus().name())
                .finalScore(game.getFinalScore())
                .durationSeconds(game.getDurationSeconds())
                .currentAttempt(game.getCurrentAttempt())
                .maxAttempts(game.getMaxAttempts())
                .startedAt(game.getStartedAt())
                .finishedAt(game.getFinishedAt())
                .build();
    }

    private GameDetailResponse mapToGameDetailResponse(Game game) {
        List<GameDetailResponse.AttemptResponse> attempts = game.getAttempts().stream()
                .map(attempt -> GameDetailResponse.AttemptResponse.builder()
                        .attemptNumber(attempt.getAttemptNumber())
                        .guess(attempt.getGuess())
                        .exactMatches(attempt.getExactMatches())
                        .partialMatches(attempt.getPartialMatches())
                        .createdAt(attempt.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return GameDetailResponse.builder()
                .id(game.getId())
                .gameCode(game.getGameCode())
                .status(game.getStatus().name())
                .expectedCode(game.getExpectedCode())
                .finalScore(game.getFinalScore())
                .durationSeconds(game.getDurationSeconds())
                .currentAttempt(game.getCurrentAttempt())
                .maxAttempts(game.getMaxAttempts())
                .startedAt(game.getStartedAt())
                .finishedAt(game.getFinishedAt())
                .attempts(attempts)
                .build();
    }

    // Placeholder - substituir por injeção real de UserRepository
    private User getCurrentUser(Authentication authentication) {
        return userService.getCurrentUser(authentication);
    }
}