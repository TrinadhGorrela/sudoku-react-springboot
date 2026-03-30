package com.sudoku.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sudoku.dto.GameState;
import com.sudoku.dto.MoveHistory;
import com.sudoku.entity.Game;
import com.sudoku.enums.GameStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class GameMapper {

    @Autowired
    private ObjectMapper objectMapper;

    // -------------------------------------------------------------------------
    // Entity → DTO
    // -------------------------------------------------------------------------

    /**
     * Converts a persisted Game entity into a transient GameState DTO,
     * deserializing all JSON fields back into their Java types.
     */
    public GameState toGameState(Game game) {
        GameState state = new GameState();
        state.setGameId(game.getGameId());
        state.setUserId(game.getUserId());
        state.setDifficulty(game.getDifficulty());
        state.setMistakes(game.getMistakes());
        state.setTimeElapsed(game.getTimeElapsed());
        state.setStartTime(game.getStartTime());                      // Long field — no conversion needed
        state.setCompleted(game.getStatus() != GameStatus.IN_PROGRESS); // covers COMPLETED + ABANDONED

        state.setPuzzle(deserializeBoard(game.getPuzzleJson()));
        state.setCurrentBoard(deserializeBoard(game.getCurrentBoardJson()));
        state.setSolution(deserializeBoard(game.getSolutionJson()));
        state.setMoveHistory(deserializeMoveHistory(game.getMoveHistoryJson()));
        state.setNotes(deserializeNotes(game.getNotesJson()));

        return state;
    }

    // -------------------------------------------------------------------------
    // DTO → Entity  (used only on createGame)
    // -------------------------------------------------------------------------

    /**
     * Converts a GameState DTO into a new Game entity.
     * Only use this when creating a brand-new game.
     * For updates, use {@link #updateEntity(Game, GameState)} instead.
     */
    public Game toEntity(GameState state) {
        Game game = new Game();
        game.setGameId(state.getGameId());
        game.setUserId(state.getUserId());
        game.setDifficulty(state.getDifficulty());
        game.setPuzzleJson(serializeBoard(state.getPuzzle()));
        game.setCurrentBoardJson(serializeBoard(state.getCurrentBoard()));
        game.setSolutionJson(serializeBoard(state.getSolution()));
        game.setMistakes(state.getMistakes());
        game.setTimeElapsed(state.getTimeElapsed());
        game.setStartTime(state.getStartTime());
        game.setMoveHistoryJson(serializeMoveHistory(state.getMoveHistory()));
        game.setNotesJson(serializeNotes(state.getNotes()));
        game.setStatus(state.isCompleted() ? GameStatus.COMPLETED : GameStatus.IN_PROGRESS);
        return game;
    }

    // -------------------------------------------------------------------------
    // Partial update  (used on every move / undo / notes save)
    // -------------------------------------------------------------------------

    /**
     * Applies mutable GameState fields back onto an existing Game entity.
     * Immutable fields (puzzle, solution, difficulty, gameId) are intentionally skipped.
     */
    public void updateEntity(Game game, GameState state) {
        game.setCurrentBoardJson(serializeBoard(state.getCurrentBoard()));
        game.setMistakes(state.getMistakes());
        game.setTimeElapsed(state.getTimeElapsed());
        game.setMoveHistoryJson(serializeMoveHistory(state.getMoveHistory()));
        game.setNotesJson(serializeNotes(state.getNotes()));

        if (state.isCompleted()) {
            game.setStatus(state.getMistakes() >= 3 ? GameStatus.ABANDONED : GameStatus.COMPLETED);
            game.setCompletedAt(LocalDateTime.now());
        }
    }

    // =========================================================================
    // JSON helpers
    // =========================================================================

    private String serializeBoard(int[][] board) {
        try {
            return objectMapper.writeValueAsString(board);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize board", e);
        }
    }

    private int[][] deserializeBoard(String json) {
        try {
            return objectMapper.readValue(json, int[][].class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize board", e);
        }
    }

    private String serializeMoveHistory(List<MoveHistory> history) {
        try {
            return objectMapper.writeValueAsString(history != null ? history : new ArrayList<>());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize move history", e);
        }
    }

    private List<MoveHistory> deserializeMoveHistory(String json) {
        if (json == null || json.isBlank()) return new ArrayList<>();
        try {
            return objectMapper.readValue(json, new TypeReference<List<MoveHistory>>() {});
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }

    private String serializeNotes(List<List<List<Integer>>> notes) {
        try {
            return objectMapper.writeValueAsString(notes != null ? notes : emptyNotes());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize notes", e);
        }
    }

    private List<List<List<Integer>>> deserializeNotes(String json) {
        if (json == null || json.isBlank()) return emptyNotes();
        try {
            return objectMapper.readValue(json, new TypeReference<List<List<List<Integer>>>>() {});
        } catch (JsonProcessingException e) {
            return emptyNotes();
        }
    }

    /** Returns a clean 9×9 empty notes structure. */
    private List<List<List<Integer>>> emptyNotes() {
        List<List<List<Integer>>> notes = new ArrayList<>();
        for (int i = 0; i < 9; i++) {
            List<List<Integer>> row = new ArrayList<>();
            for (int j = 0; j < 9; j++) row.add(new ArrayList<>());
            notes.add(row);
        }
        return notes;
    }
}
