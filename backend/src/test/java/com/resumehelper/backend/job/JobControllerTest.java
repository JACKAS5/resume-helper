package com.resumehelper.backend.job;

import com.resumehelper.backend.job.controller.JobController;
import com.resumehelper.backend.job.service.JobService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@WebMvcTest(JobController.class)
class JobControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JobService jobService; // Controller dependency

    @Test
    void testGetAllJobsEndpoint() throws Exception {
        // Perform GET /jobs
        mockMvc.perform(get("/api/jobs"))
                .andExpect(status().isOk());

        // Verify the service method was called
        verify(jobService, times(1)).getAllJobs();
    }

    @Test
    void testScrapeJobsEndpoint() throws Exception {
        // Mock the service method to do nothing
        doNothing().when(jobService).scrapeAndSaveJobs();

        // Perform POST /jobs/scrape
        mockMvc.perform(post("/api/jobs/scrape"))
                .andExpect(status().isOk())
                .andExpect(content().string("Jobs scraped and saved successfully!"));

        // Verify the service method was called once
        verify(jobService, times(1)).scrapeAndSaveJobs();
    }
}