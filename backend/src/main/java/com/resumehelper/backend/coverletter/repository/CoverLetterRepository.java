package com.resumehelper.backend.coverletter.repository;

import com.resumehelper.backend.coverletter.entity.CoverLetter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoverLetterRepository extends JpaRepository<CoverLetter, Long> {
    List<CoverLetter> findByResumeId(Long resumeId);
}
