package com.sudoku.repository;

import com.sudoku.entity.Game;
import com.sudoku.enums.GameStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    
    Optional<Game> findByGameId(String gameId);
    
    List<Game> findByUserId(Long userId);
    
    List<Game> findByUserIdAndStatus(Long userId, GameStatus status);
    
    List<Game> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Get user's active games
    @Query("SELECT g FROM Game g WHERE g.userId = :userId AND g.status = 'IN_PROGRESS' ORDER BY g.createdAt DESC")
    List<Game> findActiveGamesByUserId(@Param("userId") Long userId);
    
    // Get user's completed games
    @Query("SELECT g FROM Game g WHERE g.userId = :userId AND g.status = 'COMPLETED' ORDER BY g.completedAt DESC")
    List<Game> findCompletedGamesByUserId(@Param("userId") Long userId);
    
    // Clean up old abandoned games
    @Query("SELECT g FROM Game g WHERE g.status = 'IN_PROGRESS' AND g.createdAt < :cutoffTime")
    List<Game> findOldInProgressGames(@Param("cutoffTime") LocalDateTime cutoffTime);
    
    // Analytics
    Long countByStatus(GameStatus status);
    
    Long countByDifficulty(String difficulty);
}