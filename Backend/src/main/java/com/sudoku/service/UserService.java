package com.sudoku.service;

import com.sudoku.entity.User;

public interface UserService {
    User getOrCreateAnonymousUser(String anonymousToken);
    User registerNewUser(String username, String email, String password);
    User registerAnonymousUser(String anonymousToken, String username, String email, String password);
    User login(String usernameOrEmail, String password);
    User getUserById(Long userId);
    void updateUserStats(Long userId, String difficulty, long completionTime, int mistakes);
    void incrementGamesPlayed(Long userId);
}
