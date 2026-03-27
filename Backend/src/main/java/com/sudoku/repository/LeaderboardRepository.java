package com.sudoku.repository;

import com.sudoku.entity.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaderboardRepository extends JpaRepository<LeaderboardEntry, Long> {
    
    // Get top players for a specific difficulty
    List<LeaderboardEntry> findTop100ByDifficultyOrderByCompletionTimeAsc(String difficulty);
    
    // Get user's rank for a difficulty
    @Query("SELECT COUNT(l) + 1 FROM LeaderboardEntry l WHERE l.difficulty = :difficulty " +
           "AND l.completionTime < (SELECT MIN(le.completionTime) FROM LeaderboardEntry le WHERE le.userId = :userId AND le.difficulty = :difficulty)")
    Long getUserRank(@Param("userId") Long userId, @Param("difficulty") String difficulty);
    
    // Get user's best entry for a difficulty
    @Query("SELECT l FROM LeaderboardEntry l WHERE l.userId = :userId AND l.difficulty = :difficulty " +
           "ORDER BY l.completionTime ASC, l.mistakes ASC")
    List<LeaderboardEntry> findUserBestScores(@Param("userId") Long userId, @Param("difficulty") String difficulty);
    
    // Get all entries for a user
    List<LeaderboardEntry> findByUserIdOrderByCompletedAtDesc(Long userId);
    
    // Get top players globally (all difficulties)
    @Query("SELECT l FROM LeaderboardEntry l ORDER BY l.starsEarned DESC, l.completionTime ASC")
    List<LeaderboardEntry> findTop100GlobalPlayers();
}