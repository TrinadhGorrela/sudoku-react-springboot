package com.sudoku.service.impl;

import com.sudoku.service.UserService;

import com.sudoku.entity.User;
import com.sudoku.enums.UserType;
import com.sudoku.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    /**
     * Get or create anonymous user by token
     * This is called on EVERY request from frontend
     */
    public User getOrCreateAnonymousUser(String anonymousToken) {
        if (anonymousToken == null || anonymousToken.isEmpty()) {
            throw new RuntimeException("Anonymous token required");
        }
        
        // Try to find existing user
        Optional<User> existingUser = userRepository.findByAnonymousToken(anonymousToken);
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            // Update last active time
            user.setLastActive(LocalDateTime.now());
            userRepository.save(user);
            
            System.out.println("🔄 Returning user: " + user.getId() + 
                             " (Total games: " + user.getTotalGamesPlayed() + ")");
            return user;
        }
        
        // Create new anonymous user with the provided token
        User newUser = new User();
        newUser.setUserType(UserType.ANONYMOUS);
        newUser.setAnonymousToken(anonymousToken);
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setLastActive(LocalDateTime.now());
        
        User savedUser = userRepository.save(newUser);
        System.out.println("🆕 Created new anonymous user: " + savedUser.getId());
        
        return savedUser;
    }
    
    /**
     * Register a new user (not converting from anonymous)
     */
    @Transactional
    public User registerNewUser(String username, String email, String password) {
        // Validation
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already taken");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already taken");
        }
        
        // Create new registered user
        User user = new User();
        user.setUserType(UserType.REGISTERED);
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setAnonymousToken(UUID.randomUUID().toString()); // Generate token for session
        user.setRegisteredAt(LocalDateTime.now());
        user.setCreatedAt(LocalDateTime.now());
        user.setLastActive(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        System.out.println("✅ New registered user created: " + savedUser.getId() + " (" + username + ")");
        
        return savedUser;
    }
    
    /**
     * Convert anonymous user to registered user
     */
    @Transactional
    public User registerAnonymousUser(String anonymousToken, String username, String email, String password) {
        User user = userRepository.findByAnonymousToken(anonymousToken)
            .orElseThrow(() -> new RuntimeException("Anonymous user not found"));
        
        if (user.getUserType() == UserType.REGISTERED) {
            throw new RuntimeException("User already registered");
        }
        
        // Check if username/email already taken
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already taken");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already taken");
        }
        
        // Upgrade to registered user
        user.setUserType(UserType.REGISTERED);
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRegisteredAt(LocalDateTime.now());
        // Keep anonymousToken for session continuity
        
        User registered = userRepository.save(user);
        
        System.out.println("✅ User upgraded to registered: " + registered.getId() + 
                         " (" + username + ") with " + registered.getTotalGamesPlayed() + " games preserved");
        
        return registered;
    }
    
    /**
     * Login for registered users
     */
    public User login(String usernameOrEmail, String password) {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (user.getUserType() != UserType.REGISTERED) {
            throw new RuntimeException("User is not registered");
        }
        
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        user.setLastActive(LocalDateTime.now());
        userRepository.save(user);
        
        System.out.println("✅ User logged in: " + user.getUsername());
        return user;
    }
    
    /**
     * Get user by ID
     */
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    /**
     * Update user statistics after game completion
     */
    @Transactional
    public void updateUserStats(Long userId, String difficulty, long completionTime, int mistakes) {
        User user = getUserById(userId);
        
        // Increment games won
        user.setGamesWon(user.getGamesWon() + 1);
        
        // Update best time for this difficulty
        switch (difficulty.toLowerCase()) {
            case "easy":
                if (user.getBestTimeEasy() == null || completionTime < user.getBestTimeEasy()) {
                    user.setBestTimeEasy(completionTime);
                    System.out.println("🏆 New best time for EASY: " + completionTime);
                }
                break;
            case "medium":
                if (user.getBestTimeMedium() == null || completionTime < user.getBestTimeMedium()) {
                    user.setBestTimeMedium(completionTime);
                    System.out.println("🏆 New best time for MEDIUM: " + completionTime);
                }
                break;
            case "hard":
                if (user.getBestTimeHard() == null || completionTime < user.getBestTimeHard()) {
                    user.setBestTimeHard(completionTime);
                    System.out.println("🏆 New best time for HARD: " + completionTime);
                }
                break;
            case "expert":
                if (user.getBestTimeExpert() == null || completionTime < user.getBestTimeExpert()) {
                    user.setBestTimeExpert(completionTime);
                    System.out.println("🏆 New best time for EXPERT: " + completionTime);
                }
                break;
            case "master":
                if (user.getBestTimeMaster() == null || completionTime < user.getBestTimeMaster()) {
                    user.setBestTimeMaster(completionTime);
                    System.out.println("🏆 New best time for MASTER: " + completionTime);
                }
                break;
            case "extreme":
                if (user.getBestTimeExtreme() == null || completionTime < user.getBestTimeExtreme()) {
                    user.setBestTimeExtreme(completionTime);
                    System.out.println("🏆 New best time for EXTREME: " + completionTime);
                }
                break;
        }
        
        userRepository.save(user);
    }
    
    /**
     * Increment total games played (called when starting a new game)
     */
    @Transactional
    public void incrementGamesPlayed(Long userId) {
        User user = getUserById(userId);
        user.setTotalGamesPlayed(user.getTotalGamesPlayed() + 1);
        userRepository.save(user);
    }
}