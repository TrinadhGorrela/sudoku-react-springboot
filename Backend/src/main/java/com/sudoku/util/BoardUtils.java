package com.sudoku.util;

public class BoardUtils {
    public static int[][] copyBoard(int[][] original) {
        if (original == null) return null;
        int[][] copy = new int[9][9];
        for (int i = 0; i < 9; i++) {
            System.arraycopy(original[i], 0, copy[i], 0, 9);
        }
        return copy;
    }
}
