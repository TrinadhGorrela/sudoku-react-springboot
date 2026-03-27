package com.sudoku.util;

import java.util.*;

public class CompletedBoardGenerator {
    
    public static int[][] puzzle() {
        int[][] board = new int[9][9];

        if (solver(board, 9)) {
            return board;
        } else {
            return null;
        }

    }

    public static boolean solver(int[][] board, int n) {
        int row = -1, col = -1;
        boolean empty = true;

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == 0) {
                    row = i;
                    col = j;
                    empty = false;
                    break;
                }
            }
            if (!empty)
                break;
        }

        if (empty) {
            return true;
        }

        List<Integer> numbers = new ArrayList<>();
        for (int i = 1; i <= 9; i++) {
            numbers.add(i);
        }
        Collections.shuffle(numbers);

        for (int num : numbers) {
            if (isSafe(board, row, col, num)) {
                board[row][col] = num;
                if (solver(board, n))
                    return true;
                board[row][col] = 0;
            }
        }

        return false;
    }

    public static boolean isSafe(int[][] board, int row, int col, int num) {

        for (int x = 0; x < 9; x++) {
            if (board[row][x] == num || board[x][col] == num)
                return false;
        }

        int startRow = row - row % 3;
        int startCol = col - col % 3;

        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] == num)
                    return false;
            }
        }

        return true;
    }

}
