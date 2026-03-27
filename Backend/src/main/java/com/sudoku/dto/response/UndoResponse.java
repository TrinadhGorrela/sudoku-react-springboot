package com.sudoku.dto.response;

import com.sudoku.dto.GameState;

public class UndoResponse {
    private String gameId;
    private int[][] currentBoard;
    private int mistakes;
    private boolean undoSuccessful;
    private String message;
    private int row;
    private int col;
    private int restoredValue;

    public UndoResponse(GameState gameState, boolean success, String message, int row, int col, int restoredValue) {
        this.gameId = gameState.getGameId();
        this.currentBoard = gameState.getCurrentBoard();
        this.mistakes = gameState.getMistakes();
        this.undoSuccessful = success;
        this.message = message;
        this.row = row;
        this.col = col;
        this.restoredValue = restoredValue;
    }

    public UndoResponse(boolean success, String message) {
        this.undoSuccessful = success;
        this.message = message;
    }

    // Getters and Setters
    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public int[][] getCurrentBoard() {
        return currentBoard;
    }

    public void setCurrentBoard(int[][] currentBoard) {
        this.currentBoard = currentBoard;
    }

    public int getMistakes() {
        return mistakes;
    }

    public void setMistakes(int mistakes) {
        this.mistakes = mistakes;
    }

    public boolean isUndoSuccessful() {
        return undoSuccessful;
    }

    public void setUndoSuccessful(boolean undoSuccessful) {
        this.undoSuccessful = undoSuccessful;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getRow() {
        return row;
    }

    public void setRow(int row) {
        this.row = row;
    }

    public int getCol() {
        return col;
    }

    public void setCol(int col) {
        this.col = col;
    }

    public int getRestoredValue() {
        return restoredValue;
    }

    public void setRestoredValue(int restoredValue) {
        this.restoredValue = restoredValue;
    }
}