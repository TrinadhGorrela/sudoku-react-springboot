package com.sudoku.dto;

public class UserStatsDTO {
    private Long userId;
    private String username;
    private String userType;
    private Integer totalGamesPlayed;
    private Integer gamesWon;
    private Long bestTimeEasy;
    private Long bestTimeMedium;
    private Long bestTimeHard;
    private Long bestTimeExpert;
    private Long bestTimeMaster;
    private Long bestTimeExtreme;
    
    // Constructor
    public UserStatsDTO() {}
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getUserType() {
        return userType;
    }
    
    public void setUserType(String userType) {
        this.userType = userType;
    }
    
    public Integer getTotalGamesPlayed() {
        return totalGamesPlayed;
    }
    
    public void setTotalGamesPlayed(Integer totalGamesPlayed) {
        this.totalGamesPlayed = totalGamesPlayed;
    }
    
    public Integer getGamesWon() {
        return gamesWon;
    }
    
    public void setGamesWon(Integer gamesWon) {
        this.gamesWon = gamesWon;
    }
    
    public Long getBestTimeEasy() {
        return bestTimeEasy;
    }
    
    public void setBestTimeEasy(Long bestTimeEasy) {
        this.bestTimeEasy = bestTimeEasy;
    }
    
    public Long getBestTimeMedium() {
        return bestTimeMedium;
    }
    
    public void setBestTimeMedium(Long bestTimeMedium) {
        this.bestTimeMedium = bestTimeMedium;
    }
    
    public Long getBestTimeHard() {
        return bestTimeHard;
    }
    
    public void setBestTimeHard(Long bestTimeHard) {
        this.bestTimeHard = bestTimeHard;
    }
    
    public Long getBestTimeExpert() {
        return bestTimeExpert;
    }
    
    public void setBestTimeExpert(Long bestTimeExpert) {
        this.bestTimeExpert = bestTimeExpert;
    }
    
    public Long getBestTimeMaster() {
        return bestTimeMaster;
    }
    
    public void setBestTimeMaster(Long bestTimeMaster) {
        this.bestTimeMaster = bestTimeMaster;
    }
    
    public Long getBestTimeExtreme() {
        return bestTimeExtreme;
    }
    
    public void setBestTimeExtreme(Long bestTimeExtreme) {
        this.bestTimeExtreme = bestTimeExtreme;
    }
}