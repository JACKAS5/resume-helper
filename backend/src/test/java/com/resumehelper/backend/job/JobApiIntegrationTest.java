package com.resumehelper.backend.job;

import com.resumehelper.backend.job.entity.Job;
import com.resumehelper.backend.job.repository.JobRepository;
import com.resumehelper.backend.job.scraper.BongThomScraper;
import com.resumehelper.backend.job.scraper.LinkedInScraper;
import com.resumehelper.backend.job.scraper.RemoteOkScraper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class JobApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JobRepository jobRepository;

    @MockBean
    private BongThomScraper bongThomScraper;

    @MockBean
    private LinkedInScraper linkedInScraper;

    @MockBean
    private RemoteOkScraper remoteOkScraper;

    @BeforeEach
    void setUp() {
        jobRepository.deleteAll();
        when(bongThomScraper.scrape()).thenReturn(List.of());
        when(linkedInScraper.scrape()).thenReturn(List.of());
        when(remoteOkScraper.scrape()).thenReturn(List.of());
    }

    @Test
    void testGetAllJobs_ReturnsEmptyList() throws Exception {
        mockMvc.perform(get("/api/jobs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void testGetAllJobs_ReturnsSavedJobs() throws Exception {
        jobRepository.save(new Job("Dev", "Acme", "Phnom Penh", "Backend role", "http://example.com/1", LocalDateTime.now()));
        jobRepository.save(new Job("QA", "Beta", "Siem Reap", "QA role", "http://example.com/2", LocalDateTime.now()));

        mockMvc.perform(get("/api/jobs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title", is("Dev")))
                .andExpect(jsonPath("$[1].title", is("QA")));
    }

    @Test
    void testScrapeJobs_SavesScrapedJobs() throws Exception {
        Job scraped = new Job("Scraper Dev", "Corp", "Phnom Penh", "Scraped role", "http://example.com/3", LocalDateTime.now());
        when(bongThomScraper.scrape()).thenReturn(List.of(scraped));

        mockMvc.perform(post("/api/jobs/scrape"))
                .andExpect(status().isOk())
                .andExpect(content().string("Jobs scraped and saved successfully!"));

        mockMvc.perform(get("/api/jobs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Scraper Dev")));
    }

    @Test
    void testScrapeJobs_NoDuplicates() throws Exception {
        Job existing = new Job("Dev", "Acme", "Phnom Penh", "Backend role", "http://example.com/1", LocalDateTime.now());
        jobRepository.save(existing);

        Job duplicate = new Job("Dev", "Acme", "Phnom Penh", "Backend role", "http://example.com/1", LocalDateTime.now());
        when(bongThomScraper.scrape()).thenReturn(List.of(duplicate));

        mockMvc.perform(post("/api/jobs/scrape")).andExpect(status().isOk());

        mockMvc.perform(get("/api/jobs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }
}
