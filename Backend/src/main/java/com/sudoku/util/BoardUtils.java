package com.sudoku.util;

import com.sudoku.constants.GameConstants;

public class BoardUtils {
    public static int[][] copyBoard(int[][] original) {
        if (original == null) return null;
        int n = GameConstants.GRID_SIZE;
        int[][] copy = new int[n][n];
        for (int i = 0; i < n; i++) {
            System.arraycopy(original[i], 0, copy[i], 0, n);
        }
        return copy;
    }
}
