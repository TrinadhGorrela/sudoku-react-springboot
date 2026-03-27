package com.sudoku.dto.response;

public class MoveResponse {
    private boolean valid;
    private boolean correct;
    private int[][] updatedBoard;
    private int mistakes;
    private boolean completed;

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public int[][] getUpdatedBoard() {
        return updatedBoard;
    }

    public void setUpdatedBoard(int[][] updatedBoard) {
        this.updatedBoard = updatedBoard;
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    private String message;

}