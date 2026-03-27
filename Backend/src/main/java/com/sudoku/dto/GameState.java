package com.sudoku.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;

public class GameState {
    @JsonProperty("gameId")
    private String gameId;

    @JsonProperty("userId")
    private Long userId;

    @JsonProperty("puzzle")
    private int[][] puzzle;

    @JsonProperty("currentBoard")
    private int[][] currentBoard;

    @JsonProperty("solution")
    private int[][] solution;

    @JsonProperty("difficulty")
    private String difficulty;

    @JsonProperty("mistakes")
    private int mistakes;

    @JsonProperty("startTime")
    private long startTime;

    @JsonProperty("completed")
    private boolean completed;

    @JsonProperty("timeElapsed")
    private long timeElapsed;

    @JsonProperty("notes")
    private List<List<List<Integer>>> notes; 

    private List<MoveHistory> moveHistory = new ArrayList<>();

    public GameState() {
        this.notes = new ArrayList<>();
        for (int i = 0; i < 9; i++) {
            List<List<Integer>> row = new ArrayList<>();
            for (int j = 0; j < 9; j++) {
                row.add(new ArrayList<>());
            }
            notes.add(row);
        }
    }

    public List<List<List<Integer>>> getNotes() {
        return notes;
    }

    public void setNotes(List<List<List<Integer>>> notes) {
        this.notes = notes;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public int[][] getPuzzle() {
        return puzzle;
    }

    public void setPuzzle(int[][] puzzle) {
        this.puzzle = puzzle;
    }

    public int[][] getCurrentBoard() {
        return currentBoard;
    }

    public void setCurrentBoard(int[][] currentBoard) {
        this.currentBoard = currentBoard;
    }

    public int[][] getSolution() {
        return solution;
    }

    public void setSolution(int[][] solution) {
        this.solution = solution;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public int getMistakes() {
        return mistakes;
    }

    public void setMistakes(int mistakes) {
        this.mistakes = mistakes;
    }

    public long getStartTime() {
        return startTime;
    }

    public void setStartTime(long startTime) {
        this.startTime = startTime;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public long getTimeElapsed() {
        return timeElapsed;
    }

    public void setTimeElapsed(long timeElapsed) {
        this.timeElapsed = timeElapsed;
    }

    public List<MoveHistory> getMoveHistory() {
        return moveHistory;
    }

    public void setMoveHistory(List<MoveHistory> moveHistory) {
        this.moveHistory = moveHistory;
    }

    public void addMoveToHistory(MoveHistory move) {
        this.moveHistory.add(move);
    }

    public MoveHistory popLastMove() {
        if (moveHistory.isEmpty()) {
            return null;
        }
        return moveHistory.remove(moveHistory.size() - 1);
    }

    public boolean hasMovesToUndo() {
        return !moveHistory.isEmpty();
    }
}