package com.resumehelper.backend.coverletter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumehelper.backend.coverletter.repository.CoverLetterRepository;
import com.resumehelper.backend.coverletter.service.OpenClawService;
import com.resumehelper.backend.job.scraper.BongThomScraper;
import com.resumehelper.backend.job.scraper.LinkedInScraper;
import com.resumehelper.backend.job.scraper.RemoteOkScraper;
import com.resumehelper.backend.resume.repository.ResumeRepository;
import com.resumehelper.backend.resume.entity.Resume;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CoverLetterApiIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private CoverLetterRepository coverLetterRepository;
    @Autowired private ResumeRepository resumeRepository;

    // Mock OpenClaw so no real API calls are made in tests
    @MockBean private OpenClawService openClawService;

    // Mock scrapers so context loads cleanly
    @MockBean private BongThomScraper bongThomScraper;
    @MockBean private LinkedInScraper linkedInScraper;
    @MockBean private RemoteOkScraper remoteOkScraper;

    private Long savedResumeId;

    @BeforeEach
    void setUp() {
        coverLetterRepository.deleteAll();
        resumeRepository.deleteAll();

        when(bongThomScraper.scrape()).thenReturn(List.of());
        when(linkedInScraper.scrape()).thenReturn(List.of());
        when(remoteOkScraper.scrape()).thenReturn(List.of());
        when(openClawService.generateCoverLetter(anyString(), anyString()))
                .thenReturn("Dear Hiring Manager, I am excited to apply...");

        // Save a real PDF-like resume (plain text bytes, type set to trigger text path)
        Resume resume = new Resume("cv.txt", "text/plain", "Java developer with 3 years experience".getBytes(), LocalDateTime.now());
        savedResumeId = resumeRepository.save(resume).getId();
    }

    @Test
    void getAll_emptyInitially() throws Exception {
        mockMvc.perform(get("/api/coverletters"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void generate_savesAndReturnsCoverLetter() throws Exception {
        String body = objectMapper.writeValueAsString(
                Map.of("resumeId", savedResumeId, "jobDescription", "We need a Java backend developer"));

        mockMvc.perform(post("/api/coverletters/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Dear Hiring Manager, I am excited to apply..."))
                .andExpect(jsonPath("$.resumeId").value(savedResumeId));

        mockMvc.perform(get("/api/coverletters"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void generate_thenDelete_removesLetter() throws Exception {
        String body = objectMapper.writeValueAsString(
                Map.of("resumeId", savedResumeId, "jobDescription", "Backend role"));

        String response = mockMvc.perform(post("/api/coverletters/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        Long id = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(delete("/api/coverletters/" + id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/coverletters"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void getByResumeId_returnsMatchingLetters() throws Exception {
        String body = objectMapper.writeValueAsString(
                Map.of("resumeId", savedResumeId, "jobDescription", "DevOps role"));

        mockMvc.perform(post("/api/coverletters/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/coverletters/resume/" + savedResumeId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].resumeId").value(savedResumeId));
    }
}
