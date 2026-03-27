package com.sudoku.service.impl;

import com.sudoku.service.LeaderboardService;

import com.sudoku.dto.LeaderboardDTO;
import com.sudoku.entity.LeaderboardEntry;
import com.sudoku.entity.User;
import com.sudoku.enums.UserType;
import com.sudoku.repository.LeaderboardRepository;
import com.sudoku.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaderboardServiceImpl implements LeaderboardService {
    
    @Autowired
    private LeaderboardRepository leaderboardRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Get top players for a specific difficulty
     */
    public List<LeaderboardDTO> getTopPlayers(String difficulty, int limit, Long currentUserId) {
        List<LeaderboardEntry> entries = leaderboardRepository
            .findTop100ByDifficultyOrderByCompletionTimeAsc(difficulty);
        
        return entries.stream()
            .limit(limit)
            .map(entry -> {
                LeaderboardDTO dto = new LeaderboardDTO();
                dto.setDisplayName(entry.getDisplayName());
                dto.setCompletionTime(entry.getCompletionTime());
                dto.setFormattedTime(formatTime(entry.getCompletionTime()));
                dto.setMistakes(entry.getMistakes());
                dto.setStarsEarned(entry.getStarsEarned());
                dto.setIsAnonymous(entry.getIsAnonymous());
                dto.setIsCurrentUser(entry.getUserId().equals(currentUserId));
                dto.setCompletedAt(entry.getCompletedAt());
                return dto;
            })
            .collect(Collectors.toList());
    }
    
    /**
     * Save a completed game to the leaderboard
     * ⭐ FIXED: gameId is now String instead of Long
     */
    @Transactional
    public void saveScore(Long userId, String gameId, String difficulty, 
                         long completionTime, int mistakes) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        LeaderboardEntry entry = new LeaderboardEntry();
        entry.setUserId(userId);
        entry.setGameId(gameId); // ⭐ FIXED: Now accepts String
        entry.setDifficulty(difficulty);
        entry.setCompletionTime(completionTime);
        entry.setMistakes(mistakes);
        entry.setStarsEarned(calculateStars(mistakes));
        entry.setDisplayName(user.getDisplayName());
        entry.setIsAnonymous(user.getUserType() == UserType.ANONYMOUS);
        entry.setCompletedAt(LocalDateTime.now());
        
        leaderboardRepository.save(entry);
        System.out.println("🏆 Leaderboard entry saved for user: " + user.getDisplayName());
    }
    
    /**
     * Get user's rank for a specific difficulty
     */
    public Long getUserRank(Long userId, String difficulty) {
        return leaderboardRepository.getUserRank(userId, difficulty);
    }
    
    /**
     * Get user's best scores
     */
    public List<LeaderboardDTO> getUserBestScores(Long userId) {
        List<LeaderboardEntry> entries = leaderboardRepository.findByUserIdOrderByCompletedAtDesc(userId);
        
        return entries.stream()
            .map(entry -> {
                LeaderboardDTO dto = new LeaderboardDTO();
                dto.setDisplayName(entry.getDisplayName());
                dto.setCompletionTime(entry.getCompletionTime());
                dto.setFormattedTime(formatTime(entry.getCompletionTime()));
                dto.setMistakes(entry.getMistakes());
                dto.setStarsEarned(entry.getStarsEarned());
                dto.setCompletedAt(entry.getCompletedAt());
                return dto;
            })
            .collect(Collectors.toList());
    }
    
    /**
     * Calculate stars based on mistakes
     */
    private int calculateStars(int mistakes) {
        if (mistakes == 0) return 3;
        if (mistakes <= 2) return 2;
        return 1;
    }
    
    /**
     * Format time in milliseconds to MM:SS
     */
    private String formatTime(long milliseconds) {
        long seconds = milliseconds / 1000;
        long minutes = seconds / 60;
        long secs = seconds % 60;
        return String.format("%02d:%02d", minutes, secs);
    }
}