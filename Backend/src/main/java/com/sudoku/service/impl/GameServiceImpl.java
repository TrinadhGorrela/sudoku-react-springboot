package com.sudoku.service.impl;

import com.sudoku.service.GameService;
import com.sudoku.service.UserService;
import com.sudoku.service.LeaderboardService;

import com.sudoku.dto.GameState;
import com.sudoku.dto.MoveHistory;
import com.sudoku.entity.User;
import com.sudoku.repository.GameRepository;
import com.sudoku.util.CompletedBoardGenerator;
import com.sudoku.util.PuzzleGenerator;
import com.sudoku.util.SmartHintGenerator;
import com.sudoku.util.SmartHintGenerator.HintInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameServiceImpl implements GameService {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private LeaderboardService leaderboardService;

    private final Map<String, GameState> activeGames = new ConcurrentHashMap<>();
    private final CompletedBoardGenerator completedBoardGenerator;
    private final PuzzleGenerator puzzleGenerator;

    public GameServiceImpl() {
        this.completedBoardGenerator = new CompletedBoardGenerator();
        this.puzzleGenerator = new PuzzleGenerator();
    }

    // NEW: Modified to accept userId
    public GameState createGame(Long userId, String difficulty) {
        int[][] solution = completedBoardGenerator.puzzle();
        int[][] puzzle = puzzleGenerator.generatePuzzle(solution, difficulty);

        GameState gameState = new GameState();
        gameState.setGameId(generateGameId());
        gameState.setUserId(userId); // ADD userId
        gameState.setPuzzle(puzzle);
        gameState.setSolution(solution);
        gameState.setCurrentBoard(copyBoard(puzzle));
        gameState.setDifficulty(difficulty);
        gameState.setMistakes(0);
        gameState.setStartTime(System.currentTimeMillis());
        gameState.setCompleted(false);

        activeGames.put(gameState.getGameId(), gameState);

        // Increment user's total games played
        userService.incrementGamesPlayed(userId);

        return gameState;
    }

    public GameState makeMove(String gameId, int row, int col, int value) {
        GameState game = getGameState(gameId);
        validateMove(game, row, col, value);

        // Get the previous value at this position
        int previousValue = game.getCurrentBoard()[row][col];

        // Update the board
        game.getCurrentBoard()[row][col] = value;

        // Track if this move ADDED a new mistake to the counter
        boolean incrementedMistake = false;

        // IMPROVED VALIDATION - Count mistakes when placing ANY non-zero value
        if (value != 0 && game.getPuzzle()[row][col] == 0) {
            // We're placing a value in a non-prefilled cell

            boolean isWrong = false;

            // Check 1: Violates Sudoku rules (duplicates)
            if (!isMoveValid(game.getCurrentBoard(), row, col, value)) {
                isWrong = true;
                System.out.println("Mistake: Violates Sudoku rules (duplicate)");
            }
            // Check 2: Wrong value (doesn't match solution)
            else if (game.getSolution()[row][col] != value) {
                isWrong = true;
                System.out.println("Mistake: Wrong value (doesn't match solution)");
            } else {
                System.out.println("Correct value placed");
            }

            // FIXED LOGIC: Count mistake based on what we're REPLACING
            if (isWrong) {
                // Check if previous value was also wrong
                boolean previousWasAlsoWrong = false;

                if (previousValue != 0) {
                    // Previous value existed - was it also wrong?
                    if (previousValue != game.getSolution()[row][col]) {
                        previousWasAlsoWrong = true;
                        System.out.println("⚠️  Previous value was also wrong - replacing wrong with wrong");
                    }
                }

                // Only increment if we're NOT replacing a wrong value with another wrong value
                // OR if the cell was empty before
                if (previousValue == 0) {
                    // Empty cell -> wrong value = increment
                    game.setMistakes(game.getMistakes() + 1);
                    incrementedMistake = true;
                    System.out.println("📊 Mistake counted (empty -> wrong). Total: " + game.getMistakes());
                } else if (!previousWasAlsoWrong) {
                    // Had correct value -> wrong value = increment
                    game.setMistakes(game.getMistakes() + 1);
                    incrementedMistake = true;
                    System.out.println("Mistake counted (correct -> wrong). Total: " + game.getMistakes());
                } else {
                    // Had wrong value -> still wrong = don't increment
                    System.out.println("Wrong -> Wrong replacement, no new mistake");
                }
            }
        }

        // Add move to history (for undo)
        MoveHistory moveHistory = new MoveHistory(row, col, previousValue, value, incrementedMistake);
        game.addMoveToHistory(moveHistory);
        System.out.println("Move added to history: " + moveHistory);

        // Check if game is over (3 mistakes) or board is complete
        if (game.getMistakes() >= 3) {
            game.setCompleted(true);
            game.setTimeElapsed(System.currentTimeMillis() - game.getStartTime());
            System.out.println("Game over (3 mistakes) for user: " + game.getUserId());
        } else if (isBoardComplete(game.getCurrentBoard(), game.getSolution())) {
            game.setCompleted(true);
            game.setTimeElapsed(System.currentTimeMillis() - game.getStartTime());

            // UPDATE USER STATS IN DATABASE
            userService.updateUserStats(
                    game.getUserId(),
                    game.getDifficulty(),
                    game.getTimeElapsed(),
                    game.getMistakes());

            leaderboardService.saveScore(
                    game.getUserId(),
                    game.getGameId(),
                    game.getDifficulty(),
                    game.getTimeElapsed(),
                    game.getMistakes());

            System.out.println("Game completed! Stats updated for user: " + game.getUserId());
        }

        return game;
    }

    // Undo the last move
    public GameState undoMove(String gameId) {
        GameState game = getGameState(gameId);

        if (game.isCompleted()) {
            throw new RuntimeException("Cannot undo - game is completed");
        }

        if (!game.hasMovesToUndo()) {
            throw new RuntimeException("No moves to undo");
        }

        // Pop the last move from history
        MoveHistory lastMove = game.popLastMove();

        if (lastMove == null) {
            throw new RuntimeException("No moves to undo");
        }

        // Restore the previous value
        int row = lastMove.getRow();
        int col = lastMove.getCol();
        int previousValue = lastMove.getPreviousValue();

        game.getCurrentBoard()[row][col] = previousValue;

        // Do not decrement mistake counter on undo - mistakes are permanent
        System.out.println("⏪ Undid move. Mistakes remain at: " + game.getMistakes());

        System.out.println("⏪ Undo successful: Restored [" + row + "," + col + "] to " + previousValue);

        return game;
    }

    public SmartHintGenerator.HintInfo getHint(String gameId) {
        GameState game = getGameState(gameId);

        if (game.isCompleted()) {
            throw new RuntimeException("Game already completed");
        }
        HintInfo hint = SmartHintGenerator.getHint(game.getCurrentBoard());
        
        // If the smart hint is missing or incorrect due to previous user mistakes on the board, 
        // fallback to a guaranteed correct hint directly from the solution.
        if (hint == null || hint.value != game.getSolution()[hint.row][hint.col]) {
            for (int i = 0; i < 9; i++) {
                for (int j = 0; j < 9; j++) {
                    if (game.getCurrentBoard()[i][j] == 0) {
                        return new HintInfo(i, j, game.getSolution()[i][j], "Reveal Cell", 
                            "The next correct number for this cell is " + game.getSolution()[i][j]);
                    }
                }
            }
            throw new RuntimeException("No hint available");
        }

        return hint;
    }

    public boolean validateSolution(String gameId) {
        GameState game = getGameState(gameId);
        return isBoardComplete(game.getCurrentBoard(), game.getSolution());
    }

    public GameState getGameState(String gameId) {
        GameState game = activeGames.get(gameId);
        if (game == null) {
            throw new RuntimeException("Game not found: " + gameId);
        }
        return game;
    }

    public void deleteGame(String gameId) {
        activeGames.remove(gameId);
    }

    // ============ HELPER METHODS ============

    private void validateMove(GameState game, int row, int col, int value) {
        if (game.isCompleted()) {
            throw new RuntimeException("Game already completed");
        }

        if (row < 0 || row > 8 || col < 0 || col > 8) {
            throw new RuntimeException("Invalid cell position");
        }

        // Allow 0 (for clearing cells)
        if (value < 0 || value > 9) {
            throw new RuntimeException("Value must be between 0 and 9");
        }

        if (game.getPuzzle()[row][col] != 0) {
            throw new RuntimeException("Cannot modify original puzzle clue");
        }
    }

    public boolean gameExists(String gameId) {
        return activeGames.containsKey(gameId);
    }

    /**
     * Check if a move is valid according to Sudoku rules (no duplicates)
     * This checks the CURRENT board state, not the solution
     */
    private boolean isMoveValid(int[][] board, int row, int col, int value) {
        if (value == 0)
            return true; // Clearing a cell is always valid

        // Check row for duplicates
        for (int i = 0; i < 9; i++) {
            if (i != col && board[row][i] == value) {
                System.out.println("Duplicate found in row " + row);
                return false;
            }
        }

        // Check column for duplicates
        for (int i = 0; i < 9; i++) {
            if (i != row && board[i][col] == value) {
                System.out.println("Duplicate found in column " + col);
                return false;
            }
        }

        // Check 3x3 box for duplicates
        int boxRow = row - row % 3;
        int boxCol = col - col % 3;
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                int r = boxRow + i;
                int c = boxCol + j;
                if ((r != row || c != col) && board[r][c] == value) {
                    System.out.println("Duplicate found in 3x3 box");
                    return false;
                }
            }
        }

        return true;
    }

    private boolean isBoardComplete(int[][] currentBoard, int[][] solution) {
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (currentBoard[i][j] == 0 || currentBoard[i][j] != solution[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    private String generateGameId() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    private int[][] copyBoard(int[][] original) {
        int[][] copy = new int[9][9];
        for (int i = 0; i < 9; i++) {
            System.arraycopy(original[i], 0, copy[i], 0, 9);
        }
        return copy;
    }

    public void cleanupOldGames(long timeoutHours) {
        long cutoffTime = System.currentTimeMillis() - (timeoutHours * 60 * 60 * 1000);
        activeGames.entrySet().removeIf(entry -> entry.getValue().getStartTime() < cutoffTime);
    }
}