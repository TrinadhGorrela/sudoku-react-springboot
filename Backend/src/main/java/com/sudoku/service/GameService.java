package com.sudoku.service;

import com.sudoku.constants.GameConstants;
import com.sudoku.dto.GameState;
import com.sudoku.dto.MoveHistory;
import com.sudoku.entity.Game;
import com.sudoku.enums.GameStatus;
import com.sudoku.exception.GameExceptions;
import com.sudoku.mapper.GameMapper;
import com.sudoku.repository.GameRepository;
import com.sudoku.util.BoardUtils;
import com.sudoku.util.BoardValidator;
import com.sudoku.util.CompletedBoardGenerator;
import com.sudoku.util.PuzzleGenerator;
import com.sudoku.util.SmartHintGenerator;
import com.sudoku.util.SmartHintGenerator.HintInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private GameMapper gameMapper;

    @Transactional
    public GameState createGame(String difficulty) {
        int[][] solution = CompletedBoardGenerator.puzzle();
        int[][] puzzle   = PuzzleGenerator.generatePuzzle(solution, difficulty);

        Game game = new Game();
        game.setGameId(generateGameId());
        if (game.getUserId() == null) {
            game.setUserId(0L);
        }
        game.setDifficulty(difficulty);
        game.setPuzzleJson(gameMapper.serializeBoard(puzzle));
        game.setCurrentBoardJson(gameMapper.serializeBoard(BoardUtils.copyBoard(puzzle)));
        game.setSolutionJson(gameMapper.serializeBoard(solution));
        game.setMistakes(0);
        game.setTimeElapsed(0L);
        game.setStatus(GameStatus.IN_PROGRESS);
        game.setMoveHistoryJson("[]");

        gameRepository.save(game);
        return gameMapper.toGameState(game);
    }

    public GameState getGameState(String gameId) {
        return gameMapper.toGameState(loadGame(gameId));
    }

    public boolean gameExists(String gameId) {
        return gameRepository.existsByGameId(gameId);
    }

    @Transactional
    public GameState makeMove(String gameId, int row, int col, int value) {
        Game game = loadGame(gameId);
        GameState state = gameMapper.toGameState(game);

        validateMove(state, row, col, value);

        int previousValue = state.getCurrentBoard()[row][col];
        state.getCurrentBoard()[row][col] = value;

        boolean incrementedMistake = false;

        if (value != 0 && state.getPuzzle()[row][col] == 0) {
            boolean isWrong = !BoardValidator.isValid(state.getCurrentBoard(), row, col, value)
                           || state.getSolution()[row][col] != value;

            if (isWrong) {
                state.setMistakes(state.getMistakes() + 1);
                incrementedMistake = true;
            }
        }

        state.addMoveToHistory(new MoveHistory(row, col, previousValue, value, incrementedMistake));

        if (state.getMistakes() >= GameConstants.MAX_MISTAKES) {
            state.setCompleted(true);
            state.setTimeElapsed(System.currentTimeMillis() - state.getStartTime());
        } else if (isBoardComplete(state.getCurrentBoard(), state.getSolution())) {
            state.setCompleted(true);
            state.setTimeElapsed(System.currentTimeMillis() - state.getStartTime());
        }

        gameMapper.updateEntity(game, state);
        gameRepository.save(game);

        return state;
    }

    @Transactional
    public GameState undoMove(String gameId) {
        Game game = loadGame(gameId);
        GameState state = gameMapper.toGameState(game);

        if (state.isCompleted()) {
            throw new GameExceptions.Completed("Cannot undo - game is completed");
        }
        MoveHistory lastMove = state.popLastMove();
        if (lastMove == null) {
            throw new GameExceptions.NoMovesToUndo();
        }

        if (lastMove.isIncrementedMistakeCounter() && state.getMistakes() > 0) {
            state.setMistakes(state.getMistakes() - 1);
        }

        state.getCurrentBoard()[lastMove.getRow()][lastMove.getCol()] = lastMove.getPreviousValue();

        gameMapper.updateEntity(game, state);
        gameRepository.save(game);

        return state;
    }

    public HintInfo getHint(String gameId) {
        GameState state = gameMapper.toGameState(loadGame(gameId));

        if (state.isCompleted()) {
            throw new GameExceptions.Completed();
        }

        HintInfo hint = SmartHintGenerator.getHint(state.getCurrentBoard());

        if (hint == null || hint.value != state.getSolution()[hint.row][hint.col]) {
            for (int i = 0; i < GameConstants.GRID_SIZE; i++) {
                for (int j = 0; j < GameConstants.GRID_SIZE; j++) {
                    if (state.getCurrentBoard()[i][j] == 0) {
                        return new HintInfo(i, j, state.getSolution()[i][j], "Reveal Cell",
                            "The next correct number for this cell is " + state.getSolution()[i][j]);
                    }
                }
            }
            throw new GameExceptions.HintNotAvailable();
        }

        return hint;
    }

    public boolean validateSolution(String gameId) {
        GameState state = gameMapper.toGameState(loadGame(gameId));
        return isBoardComplete(state.getCurrentBoard(), state.getSolution());
    }

    @Transactional
    public GameState saveNotes(String gameId, List<List<List<Integer>>> notes) {
        Game game = loadGame(gameId);
        GameState state = gameMapper.toGameState(game);
        state.setNotes(notes);
        gameMapper.updateEntity(game, state);
        gameRepository.save(game);
        return state;
    }

    @Transactional
    public void deleteGame(String gameId) {
        gameRepository.deleteByGameId(gameId);
    }

    @Transactional
    public void cleanupOldGames(long timeoutHours) {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(timeoutHours);
        gameRepository.updateStatusForOldGames(GameStatus.IN_PROGRESS, GameStatus.ABANDONED, cutoff);
    }

    private Game loadGame(String gameId) {
        return gameRepository.findByGameId(gameId)
                .orElseThrow(() -> new GameExceptions.NotFound(gameId));
    }

    private void validateMove(GameState game, int row, int col, int value) {
        if (game.isCompleted()) throw new GameExceptions.Completed();
        if (row < 0 || row >= GameConstants.GRID_SIZE || col < 0 || col >= GameConstants.GRID_SIZE) {
            throw new IllegalArgumentException("Invalid cell position");
        }
        if (value < 0 || value > GameConstants.GRID_SIZE) {
            throw new IllegalArgumentException("Value must be between 0 and " + GameConstants.GRID_SIZE);
        }
        if (game.getPuzzle()[row][col] != 0) throw new IllegalArgumentException("Cannot modify original puzzle clue");
    }

    private boolean isBoardComplete(int[][] currentBoard, int[][] solution) {
        for (int i = 0; i < GameConstants.GRID_SIZE; i++)
            for (int j = 0; j < GameConstants.GRID_SIZE; j++)
                if (currentBoard[i][j] == 0 || currentBoard[i][j] != solution[i][j]) return false;
        return true;
    }

    private String generateGameId() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}