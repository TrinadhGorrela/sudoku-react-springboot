package com.sudoku.dto;

import java.time.LocalDateTime;

public class LeaderboardDTO {
    private Long rank;
    private String displayName;
    private Long completionTime;
    private String formattedTime; // MM:SS format
    private Integer mistakes;
    private Integer starsEarned;
    private Boolean isAnonymous;
    private Boolean isCurrentUser;
    private LocalDateTime completedAt;
    
    // Constructor
    public LeaderboardDTO() {}
    
    // Getters and Setters
    public Long getRank() {
        return rank;
    }
    
    public void setRank(Long rank) {
        this.rank = rank;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    
    public Long getCompletionTime() {
        return completionTime;
    }
    
    public void setCompletionTime(Long completionTime) {
        this.completionTime = completionTime;
    }
    
    public String getFormattedTime() {
        return formattedTime;
    }
    
    public void setFormattedTime(String formattedTime) {
        this.formattedTime = formattedTime;
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
    
    public Boolean getIsAnonymous() {
        return isAnonymous;
    }
    
    public void setIsAnonymous(Boolean isAnonymous) {
        this.isAnonymous = isAnonymous;
    }
    
    public Boolean getIsCurrentUser() {
        return isCurrentUser;
    }
    
    public void setIsCurrentUser(Boolean isCurrentUser) {
        this.isCurrentUser = isCurrentUser;
    }
    
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}