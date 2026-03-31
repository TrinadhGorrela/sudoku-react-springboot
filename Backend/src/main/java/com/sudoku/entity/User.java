package com.sudoku.entity;

import com.sudoku.enums.UserType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType userType = UserType.ANONYMOUS;


    @Column(unique = true)
    private String username;

    @Column(unique = true)
    private String email;

    private String passwordHash;

    @Column(nullable = false)
    private Integer totalGamesPlayed = 0;

    @Column(nullable = false)
    private Integer gamesWon = 0;

    private Long bestTimeEasy;
    private Long bestTimeMedium;
    private Long bestTimeHard;
    private Long bestTimeExpert;
    private Long bestTimeMaster;
    private Long bestTimeExtreme;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime registeredAt;

    @Column(nullable = false)
    private LocalDateTime lastActive;

    public User() {
        this.createdAt = LocalDateTime.now();
        this.lastActive = LocalDateTime.now();
    }

    public String getDisplayName() {
        if (userType == UserType.REGISTERED && username != null) {
            return username;
        }
        return "Player #" + id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    public LocalDateTime getLastActive() {
        return lastActive;
    }

    public void setLastActive(LocalDateTime lastActive) {
        this.lastActive = lastActive;
    }
}