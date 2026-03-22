package com.resumehelper.backend.coverletter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumehelper.backend.coverletter.controller.CoverLetterController;
import com.resumehelper.backend.coverletter.entity.CoverLetter;
import com.resumehelper.backend.coverletter.service.CoverLetterService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CoverLetterController.class)
class CoverLetterControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean  private CoverLetterService coverLetterService;

    @Test
    void getAll_returnsOk() throws Exception {
        when(coverLetterService.getAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/coverletters"))
                .andExpect(status().isOk());
    }

    @Test
    void generate_returnsCreatedLetter() throws Exception {
        CoverLetter letter = new CoverLetter(1L, "Job desc", "Dear Hiring Manager...", LocalDateTime.now());
        when(coverLetterService.generate(anyLong(), anyString())).thenReturn(letter);

        String body = objectMapper.writeValueAsString(Map.of("resumeId", 1, "jobDescription", "Job desc"));

        mockMvc.perform(post("/api/coverletters/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Dear Hiring Manager..."));
    }

    @Test
    void getById_returnsLetter() throws Exception {
        CoverLetter letter = new CoverLetter(1L, "Job desc", "Content here", LocalDateTime.now());
        when(coverLetterService.getById(1L)).thenReturn(letter);

        mockMvc.perform(get("/api/coverletters/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Content here"));
    }

    @Test
    void delete_returnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/coverletters/1"))
                .andExpect(status().isNoContent());
    }
}
