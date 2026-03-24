package com.giovanni.mastermind.repository;

import com.giovanni.mastermind.model.Game;
import com.giovanni.mastermind.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GameRepository extends JpaRepository<Game, Long> {

    Optional<Game> findByGameCode(UUID gameCode);

    List<Game> findByUser(User user);

    List<Game> findByUserOrderByStartedAtDesc(User user);
}
