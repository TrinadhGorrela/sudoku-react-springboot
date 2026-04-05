package com.sudoku.controller;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.sudoku.dto.response.GameResponse;
import com.sudoku.dto.GameState;
import com.sudoku.dto.response.HintResponse;
import com.sudoku.dto.request.MoveRequest;
import com.sudoku.dto.request.NotesUpdateRequest;
import com.sudoku.dto.response.ValidationResponse;
import com.sudoku.enums.Difficulty;
import com.sudoku.exception.GameExceptions;
import com.sudoku.service.GameService;
import com.sudoku.util.SmartHintGenerator;

@RestController
@RequestMapping("/api/game")
public class GameController {

    @Autowired
    private GameService gameService;

    @PostMapping("/start")
    public ResponseEntity<?> startGame(
            @RequestParam(defaultValue = "MEDIUM") String difficulty) {
        try {
            Difficulty difficultyEnum = Difficulty.fromString(difficulty);
            GameState gameState = gameService.createGame(difficultyEnum.getValue());
            return ResponseEntity.ok(new GameResponse(gameState));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Internal server error"));
        }
    }

    @GetMapping("/{gameId}")
    public ResponseEntity<?> getGame(@PathVariable String gameId) {
        try {
            GameState gameState = gameService.getGameState(gameId);
            return ResponseEntity.ok(new GameResponse(gameState));
        } catch (GameExceptions.NotFound e) {
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{gameId}/move")
    public ResponseEntity<?> makeMove(
            @PathVariable String gameId,
            @Validated @RequestBody MoveRequest moveRequest) {
        try {
            int row = moveRequest.getRow();
            int col = moveRequest.getCol();
            int value = moveRequest.getValue();
            GameState updatedGame = gameService.makeMove(gameId, row, col, value);
            return ResponseEntity.ok(new GameResponse(updatedGame));
        } catch (GameExceptions.NotFound e) {
            return ResponseEntity.notFound().build();
        } catch (GameExceptions.Completed e) {
            return ResponseEntity.status(409).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{gameId}/undo")
    public ResponseEntity<?> undoMove(@PathVariable String gameId) {
        try {
            GameState gameState = gameService.undoMove(gameId);
            return ResponseEntity.ok(new GameResponse(gameState));
        } catch (GameExceptions.NotFound e) {
            return ResponseEntity.notFound().build();
        } catch (GameExceptions.NoMovesToUndo e) {
            return ResponseEntity.status(400).body(Map.of("error", "No moves to undo"));
        } catch (GameExceptions.Completed e) {
            return ResponseEntity.status(409).body(Map.of("error", "Cannot undo - game is completed"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{gameId}/notes")
    public ResponseEntity<?> updateNotes(
            @PathVariable String gameId,
            @RequestBody NotesUpdateRequest request) {
        try {
            GameState game = gameService.saveNotes(gameId, request.getNotes());
            return ResponseEntity.ok(new GameResponse(game));
        } catch (GameExceptions.NotFound e) {
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{gameId}/hint")
    public ResponseEntity<?> getHint(@PathVariable String gameId) {
        try {
            SmartHintGenerator.HintInfo hintInfo = gameService.getHint(gameId);
            return ResponseEntity.ok(new HintResponse(hintInfo));
        } catch (GameExceptions.NotFound e) {
            return ResponseEntity.notFound().build();
        } catch (GameExceptions.Completed e) {
            return ResponseEntity.status(409).build();
        } catch (GameExceptions.HintNotAvailable e) {
            return ResponseEntity.status(404).body(Map.of("error", "No hint available"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{gameId}")
    public ResponseEntity<?> deleteGame(@PathVariable String gameId) {
        if (!gameService.gameExists(gameId)) {
            return ResponseEntity.notFound().build();
        }
        gameService.deleteGame(gameId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{gameId}/validate")
    public ResponseEntity<?> validateSolution(@PathVariable String gameId) {
        try {
            boolean isValid = gameService.validateSolution(gameId);
            ValidationResponse response = new ValidationResponse(
                    isValid,
                    isValid ? "Puzzle solved correctly!" : "Puzzle contains errors");
            return ResponseEntity.ok(response);
        } catch (GameExceptions.NotFound e) {
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
