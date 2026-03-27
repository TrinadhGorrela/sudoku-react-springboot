package com.sudoku.dto.response;

import com.sudoku.util.SmartHintGenerator;

public class HintResponse {
    private int row;
    private int col;
    private int value;
    private String strategy;
    private String explanation;

    public HintResponse(SmartHintGenerator.HintInfo hintInfo) {
        this.row = hintInfo.row;
        this.col = hintInfo.col;
        this.value = hintInfo.value;
        this.strategy = hintInfo.strategy;
        this.explanation = hintInfo.explanation;
    }

    public HintResponse() {
    }

    public int getRow() {
        return row;
    }

    public void setRow(int row) {
        this.row = row;
    }

    public int getCol() {
        return col;
    }

    public void setCol(int col) {
        this.col = col;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public String getStrategy() {
        return strategy;
    }

    public void setStrategy(String strategy) {
        this.strategy = strategy;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

}