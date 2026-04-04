package com.sudoku.entity;

import com.sudoku.enums.GameStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "games")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String gameId;

    @Column(name = "user_id")
    private Long userId = 0L;

    @Column(nullable = false)
    private String difficulty;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String puzzleJson;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String currentBoardJson;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String solutionJson;

    @Column(nullable = false)
    private Integer mistakes = 0;

    @Column(nullable = false)
    private Long timeElapsed = 0L;

    @Column(nullable = false)
    private Long startTime = System.currentTimeMillis();

    @Column(columnDefinition = "TEXT")
    private String moveHistoryJson = "[]";

    @Column(columnDefinition = "TEXT")
    private String notesJson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameStatus status = GameStatus.IN_PROGRESS;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime completedAt;
}