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

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional
    public User registerNewUser(String username, String email, String password) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already taken");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already taken");
        }
        User user = new User();
        user.setUserType(UserType.REGISTERED);
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRegisteredAt(LocalDateTime.now());
        user.setCreatedAt(LocalDateTime.now());
        user.setLastActive(LocalDateTime.now());
        return userRepository.save(user);
    }

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
        return user;
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public void updateUserStats(Long userId, String difficulty, long completionTime, int mistakes) {
        User user = getUserById(userId);
        user.setGamesWon(user.getGamesWon() + 1);
        switch (difficulty.toLowerCase()) {
            case "easy":
                if (user.getBestTimeEasy() == null || completionTime < user.getBestTimeEasy())
                    user.setBestTimeEasy(completionTime);
                break;
            case "medium":
                if (user.getBestTimeMedium() == null || completionTime < user.getBestTimeMedium())
                    user.setBestTimeMedium(completionTime);
                break;
            case "hard":
                if (user.getBestTimeHard() == null || completionTime < user.getBestTimeHard())
                    user.setBestTimeHard(completionTime);
                break;
            case "expert":
                if (user.getBestTimeExpert() == null || completionTime < user.getBestTimeExpert())
                    user.setBestTimeExpert(completionTime);
                break;
            case "master":
                if (user.getBestTimeMaster() == null || completionTime < user.getBestTimeMaster())
                    user.setBestTimeMaster(completionTime);
                break;
            case "extreme":
                if (user.getBestTimeExtreme() == null || completionTime < user.getBestTimeExtreme())
                    user.setBestTimeExtreme(completionTime);
                break;
        }
        userRepository.save(user);
    }

    @Transactional
    public void incrementGamesPlayed(Long userId) {
        User user = getUserById(userId);
        user.setTotalGamesPlayed(user.getTotalGamesPlayed() + 1);
        userRepository.save(user);
    }
}