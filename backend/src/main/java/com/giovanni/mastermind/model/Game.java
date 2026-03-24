package com.giovanni.mastermind.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.giovanni.mastermind.model.GameStatus;

@Entity
@Table(name = "games")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private UUID gameCode;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 4)
    private String expectedCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "VARCHAR(20)")
    private GameStatus status;

    @Column(nullable = false)
    private Integer finalScore;

    @Column(nullable = false)
    private Integer durationSeconds;

    @Column(nullable = false)
    private Integer maxAttempts;

    @Column(nullable = false)
    private Integer currentAttempt;

    @Column(nullable = false)
    private LocalDateTime startedAt;

    private LocalDateTime finishedAt;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attempt> attempts = new ArrayList<>();
}