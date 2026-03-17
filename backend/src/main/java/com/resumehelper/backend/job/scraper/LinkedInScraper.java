package com.resumehelper.backend.job.scraper;

import com.resumehelper.backend.job.entity.Job;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class LinkedInScraper implements JobScraper {

    private static final String BASE_URL =
            "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search" +
            "?keywords=software+engineer+developer+IT&location=Cambodia&start=";
    private static final String BASE_URL_2 =
            "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search" +
            "?keywords=data+analyst+devops+cloud&location=Cambodia&start=";
    private static final int PAGES = 5; // 5 x 10 = up to 50 jobs per keyword set

    @Override
    public List<Job> scrape() {
        List<Job> jobs = new ArrayList<>();
        scrapeKeyword(BASE_URL, jobs);
        scrapeKeyword(BASE_URL_2, jobs);
        System.out.println("[LinkedIn] scraped " + jobs.size() + " jobs total");
        return jobs;
    }

    private void scrapeKeyword(String baseUrl, List<Job> jobs) {
        for (int page = 0; page < PAGES; page++) {
            try {
                Document doc = Jsoup.connect(baseUrl + (page * 10))
                        .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                        .header("Accept-Language", "en-US,en;q=0.9")
                        .timeout(15_000)
                        .get();

                Elements cards = doc.select("div.base-search-card");
                if (cards.isEmpty()) break;

                for (Element card : cards) {
                    String title = text(card, "h3.base-search-card__title");
                    String company = text(card, "h4.base-search-card__subtitle");
                    String location = text(card, "span.job-search-card__location");
                    Element link = card.selectFirst("a.base-card__full-link");
                    String url = link != null ? cleanUrl(link.attr("href")) : "";

                    if (!title.isEmpty()) {
                        jobs.add(new Job(title, company, location, "", url, LocalDateTime.now()));
                    }
                }
            } catch (Exception e) {
                System.err.println("[LinkedIn] page " + page + " failed: " + e.getMessage());
                break;
            }
        }
    }

    private String text(Element parent, String cssQuery) {
        Element el = parent.selectFirst(cssQuery);
        return el != null ? el.text().trim() : "";
    }

    // Strip tracking params — keep only the base job URL
    private String cleanUrl(String url) {
        int idx = url.indexOf('?');
        return idx > 0 ? url.substring(0, idx) : url;
    }
}
