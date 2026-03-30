package com.sudoku.entity;

import com.sudoku.enums.GameStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String gameId; // Your existing UUID string

    private Long userId; // nullable – guest games have no associated user

    @Column(nullable = false)
    private String difficulty;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String puzzleJson; // Store 2D array as JSON string

    @Column(columnDefinition = "TEXT", nullable = false)
    private String currentBoardJson;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String solutionJson;

    @Column(nullable = false)
    private Integer mistakes = 0;

    @Column(nullable = false)
    private Long timeElapsed = 0L; // milliseconds

    @Column(nullable = false)
    private Long startTime; // System.currentTimeMillis() at game creation

    @Column(columnDefinition = "TEXT")
    private String moveHistoryJson = "[]"; // JSON array of MoveHistory

    @Column(columnDefinition = "TEXT")
    private String notesJson; // JSON 9x9 list-of-lists

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameStatus status = GameStatus.IN_PROGRESS;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

    // Constructors
    public Game() {
        this.createdAt = LocalDateTime.now();
        this.startTime = System.currentTimeMillis();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getPuzzleJson() {
        return puzzleJson;
    }

    public void setPuzzleJson(String puzzleJson) {
        this.puzzleJson = puzzleJson;
    }

    public String getCurrentBoardJson() {
        return currentBoardJson;
    }

    public void setCurrentBoardJson(String currentBoardJson) {
        this.currentBoardJson = currentBoardJson;
    }

    public String getSolutionJson() {
        return solutionJson;
    }

    public void setSolutionJson(String solutionJson) {
        this.solutionJson = solutionJson;
    }

    public Integer getMistakes() {
        return mistakes;
    }

    public void setMistakes(Integer mistakes) {
        this.mistakes = mistakes;
    }

    public Long getTimeElapsed() {
        return timeElapsed;
    }

    public Long getStartTime() {
        return startTime;
    }

    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    public String getMoveHistoryJson() {
        return moveHistoryJson;
    }

    public void setMoveHistoryJson(String moveHistoryJson) {
        this.moveHistoryJson = moveHistoryJson;
    }

    public String getNotesJson() {
        return notesJson;
    }

    public void setNotesJson(String notesJson) {
        this.notesJson = notesJson;
    }

    public void setTimeElapsed(Long timeElapsed) {
        this.timeElapsed = timeElapsed;
    }

    public GameStatus getStatus() {
        return status;
    }

    public void setStatus(GameStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}