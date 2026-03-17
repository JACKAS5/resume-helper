package com.resumehelper.backend.job.service;

import com.resumehelper.backend.job.entity.Job;
import com.resumehelper.backend.job.repository.JobRepository;
import com.resumehelper.backend.job.scraper.JobScraper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JobServiceTest {

    private JobRepository jobRepository;
    private JobScraper scraper;
    private JobService jobService;

    @BeforeEach
    void setUp() {
        jobRepository = mock(JobRepository.class);
        scraper = mock(JobScraper.class);
        jobService = new JobService(jobRepository, List.of(scraper));
    }

    @Test
    void testGetAllJobs() {
        Job job1 = new Job("Dev", "Acme", "Phnom Penh", "Backend role", "http://example.com/1", LocalDateTime.now());
        Job job2 = new Job("QA", "Beta", "Siem Reap", "QA role", "http://example.com/2", LocalDateTime.now());
        when(jobRepository.findAll()).thenReturn(List.of(job1, job2));

        List<Job> jobs = jobService.getAllJobs();

        assertEquals(2, jobs.size());
        assertEquals("Dev", jobs.get(0).getTitle());
    }

    @Test
    void testScrapeAndSaveJobs_SavesScrapedJobs() {
        Job scraped = new Job("Dev", "Acme", "Phnom Penh", "Backend role", "http://example.com/1", LocalDateTime.now());
        when(scraper.scrape()).thenReturn(List.of(scraped));
        when(jobRepository.findByUrl("http://example.com/1")).thenReturn(java.util.Optional.empty());

        jobService.scrapeAndSaveJobs();

        verify(jobRepository, times(1)).save(scraped);
    }

    @Test
    void testScrapeAndSaveJobs_EmptyResult() {
        when(scraper.scrape()).thenReturn(List.of());

        jobService.scrapeAndSaveJobs();

        verify(jobRepository, never()).save(any());
    }
}
