package com.sudoku.util;

import com.sudoku.constants.GameConstants;
import java.util.*;

public class PuzzleGenerator {

    public static int[][] generatePuzzle(int[][] solvedBoard, String difficulty) {
        int[][] puzzle = BoardUtils.copyBoard(solvedBoard);
        int targetCellsToRemove = getTargetCells(difficulty);
        List<int[]> positions = getAllPositionsRandomized();
        int cellsRemoved = 0;

        for (int[] pos : positions) {
            if (cellsRemoved >= targetCellsToRemove) {
                break;
            }

            int row = pos[0];
            int col = pos[1];
            int originalValue = puzzle[row][col];

            if (originalValue == 0) {
                continue;
            }

            puzzle[row][col] = 0;

            if (hasUniqueSolution(puzzle)) {
                cellsRemoved++;
            } else {
                puzzle[row][col] = originalValue;
            }
        }

        if (cellsRemoved < targetCellsToRemove) {
            puzzle = attemptAdditionalRemovals(puzzle, solvedBoard,
                    targetCellsToRemove - cellsRemoved);
        }

        return puzzle;
    }

    private static int getTargetCells(String difficulty) {
        switch (difficulty.toLowerCase()) {
            case "easy":
                return 1; // Temporarily 1 for testing the victory modal
            case "medium":
                return 45;
            case "hard":
                return 55;
            case "expert":
                return 60;
            case "master":
                return 65;
            case "extreme":
                return 70;
            default:
                return 45;
        }
    }

    private static List<int[]> getAllPositionsRandomized() {
        List<int[]> positions = new ArrayList<>();

        for (int row = 0; row < GameConstants.GRID_SIZE; row++) {
            for (int col = 0; col < GameConstants.GRID_SIZE; col++) {
                positions.add(new int[] { row, col });
            }
        }

        Collections.shuffle(positions);
        return positions;
    }

    public static boolean hasUniqueSolution(int[][] puzzle) {
        int[][] boardCopy = BoardUtils.copyBoard(puzzle);
        int solutionCount = countSolutionsLimited(boardCopy, 2);
        return solutionCount == 1;
    }

    private static int countSolutionsLimited(int[][] board, int limit) {
        int emptyRow = -1;
        int emptyCol = -1;
        boolean foundEmpty = false;

        for (int row = 0; row < GameConstants.GRID_SIZE && !foundEmpty; row++) {
            for (int col = 0; col < GameConstants.GRID_SIZE && !foundEmpty; col++) {
                if (board[row][col] == 0) {
                    emptyRow = row;
                    emptyCol = col;
                    foundEmpty = true;
                }
            }
        }

        if (!foundEmpty) {
            return 1;
        }

        int solutionCount = 0;

        for (int num = 1; num <= GameConstants.GRID_SIZE; num++) {
            if (BoardValidator.isValid(board, emptyRow, emptyCol, num)) {
                board[emptyRow][emptyCol] = num;
                solutionCount += countSolutionsLimited(board, limit);
                board[emptyRow][emptyCol] = 0;
                if (solutionCount >= limit) {
                    return solutionCount;
                }
            }
        }

        return solutionCount;
    }

    private static int[][] attemptAdditionalRemovals(int[][] puzzle, int[][] solvedBoard,
            int remainingToRemove) {
        if (remainingToRemove <= 0) {
            return puzzle;
        }

        List<int[]> positions = getAllPositionsRandomized();
        int cellsRemoved = 0;
        int[][] currentPuzzle = BoardUtils.copyBoard(puzzle);

        for (int[] pos : positions) {
            if (cellsRemoved >= remainingToRemove) {
                break;
            }
            int row = pos[0];
            int col = pos[1];

            if (currentPuzzle[row][col] == 0) {
                continue;
            }

            int originalValue = currentPuzzle[row][col];

            currentPuzzle[row][col] = 0;

            if (hasUniqueSolution(currentPuzzle)) {
                cellsRemoved++;
            } else {
                currentPuzzle[row][col] = originalValue;
            }
        }

        return currentPuzzle;
    }

    public static int[][] generateSymmetricalPuzzle(int[][] solvedBoard, String difficulty) {
        int[][] puzzle = BoardUtils.copyBoard(solvedBoard);
        int targetCells = getTargetCells(difficulty) / 2;

        List<int[]> symmetricalPairs = generateSymmetricalPairs();
        Collections.shuffle(symmetricalPairs);

        int pairsRemoved = 0;

        for (int[] pair : symmetricalPairs) {
            if (pairsRemoved >= targetCells) {
                break;
            }

            int row1 = pair[0];
            int col1 = pair[1];
            int row2 = pair[2];
            int col2 = pair[3];

            int val1 = puzzle[row1][col1];
            int val2 = puzzle[row2][col2];

            puzzle[row1][col1] = 0;
            puzzle[row2][col2] = 0;

            if (hasUniqueSolution(puzzle)) {
                pairsRemoved++;
            } else {
                puzzle[row1][col1] = val1;
                puzzle[row2][col2] = val2;
            }
        }

        return puzzle;
    }

    private static List<int[]> generateSymmetricalPairs() {
        List<int[]> pairs = new ArrayList<>();
        int gs = GameConstants.GRID_SIZE;
        int half = (gs + 1) / 2;

        for (int row = 0; row < half; row++) {
            for (int col = 0; col < gs; col++) {
                int symRow = gs - 1 - row;
                int symCol = gs - 1 - col;

                if (row == gs / 2 && col == gs / 2) {
                    continue;
                }

                pairs.add(new int[] { row, col, symRow, symCol });
            }
        }

        return pairs;
    }
}