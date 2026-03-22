package com.resumehelper.backend.resume;

import com.resumehelper.backend.resume.repository.ResumeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.resumehelper.backend.job.scraper.BongThomScraper;
import com.resumehelper.backend.job.scraper.LinkedInScraper;
import com.resumehelper.backend.job.scraper.RemoteOkScraper;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ResumeApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ResumeRepository resumeRepository;

    // Mock scrapers so Spring context loads cleanly
    @MockBean private BongThomScraper bongThomScraper;
    @MockBean private LinkedInScraper linkedInScraper;
    @MockBean private RemoteOkScraper remoteOkScraper;

    @BeforeEach
    void setUp() {
        resumeRepository.deleteAll();
        when(bongThomScraper.scrape()).thenReturn(List.of());
        when(linkedInScraper.scrape()).thenReturn(List.of());
        when(remoteOkScraper.scrape()).thenReturn(List.of());
    }

    @Test
    void getAll_emptyInitially() throws Exception {
        mockMvc.perform(get("/api/resumes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void upload_thenGetAll_returnsOne() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "cv.pdf", "application/pdf", "pdf-bytes".getBytes());

        mockMvc.perform(multipart("/api/resumes/upload").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fileName").value("cv.pdf"))
                .andExpect(jsonPath("$.fileType").value("application/pdf"));

        mockMvc.perform(get("/api/resumes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void upload_thenDelete_removesResume() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "cv.pdf", "application/pdf", "pdf-bytes".getBytes());

        String response = mockMvc.perform(multipart("/api/resumes/upload").file(file))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Extract id from response
        Long id = com.fasterxml.jackson.databind.json.JsonMapper.builder().build()
                .readTree(response).get("id").asLong();

        mockMvc.perform(delete("/api/resumes/" + id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/resumes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }
}
