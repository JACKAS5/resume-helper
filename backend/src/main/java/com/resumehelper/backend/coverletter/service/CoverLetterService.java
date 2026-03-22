package com.resumehelper.backend.coverletter.service;

import com.resumehelper.backend.coverletter.entity.CoverLetter;
import com.resumehelper.backend.coverletter.repository.CoverLetterRepository;
import com.resumehelper.backend.resume.service.ResumeService;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CoverLetterService {

    private final CoverLetterRepository coverLetterRepository;
    private final ResumeService resumeService;
    private final OpenClawService openClawService;

    public CoverLetterService(CoverLetterRepository coverLetterRepository,
                               ResumeService resumeService,
                               OpenClawService openClawService) {
        this.coverLetterRepository = coverLetterRepository;
        this.resumeService = resumeService;
        this.openClawService = openClawService;
    }

    public CoverLetter generate(Long resumeId, String jobDescription) throws IOException {
        String resumeText = resumeService.parseText(resumeId);
        String content = openClawService.generateCoverLetter(resumeText, jobDescription);
        CoverLetter letter = new CoverLetter(resumeId, jobDescription, content, LocalDateTime.now());
        return coverLetterRepository.save(letter);
    }

    public List<CoverLetter> getAll() {
        return coverLetterRepository.findAll();
    }

    public CoverLetter getById(Long id) {
        return coverLetterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cover letter not found: " + id));
    }

    public List<CoverLetter> getByResumeId(Long resumeId) {
        return coverLetterRepository.findByResumeId(resumeId);
    }

    public void delete(Long id) {
        coverLetterRepository.deleteById(id);
    }
}
