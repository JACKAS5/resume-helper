package com.resumehelper.backend.coverletter.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Scanner;

@Service
public class OpenClawService {

    @Value("${local.ai.url}")
    private String apiUrl;

    @Value("${local.ai.model}")
    private String model;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateCoverLetter(String resumeText, String jobDescription) {
        return callLocalAi(buildPrompt(resumeText, jobDescription));
    }

    public String rankResumeAgainstJob(String resumeText, String jobDescription) {
        String prompt = """
                Compare the resume and job description below. 
                Return a JSON object with:
                1. "score": an integer 0-100 representing how well the candidate fits.
                2. "explanation": a 1-sentence explanation.

                RESUME:
                %s

                JOB DESCRIPTION:
                %s
                """.formatted(resumeText, jobDescription);
        return callLocalAi(prompt);
    }

    private String callLocalAi(String prompt) {
        try {
            ObjectNode body = objectMapper.createObjectNode();
            body.put("model", model);
            body.put("prompt", prompt);
            body.put("stream", false); // Disable streaming for easier handling

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Local AI error: " + response.statusCode() + " " + response.body());
            }

            JsonNode json = objectMapper.readTree(response.body());
            return json.get("response").asText();

        } catch (Exception e) {
            throw new RuntimeException("Failed to call Local AI (Ollama)", e);
        }
    }

    private String buildPrompt(String resumeText, String jobDescription) {
        return """
                You are a professional career coach. Write a tailored, concise cover letter (3-4 paragraphs) \
                based on the resume and job description below.

                RESUME:
                %s

                JOB DESCRIPTION:
                %s

                Write the cover letter in a professional tone. Do not include placeholders like [Your Name].
                """.formatted(resumeText, jobDescription);
    }
}
