package com.sudoku.entity;

import com.sudoku.enums.UserType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime registeredAt;

    @Column(nullable = false)
    private LocalDateTime lastActive = LocalDateTime.now();

    public String getDisplayName() {
        if (userType == UserType.REGISTERED && username != null) {
            return username;
        }
        return "Player #" + id;
    }
}