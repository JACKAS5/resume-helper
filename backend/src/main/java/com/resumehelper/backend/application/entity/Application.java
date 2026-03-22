package com.resumehelper.backend.application.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "applications")
public class Application {

    public enum Status { APPLIED, INTERVIEW, OFFER, REJECTED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String jobTitle;
    private String company;

    @Enumerated(EnumType.STRING)
    private Status status = Status.APPLIED;

    private LocalDate appliedAt;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public Application() {}

    public Application(String jobTitle, String company, Status status, LocalDate appliedAt, String notes) {
        this.jobTitle = jobTitle;
        this.company = company;
        this.status = status;
        this.appliedAt = appliedAt;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public LocalDate getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDate appliedAt) { this.appliedAt = appliedAt; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
