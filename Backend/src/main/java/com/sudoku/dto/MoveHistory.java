package com.sudoku.dto;

public class MoveHistory {
    private int row;
    private int col;
    private int previousValue;
    private int newValue;
    private long timestamp;
    private boolean incrementedMistakeCounter; // RENAMED for clarity

    public MoveHistory(int row, int col, int previousValue, int newValue, boolean incrementedMistakeCounter) {
        this.row = row;
        this.col = col;
        this.previousValue = previousValue;
        this.newValue = newValue;
        this.timestamp = System.currentTimeMillis();
        this.incrementedMistakeCounter = incrementedMistakeCounter;
    }

    // Getters and Setters
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

    public int getPreviousValue() {
        return previousValue;
    }

    public void setPreviousValue(int previousValue) {
        this.previousValue = previousValue;
    }

    public int getNewValue() {
        return newValue;
    }

    public void setNewValue(int newValue) {
        this.newValue = newValue;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    // RENAMED: More accurate name
    public boolean isIncrementedMistakeCounter() {
        return incrementedMistakeCounter;
    }

    public void setIncrementedMistakeCounter(boolean incrementedMistakeCounter) {
        this.incrementedMistakeCounter = incrementedMistakeCounter;
    }

    // Keep old method name for compatibility
    public boolean isWasMistake() {
        return incrementedMistakeCounter;
    }

    public void setWasMistake(boolean wasMistake) {
        this.incrementedMistakeCounter = wasMistake;
    }

    @Override
    public String toString() {
        return "MoveHistory{" +
                "row=" + row +
                ", col=" + col +
                ", previousValue=" + previousValue +
                ", newValue=" + newValue +
                ", incrementedMistakeCounter=" + incrementedMistakeCounter +
                '}';
    }
}