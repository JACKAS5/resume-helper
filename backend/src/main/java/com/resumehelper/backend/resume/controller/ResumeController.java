package com.resumehelper.backend.resume.controller;

import com.resumehelper.backend.resume.entity.Resume;
import com.resumehelper.backend.resume.service.ResumeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    // POST /api/resumes/upload
    @PostMapping("/upload")
    public ResponseEntity<Resume> upload(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(resumeService.upload(file));
    }

    // GET /api/resumes
    @GetMapping
    public ResponseEntity<List<Resume>> getAll() {
        return ResponseEntity.ok(resumeService.getAll());
    }

    // GET /api/resumes/{id}/download
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        Resume resume = resumeService.getById(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resume.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(resume.getFileType()))
                .body(resume.getData());
    }

    // GET /api/resumes/{id}/parse
    @GetMapping("/{id}/parse")
    public ResponseEntity<String> parse(@PathVariable Long id) throws IOException {
        return ResponseEntity.ok(resumeService.parseText(id));
    }

    // DELETE /api/resumes/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        resumeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
