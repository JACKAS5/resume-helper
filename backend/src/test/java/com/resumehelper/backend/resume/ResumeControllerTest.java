package com.resumehelper.backend.resume;

import com.resumehelper.backend.resume.controller.ResumeController;
import com.resumehelper.backend.resume.entity.Resume;
import com.resumehelper.backend.resume.service.ResumeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ResumeController.class)
class ResumeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ResumeService resumeService;

    @Test
    void getAll_returnsOk() throws Exception {
        when(resumeService.getAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/resumes"))
                .andExpect(status().isOk());
    }

    @Test
    void upload_returnsOk() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "cv.pdf", "application/pdf", "data".getBytes());
        Resume saved = new Resume("cv.pdf", "application/pdf", "data".getBytes(), LocalDateTime.now());
        when(resumeService.upload(any())).thenReturn(saved);

        mockMvc.perform(multipart("/api/resumes/upload").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fileName").value("cv.pdf"));
    }

    @Test
    void delete_returnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/resumes/1"))
                .andExpect(status().isNoContent());
    }
}
