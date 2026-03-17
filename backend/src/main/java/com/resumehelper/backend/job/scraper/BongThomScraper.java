package com.resumehelper.backend.job.scraper;

import com.resumehelper.backend.job.entity.Job;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.parser.Parser;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Component
public class BongThomScraper implements JobScraper {

    private static final String RSS_URL = "https://bongthom.com/rss.xml";
    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("EEE, dd MMM yyyy HH:mm:ss Z", Locale.ENGLISH);
    private static final Set<String> TECH_KEYWORDS = Set.of(
            "software", "developer", "engineer", "programmer", "web", "mobile",
            "android", "ios", "frontend", "backend", "fullstack", "full stack",
            "devops", "cloud", "data", "database", "network", "system", "cyber",
            "security", "ai", "machine learning", "java", "python", "javascript",
            "react", "spring", "sql", "tech", "computer", "it ", "i.t", "qa",
            "tester", "analyst", "infrastructure", "support", "helpdesk"
    );

    @Override
    public List<Job> scrape() {
        List<Job> jobs = new ArrayList<>();
        try {
            Document doc = Jsoup.connect(RSS_URL)
                    .userAgent("Mozilla/5.0")
                    .timeout(10_000)
                    .parser(Parser.xmlParser())
                    .get();

            for (Element item : doc.select("item")) {
                String title = text(item, "title");
                if (title.isEmpty() || !isTechJob(title)) continue;

                String url = text(item, "link");
                String rawDesc = text(item, "description");
                String company = extractCompany(Jsoup.parse(rawDesc).text());
                LocalDateTime postedAt = parseDate(text(item, "pubDate"));

                jobs.add(new Job(title, company, "Cambodia", "", url, postedAt));
            }
            System.out.println("[BongThom] scraped " + jobs.size() + " tech jobs");
        } catch (Exception e) {
            System.err.println("[BongThom] failed: " + e.getMessage());
        }
        return jobs;
    }

    private boolean isTechJob(String title) {
        String lower = title.toLowerCase();
        return TECH_KEYWORDS.stream().anyMatch(lower::contains);
    }

    private String text(Element parent, String tag) {
        Element el = parent.selectFirst(tag);
        return el != null ? el.text().trim() : "";
    }

    private String extractCompany(String description) {
        int idx = description.indexOf("Employer:");
        return idx >= 0 ? description.substring(idx + 9).trim() : "";
    }

    private LocalDateTime parseDate(String pubDate) {
        try {
            return LocalDateTime.parse(pubDate, DATE_FORMAT);
        } catch (DateTimeParseException e) {
            return LocalDateTime.now();
        }
    }
}
