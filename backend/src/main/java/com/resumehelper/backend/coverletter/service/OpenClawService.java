package com.resumehelper.backend.coverletter.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class OpenClawService {

    private static final String API_URL = "https://api.openai.com/v1/chat/completions";
    private static final String MODEL = "gpt-3.5-turbo";

    @Value("${openclaw.api.key}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateCoverLetter(String resumeText, String jobDescription) {
        try {
            String prompt = buildPrompt(resumeText, jobDescription);

            ObjectNode body = objectMapper.createObjectNode();
            body.put("model", MODEL);
            body.put("max_tokens", 800);

            ArrayNode messages = body.putArray("messages");
            ObjectNode userMsg = messages.addObject();
            userMsg.put("role", "user");
            userMsg.put("content", prompt);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("OpenAI API error: " + response.statusCode() + " " + response.body());
            }

            JsonNode json = objectMapper.readTree(response.body());
            return json.at("/choices/0/message/content").asText();

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate cover letter", e);
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
