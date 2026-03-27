package com.sudoku.controller;

import com.sudoku.dto.LeaderboardDTO;
import com.sudoku.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {
    
    @Autowired
    private LeaderboardService leaderboardService;
    
    /**
     * Get top players for a specific difficulty
     */
    @GetMapping("/{difficulty}")
    public ResponseEntity<?> getLeaderboard(
            @PathVariable String difficulty,
            @RequestParam(defaultValue = "10") int limit,
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId) {
        
        try {
            List<LeaderboardDTO> leaderboard = leaderboardService.getTopPlayers(
                difficulty, 
                limit, 
                currentUserId
            );
            
            return ResponseEntity.ok(leaderboard);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get user's rank for a difficulty
     */
    @GetMapping("/rank/{userId}/{difficulty}")
    public ResponseEntity<?> getUserRank(
            @PathVariable Long userId,
            @PathVariable String difficulty) {
        
        try {
            Long rank = leaderboardService.getUserRank(userId, difficulty);
            return ResponseEntity.ok(rank);
            
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get user's best scores across all difficulties
     */
    @GetMapping("/user/{userId}/best")
    public ResponseEntity<?> getUserBestScores(@PathVariable Long userId) {
        try {
            List<LeaderboardDTO> bestScores = leaderboardService.getUserBestScores(userId);
            return ResponseEntity.ok(bestScores);
            
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}