package com.resumehelper.backend.resume.service;

import com.resumehelper.backend.resume.entity.Resume;
import com.resumehelper.backend.resume.repository.ResumeRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;

    public ResumeService(ResumeRepository resumeRepository) {
        this.resumeRepository = resumeRepository;
    }

    public Resume upload(MultipartFile file) throws IOException {
        Resume resume = new Resume(
                file.getOriginalFilename(),
                file.getContentType(),
                file.getBytes(),
                LocalDateTime.now()
        );
        return resumeRepository.save(resume);
    }

    public List<Resume> getAll() {
        return resumeRepository.findAll();
    }

    public Resume getById(Long id) {
        return resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found: " + id));
    }

    public void delete(Long id) {
        resumeRepository.deleteById(id);
    }

    public String parseText(Long id) throws IOException {
        Resume resume = getById(id);
        String type = resume.getFileType() != null ? resume.getFileType() : "";

        if (type.contains("pdf")) {
            try (PDDocument doc = Loader.loadPDF(resume.getData())) {
                return new PDFTextStripper().getText(doc);
            }
        } else if (type.contains("word") || type.contains("openxmlformats")) {
            try (XWPFDocument doc = new XWPFDocument(new ByteArrayInputStream(resume.getData()))) {
                StringBuilder sb = new StringBuilder();
                doc.getParagraphs().forEach(p -> sb.append(p.getText()).append("\n"));
                return sb.toString();
            }
        }
        // fallback: treat raw bytes as plain text
        return new String(resume.getData());
    }
}
