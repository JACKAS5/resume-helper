package com.resumehelper.backend.resume.service;

import com.resumehelper.backend.resume.entity.Resume;
import com.resumehelper.backend.resume.repository.ResumeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ResumeServiceTest {

    @Mock
    private ResumeRepository resumeRepository;

    @InjectMocks
    private ResumeService resumeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void upload_savesAndReturnsResume() throws IOException {
        MockMultipartFile file = new MockMultipartFile(
                "file", "cv.pdf", "application/pdf", "pdf-content".getBytes());
        Resume saved = new Resume("cv.pdf", "application/pdf", "pdf-content".getBytes(), LocalDateTime.now());
        when(resumeRepository.save(any())).thenReturn(saved);

        Resume result = resumeService.upload(file);

        assertThat(result.getFileName()).isEqualTo("cv.pdf");
        verify(resumeRepository, times(1)).save(any());
    }

    @Test
    void getAll_returnsAllResumes() {
        Resume r1 = new Resume("a.pdf", "application/pdf", new byte[]{}, LocalDateTime.now());
        Resume r2 = new Resume("b.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", new byte[]{}, LocalDateTime.now());
        when(resumeRepository.findAll()).thenReturn(List.of(r1, r2));

        List<Resume> result = resumeService.getAll();

        assertThat(result).hasSize(2);
    }

    @Test
    void getById_throwsWhenNotFound() {
        when(resumeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> resumeService.getById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Resume not found");
    }

    @Test
    void delete_callsRepository() {
        doNothing().when(resumeRepository).deleteById(1L);

        resumeService.delete(1L);

        verify(resumeRepository, times(1)).deleteById(1L);
    }
}
