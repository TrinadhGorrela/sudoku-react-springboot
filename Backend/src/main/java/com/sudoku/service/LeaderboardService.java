package com.sudoku.service;

import com.sudoku.dto.LeaderboardDTO;
import java.util.List;

public interface LeaderboardService {
    List<LeaderboardDTO> getTopPlayers(String difficulty, int limit, Long currentUserId);
    void saveScore(Long userId, String gameId, String difficulty, long completionTime, int mistakes);
    Long getUserRank(Long userId, String difficulty);
    List<LeaderboardDTO> getUserBestScores(Long userId);
}
