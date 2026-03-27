package com.sudoku.enums;

public enum Difficulty {
    EASY("easy"),
    MEDIUM("medium"),
    HARD("hard"),
    EXPERT("expert"),
    MASTER("master"),
    EXTREME("extreme");
    
    private final String value;
    
    Difficulty(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
    
    public static Difficulty fromString(String text) {
        for (Difficulty difficulty : Difficulty.values()) {
            if (difficulty.value.equalsIgnoreCase(text)) {
                return difficulty;
            }
        }
        return MEDIUM; 
    }
}