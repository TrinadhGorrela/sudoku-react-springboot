package com.sudoku.service;

import com.sudoku.dto.GameState;
import com.sudoku.util.SmartHintGenerator;
import com.sudoku.util.SmartHintGenerator.HintInfo;

public interface GameService {
    GameState createGame(String difficulty);
    GameState makeMove(String gameId, int row, int col, int value);
    GameState undoMove(String gameId);
    SmartHintGenerator.HintInfo getHint(String gameId);
    boolean validateSolution(String gameId);
    GameState getGameState(String gameId);
    GameState saveNotes(String gameId, java.util.List<java.util.List<java.util.List<Integer>>> notes);
    void deleteGame(String gameId);
    boolean gameExists(String gameId);
    void cleanupOldGames(long timeoutHours);
}

