package com.resumehelper.backend.job.scraper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumehelper.backend.job.entity.Job;
import org.jsoup.Jsoup;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
public class RemoteOkScraper implements JobScraper {

    private static final String API_URL = "https://remoteok.com/api";
    private static final Set<String> TECH_KEYWORDS = Set.of(
            "software", "developer", "engineer", "programmer", "web", "mobile",
            "android", "ios", "frontend", "backend", "fullstack", "full stack",
            "devops", "cloud", "data", "database", "network", "system", "cyber",
            "security", "ai", "machine learning", "java", "python", "javascript",
            "typescript", "react", "spring", "sql", "tech", "computer", "it",
            "qa", "tester", "analyst", "infrastructure", "golang", "rust", "kotlin"
    );

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public List<Job> scrape() {
        List<Job> jobs = new ArrayList<>();
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL))
                    .header("User-Agent", "Mozilla/5.0")
                    .GET()
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            JsonNode root = objectMapper.readTree(response.body());
            for (JsonNode node : root) {
                String position = node.path("position").asText("");
                if (position.isEmpty() || !isTechJob(position)) continue;

                String company = node.path("company").asText("");
                String location = node.path("location").asText("Remote");
                String url = node.path("url").asText("");
                String rawDesc = node.path("description").asText("");
                String description = Jsoup.parse(rawDesc).text();

                if (location.isBlank()) location = "Remote";

                jobs.add(new Job(position, company, location, description, url, LocalDateTime.now()));
            }
            System.out.println("[RemoteOK] scraped " + jobs.size() + " tech jobs");
        } catch (Exception e) {
            System.err.println("[RemoteOK] failed: " + e.getMessage());
        }
        return jobs;
    }

    private boolean isTechJob(String title) {
        String lower = title.toLowerCase();
        return TECH_KEYWORDS.stream().anyMatch(lower::contains);
    }
}
