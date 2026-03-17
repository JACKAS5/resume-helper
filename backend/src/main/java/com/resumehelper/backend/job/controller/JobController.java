package com.resumehelper.backend.job.controller;

import com.resumehelper.backend.job.entity.Job;
import com.resumehelper.backend.job.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs") // clearer base path
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // GET /api/jobs
    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        List<Job> jobs = jobService.getAllJobs();
        return ResponseEntity.ok(jobs);
    }

    // POST /api/jobs/scrape
    @PostMapping("/scrape")
    public ResponseEntity<String> scrapeJobs() {
        jobService.scrapeAndSaveJobs();
        return ResponseEntity.ok("Jobs scraped and saved successfully!");
    }
}