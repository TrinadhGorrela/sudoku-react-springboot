package com.sudoku.util;

public class BoardValidator {

    public static boolean isValid(int[][] board, int row, int col, int value) {
        if (value == 0) return true;

        // Check row and column
        for (int i = 0; i < 9; i++) {
            if (i != col && board[row][i] == value) return false;
            if (i != row && board[i][col] == value) return false;
        }

        // Check 3x3 box
        int boxRow = row - row % 3;
        int boxCol = col - col % 3;

        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                int r = boxRow + i;
                int c = boxCol + j;
                if ((r != row || c != col) && board[r][c] == value) return false;
            }
        }

        return true;
    }
}
