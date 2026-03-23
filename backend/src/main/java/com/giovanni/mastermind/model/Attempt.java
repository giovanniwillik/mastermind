package com.giovanni.mastermind.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Column(nullable = false)
    private Integer attemptNumber;

    @Column(nullable = false, length = 4)
    private String guess;

    @Column(nullable = false)
    private Integer exactMatches;

    @Column(nullable = false)
    private Integer partialMatches;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}