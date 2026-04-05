package com.sudoku.util;

import com.sudoku.constants.GameConstants;

public class BoardValidator {

    public static boolean isValid(int[][] board, int row, int col, int value) {
        if (value == 0) return true;

        int n = GameConstants.GRID_SIZE;
        // Check row and column
        for (int i = 0; i < n; i++) {
            if (i != col && board[row][i] == value) return false;
            if (i != row && board[i][col] == value) return false;
        }

        // Check 3x3 box
        int boxSize = n / 3;
        int boxRow = row - row % boxSize;
        int boxCol = col - col % boxSize;

        for (int i = 0; i < boxSize; i++) {
            for (int j = 0; j < boxSize; j++) {
                int r = boxRow + i;
                int c = boxCol + j;
                if ((r != row || c != col) && board[r][c] == value) return false;
            }
        }

        return true;
    }
}
