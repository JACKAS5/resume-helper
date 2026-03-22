package com.resumehelper.backend.coverletter.controller;

import com.resumehelper.backend.coverletter.entity.CoverLetter;
import com.resumehelper.backend.coverletter.service.CoverLetterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coverletters")
public class CoverLetterController {

    private final CoverLetterService coverLetterService;

    public CoverLetterController(CoverLetterService coverLetterService) {
        this.coverLetterService = coverLetterService;
    }

    // POST /api/coverletters/generate
    // Body: { "resumeId": 1, "jobDescription": "..." }
    @PostMapping("/generate")
    public ResponseEntity<CoverLetter> generate(@RequestBody Map<String, Object> body) throws IOException {
        Long resumeId = Long.valueOf(body.get("resumeId").toString());
        String jobDescription = body.get("jobDescription").toString();
        return ResponseEntity.ok(coverLetterService.generate(resumeId, jobDescription));
    }

    // GET /api/coverletters
    @GetMapping
    public ResponseEntity<List<CoverLetter>> getAll() {
        return ResponseEntity.ok(coverLetterService.getAll());
    }

    // GET /api/coverletters/{id}
    @GetMapping("/{id}")
    public ResponseEntity<CoverLetter> getById(@PathVariable Long id) {
        return ResponseEntity.ok(coverLetterService.getById(id));
    }

    // GET /api/coverletters/resume/{resumeId}
    @GetMapping("/resume/{resumeId}")
    public ResponseEntity<List<CoverLetter>> getByResumeId(@PathVariable Long resumeId) {
        return ResponseEntity.ok(coverLetterService.getByResumeId(resumeId));
    }

    // DELETE /api/coverletters/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        coverLetterService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
