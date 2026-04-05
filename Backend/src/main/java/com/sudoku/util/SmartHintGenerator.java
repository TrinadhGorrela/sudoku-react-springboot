package com.sudoku.util;

import com.sudoku.constants.GameConstants;
import java.util.*;

public class SmartHintGenerator {

    public static HintInfo getHint(int[][] board) {
        HintInfo hint = findNakedSingle(board);
        if (hint != null) {
            return hint;
        }
        hint = findHiddenSingle(board);
        if (hint != null) {
            return hint;
        }

        return null;
    }

    private static HintInfo findNakedSingle(int[][] board) {
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board.length; j++) {
                if (board[i][j] == 0) {
                    List<Integer> answer = getPossibleNumbers(board, i, j);
                    if (answer.size() == 1) {
                        return new HintInfo(i, j, answer.get(0), "Last Remaining Cell",
                                "This cell must be " + answer.get(0) +
                                        " because all other numbers are eliminated by row, column, or box.");
                    }
                }
            }
        }
        return null;
    }

    private static HintInfo findHiddenSingle(int[][] board) {
        int gs = GameConstants.GRID_SIZE;
        int boxStride = gs / 3;

        for (int row = 0; row < gs; row++) {
            for (int num = 1; num <= gs; num++) {
                int count = 0;
                int foundCol = -1;

                for (int col = 0; col < gs; col++) {
                    if (board[row][col] == 0) {
                        List<Integer> possible = getPossibleNumbers(board, row, col);
                        if (possible.contains(num)) {
                            count++;
                            foundCol = col;
                        }
                    }
                }

                if (count == 1) {
                    return new HintInfo(row, foundCol, num, "Last Remaining Cell",
                            "Only cell in row " + (row + 1) + " that can contain " + num);
                }
            }
        }

        for (int col = 0; col < gs; col++) {
            for (int num = 1; num <= gs; num++) {
                int count = 0;
                int foundRow = -1;

                for (int row = 0; row < gs; row++) {
                    if (board[row][col] == 0) {
                        List<Integer> possible = getPossibleNumbers(board, row, col);
                        if (possible.contains(num)) {
                            count++;
                            foundRow = row;
                        }
                    }
                }

                if (count == 1) {
                    return new HintInfo(foundRow, col, num, "Hidden Single",
                            "Only cell in column " + (col + 1) + " that can contain " + num);
                }
            }
        }

        for (int boxRow = 0; boxRow < gs; boxRow += boxStride) {
            for (int boxCol = 0; boxCol < gs; boxCol += boxStride) {
                for (int num = 1; num <= gs; num++) {
                    int count = 0;
                    int foundRow = -1;
                    int foundCol = -1;

                    for (int row = boxRow; row < boxRow + boxStride; row++) {
                        for (int col = boxCol; col < boxCol + boxStride; col++) {
                            if (board[row][col] == 0) {
                                List<Integer> possible = getPossibleNumbers(board, row, col);
                                if (possible.contains(num)) {
                                    count++;
                                    foundRow = row;
                                    foundCol = col;
                                }
                            }
                        }
                    }

                    if (count == 1) {
                        int boxNumber = ((boxRow / boxStride) * boxStride) + (boxCol / boxStride) + 1;
                        return new HintInfo(foundRow, foundCol, num, "Hidden Single",
                                "Only cell in box " + boxNumber + " that can contain " + num);
                    }
                }
            }
        }

        return null;
    }

    private static List<Integer> getPossibleNumbers(int[][] board, int row, int col) {
        List<Integer> possible = new ArrayList<>();

        if (board[row][col] != 0) {
            return possible;
        }

        for (int i = 1; i <= GameConstants.GRID_SIZE; i++) {
            if (BoardValidator.isValid(board, row, col, i)) {
                possible.add(i);
            }
        }
        return possible;
    }

    public static class HintInfo {
        public int row;
        public int col;
        public int value;
        public String strategy;
        public String explanation;

        public HintInfo(int row, int col, int value, String strategy, String explanation) {
            this.row = row;
            this.col = col;
            this.value = value;
            this.strategy = strategy;
            this.explanation = explanation;
        }

        @Override
        public String toString() {
            return "HintInfo{row=" + row + ", col=" + col + ", value=" + value +
                    ", strategy='" + strategy + "', explanation='" + explanation + "'}";
        }
    }
}