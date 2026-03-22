package com.resumehelper.backend.coverletter.service;

import com.resumehelper.backend.coverletter.entity.CoverLetter;
import com.resumehelper.backend.coverletter.repository.CoverLetterRepository;
import com.resumehelper.backend.resume.service.ResumeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class CoverLetterServiceTest {

    @Mock private CoverLetterRepository coverLetterRepository;
    @Mock private ResumeService resumeService;
    @Mock private OpenClawService openClawService;

    @InjectMocks
    private CoverLetterService coverLetterService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void generate_parsesResumeCallsApiAndSaves() throws IOException {
        when(resumeService.parseText(1L)).thenReturn("Resume text");
        when(openClawService.generateCoverLetter(anyString(), anyString())).thenReturn("Dear Hiring Manager...");
        CoverLetter saved = new CoverLetter(1L, "Job desc", "Dear Hiring Manager...", LocalDateTime.now());
        when(coverLetterRepository.save(any())).thenReturn(saved);

        CoverLetter result = coverLetterService.generate(1L, "Job desc");

        assertThat(result.getContent()).isEqualTo("Dear Hiring Manager...");
        verify(resumeService).parseText(1L);
        verify(openClawService).generateCoverLetter("Resume text", "Job desc");
        verify(coverLetterRepository).save(any());
    }

    @Test
    void getAll_returnsAll() {
        when(coverLetterRepository.findAll()).thenReturn(List.of(
                new CoverLetter(1L, "desc", "content", LocalDateTime.now())
        ));

        assertThat(coverLetterService.getAll()).hasSize(1);
    }

    @Test
    void getById_throwsWhenNotFound() {
        when(coverLetterRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> coverLetterService.getById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Cover letter not found");
    }

    @Test
    void getByResumeId_returnsFiltered() {
        when(coverLetterRepository.findByResumeId(1L)).thenReturn(List.of(
                new CoverLetter(1L, "desc", "content", LocalDateTime.now())
        ));

        assertThat(coverLetterService.getByResumeId(1L)).hasSize(1);
    }

    @Test
    void delete_callsRepository() {
        doNothing().when(coverLetterRepository).deleteById(1L);

        coverLetterService.delete(1L);

        verify(coverLetterRepository).deleteById(1L);
    }
}
