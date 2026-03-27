package com.sudoku.dto.request;

public class MoveRequest {

    private int row;
    private int col;
    private int value;

    public boolean isValid() {
        return row >= 0 && row <= 8 &&
                col >= 0 && col <= 8 &&
                value >= 1 && value <= 9;
    }

    public String getValidationError() {
        if (row < 0 || row > 8)
            return "Row must be between 0 and 8";
        if (col < 0 || col > 8)
            return "Column must be between 0 and 8";
        if (value < 1 || value > 9)
            return "Value must be between 1 and 9";
        return null;
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

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

}