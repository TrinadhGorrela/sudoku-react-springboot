package com.sudoku.dto.request;

import java.util.List;

public class NotesUpdateRequest {
    private List<List<List<Integer>>> notes;

    public NotesUpdateRequest() {}

    public List<List<List<Integer>>> getNotes() {
        return notes;
    }

    public void setNotes(List<List<List<Integer>>> notes) {
        this.notes = notes;
    }
}