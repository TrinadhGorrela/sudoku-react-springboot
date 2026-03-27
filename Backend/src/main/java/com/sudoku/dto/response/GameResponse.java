package com.sudoku.dto.response;

import java.util.List;

import com.sudoku.dto.GameState;

public class GameResponse {
    private String gameId;
    private int[][] puzzle;
    private int[][] currentBoard;
    private int[][] solution;
    private String difficulty;
    private int mistakes;
    private boolean completed;
    private List<List<List<Integer>>> notes;

    public GameResponse(GameState gameState) {
        this.gameId = gameState.getGameId();
        this.puzzle = gameState.getPuzzle();
        this.currentBoard = gameState.getCurrentBoard();
        this.solution = gameState.getSolution();
        this.difficulty = gameState.getDifficulty();
        this.mistakes = gameState.getMistakes();
        this.completed = gameState.isCompleted();
        this.notes = gameState.getNotes();
    }

    public List<List<List<Integer>>> getNotes() {
        return notes;
    }

    public void setNotes(List<List<List<Integer>>> notes) {
        this.notes = notes;
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

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public int[][] getSolution() {
        return solution;
    }

    public void setSolution(int[][] solution) {
        this.solution = solution;
    }

}