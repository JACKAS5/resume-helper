package com.resumehelper.backend.job.scheduler;

import com.resumehelper.backend.job.service.JobService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class JobScheduler {

    private final JobService jobService;

    public JobScheduler(JobService jobService) {
        this.jobService = jobService;
    }

    @Scheduled(cron = "0 0 */6 * * *")
    public void runScraper() {
        System.out.println("Starting scheduled job scraping...");
        jobService.scrapeAndSaveJobs();
        System.out.println("Scheduled job scraping finished.");
    }
}
