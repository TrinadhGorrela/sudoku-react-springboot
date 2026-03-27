package com.sudoku.controller;

import com.sudoku.dto.response.AuthResponse;
import com.sudoku.dto.request.LoginRequest;
import com.sudoku.dto.request.RegisterRequest;
import com.sudoku.dto.UserStatsDTO;
import com.sudoku.entity.User;
import com.sudoku.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * Register a new user (converting from anonymous)
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request,
            @RequestHeader(value = "X-Anonymous-Token", required = false) String anonymousToken) {
        
        try {
            User user;
            
            // Check if converting from anonymous user
            if (anonymousToken != null && !anonymousToken.isEmpty()) {
                user = userService.registerAnonymousUser(
                    anonymousToken, 
                    request.getUsername(), 
                    request.getEmail(), 
                    request.getPassword()
                );
            } else {
                // New registration without anonymous conversion
                user = userService.registerNewUser(
                    request.getUsername(), 
                    request.getEmail(), 
                    request.getPassword()
                );
            }
            
            AuthResponse response = new AuthResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getUserType().toString(),
                user.getAnonymousToken()
            );
            response.setMessage("Registration successful!");
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse());
        }
    }
    
    /**
     * Login for registered users
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            User user = userService.login(request.getUsernameOrEmail(), request.getPassword());
            
            AuthResponse response = new AuthResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getUserType().toString(),
                user.getAnonymousToken()
            );
            response.setMessage("Login successful!");
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            AuthResponse errorResponse = new AuthResponse();
            errorResponse.setMessage(e.getMessage());
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
    
    /**
     * Get user statistics
     */
    @GetMapping("/{userId}/stats")
    public ResponseEntity<?> getUserStats(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            
            UserStatsDTO stats = new UserStatsDTO();
            stats.setUserId(user.getId());
            stats.setUsername(user.getUsername());
            stats.setUserType(user.getUserType().toString());
            stats.setTotalGamesPlayed(user.getTotalGamesPlayed());
            stats.setGamesWon(user.getGamesWon());
            stats.setBestTimeEasy(user.getBestTimeEasy());
            stats.setBestTimeMedium(user.getBestTimeMedium());
            stats.setBestTimeHard(user.getBestTimeHard());
            stats.setBestTimeExpert(user.getBestTimeExpert());
            stats.setBestTimeMaster(user.getBestTimeMaster());
            stats.setBestTimeExtreme(user.getBestTimeExtreme());
            
            return ResponseEntity.ok(stats);
            
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Initialize or get anonymous user (called on app load)
     */
    @PostMapping("/anonymous")
    public ResponseEntity<?> getOrCreateAnonymousUser(
            @RequestHeader(value = "X-Anonymous-Token", required = false) String anonymousToken) {
        
        try {
            if (anonymousToken == null || anonymousToken.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("Anonymous token required");
            }
            
            User user = userService.getOrCreateAnonymousUser(anonymousToken);
            
            AuthResponse response = new AuthResponse(
                user.getId(),
                null, // No username for anonymous
                null, // No email for anonymous
                user.getUserType().toString(),
                user.getAnonymousToken()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}