package com.sudoku.dto.response;

public class AuthResponse {
    private Long userId;
    private String username;
    private String email;
    private String userType;
    private String anonymousToken;
    private String message;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(Long userId, String username, String email, String userType, String anonymousToken) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.userType = userType;
        this.anonymousToken = anonymousToken;
    }
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getUserType() {
        return userType;
    }
    
    public void setUserType(String userType) {
        this.userType = userType;
    }
    
    public String getAnonymousToken() {
        return anonymousToken;
    }
    
    public void setAnonymousToken(String anonymousToken) {
        this.anonymousToken = anonymousToken;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}