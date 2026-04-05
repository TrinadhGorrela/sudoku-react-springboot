package com.sudoku.exception;

public final class GameExceptions {

    private GameExceptions() {}

    public static final class NotFound extends RuntimeException {
        public NotFound(String gameId) {
            super("Game not found: " + gameId);
        }
    }

    public static final class Completed extends RuntimeException {
        public Completed() {
            super("Game already completed");
        }

        public Completed(String message) {
            super(message);
        }
    }

    public static final class NoMovesToUndo extends RuntimeException {
        public NoMovesToUndo() {
            super("No moves to undo");
        }
    }

    public static final class HintNotAvailable extends RuntimeException {
        public HintNotAvailable() {
            super("No hint available");
        }
    }
}
