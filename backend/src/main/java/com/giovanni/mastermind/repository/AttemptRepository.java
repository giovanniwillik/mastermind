package com.giovanni.mastermind.repository;

import com.giovanni.mastermind.model.Attempt;
import com.giovanni.mastermind.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttemptRepository extends JpaRepository<Attempt, Long> {

    List<Attempt> findByGameOrderByAttemptNumberAsc(Game game);
}
