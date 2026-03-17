package com.resumehelper.backend.job.service;

import com.resumehelper.backend.job.entity.Job;
import com.resumehelper.backend.job.repository.JobRepository;
import com.resumehelper.backend.job.scraper.JobScraper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final List<JobScraper> scrapers;

    public JobService(JobRepository jobRepository, List<JobScraper> scrapers) {
        this.jobRepository = jobRepository;
        this.scrapers = scrapers;
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public void scrapeAndSaveJobs() {
        for (JobScraper scraper : scrapers) {
            List<Job> jobs = scraper.scrape();
            for (Job job : jobs) {
                if (jobRepository.findByUrl(job.getUrl()).isEmpty()) {
                    jobRepository.save(job);
                }
            }
        }
    }
}
