package com.resumehelper.backend.application.service;

import com.resumehelper.backend.application.entity.Application;
import com.resumehelper.backend.application.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ApplicationService {

    private final ApplicationRepository repo;

    public ApplicationService(ApplicationRepository repo) { this.repo = repo; }

    public List<Application> getAll() { return repo.findAll(); }

    public Application getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Application not found: " + id));
    }

    public Application create(Application app) { return repo.save(app); }

    public Application update(Long id, Map<String, Object> fields) {
        Application app = getById(id);
        if (fields.containsKey("jobTitle"))  app.setJobTitle(fields.get("jobTitle").toString());
        if (fields.containsKey("company"))   app.setCompany(fields.get("company").toString());
        if (fields.containsKey("notes"))     app.setNotes(fields.get("notes").toString());
        if (fields.containsKey("status"))
            app.setStatus(Application.Status.valueOf(fields.get("status").toString()));
        return repo.save(app);
    }

    public void delete(Long id) { repo.deleteById(id); }
}
