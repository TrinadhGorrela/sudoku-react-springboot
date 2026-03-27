package com.sudoku.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leaderboard", indexes = {
        @Index(name = "idx_difficulty_time", columnList = "difficulty,completionTime"),
        @Index(name = "idx_user_id", columnList = "userId")
})
public class LeaderboardEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String gameId; // ⭐ CHANGED FROM Long to String (matches your GameState)

    @Column(nullable = false)
    private String difficulty;

    @Column(nullable = false)
    private Long completionTime;

    @Column(nullable = false)
    private Integer mistakes;

    @Column(nullable = false)
    private Integer starsEarned;

    @Column(nullable = false)
    private String displayName;

    @Column(nullable = false)
    private Boolean isAnonymous;

    @Column(nullable = false)
    private LocalDateTime completedAt;

    // Constructors
    public LeaderboardEntry() {
        this.completedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getGameId() { // ⭐ FIXED: String instead of Long
        return gameId;
    }

    public void setGameId(String gameId) { // ⭐ FIXED: String parameter
        this.gameId = gameId;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Long getCompletionTime() {
        return completionTime;
    }

    public void setCompletionTime(Long completionTime) {
        this.completionTime = completionTime;
    }

    public Integer getMistakes() {
        return mistakes;
    }

    public void setMistakes(Integer mistakes) {
        this.mistakes = mistakes;
    }

    public Integer getStarsEarned() {
        return starsEarned;
    }

    public void setStarsEarned(Integer starsEarned) {
        this.starsEarned = starsEarned;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Boolean getIsAnonymous() {
        return isAnonymous;
    }

    public void setIsAnonymous(Boolean isAnonymous) {
        this.isAnonymous = isAnonymous;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}