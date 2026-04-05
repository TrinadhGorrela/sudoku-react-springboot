package com.sudoku.util;

import com.sudoku.constants.GameConstants;
import java.util.*;

public class CompletedBoardGenerator {

    public static int[][] puzzle() {
        int n = GameConstants.GRID_SIZE;
        int[][] board = new int[n][n];

        if (solver(board, n)) {
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
        for (int i = 1; i <= GameConstants.GRID_SIZE; i++) {
            numbers.add(i);
        }
        Collections.shuffle(numbers);

        for (int num : numbers) {
            if (BoardValidator.isValid(board, row, col, num)) {
                board[row][col] = num;
                if (solver(board, n))
                    return true;
                board[row][col] = 0;
            }
        }

        return false;
    }
}
