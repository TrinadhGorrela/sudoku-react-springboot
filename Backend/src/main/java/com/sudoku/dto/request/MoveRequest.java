package com.sudoku.dto.request;

import com.sudoku.constants.GameConstants;

public class MoveRequest {

    private int row;
    private int col;
    private int value;

    public boolean isValid() {
        int max = GameConstants.GRID_SIZE - 1;
        return row >= 0 && row <= max &&
                col >= 0 && col <= max &&
                value >= 1 && value <= GameConstants.GRID_SIZE;
    }

    public String getValidationError() {
        int max = GameConstants.GRID_SIZE - 1;
        if (row < 0 || row > max)
            return "Row must be between 0 and " + max;
        if (col < 0 || col > max)
            return "Column must be between 0 and " + max;
        if (value < 1 || value > GameConstants.GRID_SIZE)
            return "Value must be between 1 and " + GameConstants.GRID_SIZE;
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