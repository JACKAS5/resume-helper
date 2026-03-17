package com.resumehelper.backend.job.scraper;

import com.resumehelper.backend.job.entity.Job;
import java.util.List;

public interface JobScraper {
    List<Job> scrape(); // return a list of scraped jobs
}
