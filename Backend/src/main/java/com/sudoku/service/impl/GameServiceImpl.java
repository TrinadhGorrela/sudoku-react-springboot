package com.sudoku.service.impl;

import com.sudoku.service.GameService;
import com.sudoku.dto.GameState;
import com.sudoku.dto.MoveHistory;
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

    private final Map<String, GameState> activeGames = new ConcurrentHashMap<>();
    private final CompletedBoardGenerator completedBoardGenerator;
    private final PuzzleGenerator puzzleGenerator;

    public GameServiceImpl() {
        this.completedBoardGenerator = new CompletedBoardGenerator();
        this.puzzleGenerator = new PuzzleGenerator();
    }

    public GameState createGame(String difficulty) {
        int[][] solution = completedBoardGenerator.puzzle();
        int[][] puzzle = puzzleGenerator.generatePuzzle(solution, difficulty);

        GameState gameState = new GameState();
        gameState.setGameId(generateGameId());
        gameState.setPuzzle(puzzle);
        gameState.setSolution(solution);
        gameState.setCurrentBoard(copyBoard(puzzle));
        gameState.setDifficulty(difficulty);
        gameState.setMistakes(0);
        gameState.setStartTime(System.currentTimeMillis());
        gameState.setCompleted(false);

        activeGames.put(gameState.getGameId(), gameState);
        return gameState;
    }

    public GameState makeMove(String gameId, int row, int col, int value) {
        GameState game = getGameState(gameId);
        validateMove(game, row, col, value);

        int previousValue = game.getCurrentBoard()[row][col];
        game.getCurrentBoard()[row][col] = value;

        boolean incrementedMistake = false;

        if (value != 0 && game.getPuzzle()[row][col] == 0) {
            boolean isWrong = false;

            if (!isMoveValid(game.getCurrentBoard(), row, col, value)) {
                isWrong = true;
            } else if (game.getSolution()[row][col] != value) {
                isWrong = true;
            }

            if (isWrong) {
                boolean previousWasAlsoWrong = previousValue != 0
                        && previousValue != game.getSolution()[row][col];

                if (previousValue == 0 || !previousWasAlsoWrong) {
                    game.setMistakes(game.getMistakes() + 1);
                    incrementedMistake = true;
                }
            }
        }

        game.addMoveToHistory(new MoveHistory(row, col, previousValue, value, incrementedMistake));

        if (game.getMistakes() >= 3) {
            game.setCompleted(true);
            game.setTimeElapsed(System.currentTimeMillis() - game.getStartTime());
        } else if (isBoardComplete(game.getCurrentBoard(), game.getSolution())) {
            game.setCompleted(true);
            game.setTimeElapsed(System.currentTimeMillis() - game.getStartTime());
        }

        return game;
    }

    public GameState undoMove(String gameId) {
        GameState game = getGameState(gameId);

        if (game.isCompleted()) {
            throw new RuntimeException("Cannot undo - game is completed");
        }
        if (!game.hasMovesToUndo()) {
            throw new RuntimeException("No moves to undo");
        }

        MoveHistory lastMove = game.popLastMove();
        if (lastMove == null) {
            throw new RuntimeException("No moves to undo");
        }

        game.getCurrentBoard()[lastMove.getRow()][lastMove.getCol()] = lastMove.getPreviousValue();
        return game;
    }

    public SmartHintGenerator.HintInfo getHint(String gameId) {
        GameState game = getGameState(gameId);

        if (game.isCompleted()) {
            throw new RuntimeException("Game already completed");
        }

        HintInfo hint = SmartHintGenerator.getHint(game.getCurrentBoard());

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

    public boolean gameExists(String gameId) {
        return activeGames.containsKey(gameId);
    }

    public void cleanupOldGames(long timeoutHours) {
        long cutoffTime = System.currentTimeMillis() - (timeoutHours * 60 * 60 * 1000);
        activeGames.entrySet().removeIf(entry -> entry.getValue().getStartTime() < cutoffTime);
    }

    private void validateMove(GameState game, int row, int col, int value) {
        if (game.isCompleted()) throw new RuntimeException("Game already completed");
        if (row < 0 || row > 8 || col < 0 || col > 8) throw new RuntimeException("Invalid cell position");
        if (value < 0 || value > 9) throw new RuntimeException("Value must be between 0 and 9");
        if (game.getPuzzle()[row][col] != 0) throw new RuntimeException("Cannot modify original puzzle clue");
    }

    private boolean isMoveValid(int[][] board, int row, int col, int value) {
        if (value == 0) return true;
        for (int i = 0; i < 9; i++) {
            if (i != col && board[row][i] == value) return false;
            if (i != row && board[i][col] == value) return false;
        }
        int boxRow = row - row % 3;
        int boxCol = col - col % 3;
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                int r = boxRow + i;
                int c = boxCol + j;
                if ((r != row || c != col) && board[r][c] == value) return false;
            }
        }
        return true;
    }

    private boolean isBoardComplete(int[][] currentBoard, int[][] solution) {
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (currentBoard[i][j] == 0 || currentBoard[i][j] != solution[i][j]) return false;
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
}