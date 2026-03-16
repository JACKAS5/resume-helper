# Resume & Application Helper – Project Roadmap

**Goal:** Build a professional-grade job search and application helper with backend, frontend, AI automation, and CI/CD pipeline.

---

## Phase 0: Planning & Setup

**Goal:** Prepare the foundation for development.

**Tasks:**
- Define project scope and features:
  - Job scraping (CamHR, BongThom, Khmer24, LinkedIn Cambodia)
  - Resume management & ranking
  - AI cover letter generation (OpenCLAW)
  - Application tracker
  - Notifications (Telegram / Discord)
  - Scheduler for automation
- Choose tech stack:
  - Backend: Java 17+, Spring Boot, PostgreSQL
  - Frontend: React + TypeScript, TailwindCSS / Material-UI
  - AI Service: OpenCLAW
  - Docker & Docker Compose for dev/prod environment
  - CI/CD: GitHub Actions
- Repository setup:
  - Monorepo: `/backend` + `/frontend`
  - Branch strategy: `main`, `dev`, `feature/*`
  - `.gitignore` for Java, Node, Docker
- Environment variables:
  - Backend `.env` (dev), `.env.test` (tests), `.env.production` (prod)
  - Frontend `.env` (dev), `.env.production` (prod)
  - CI/CD secrets stored in GitHub Actions
- Verify Docker Compose builds containers for backend, frontend, and PostgreSQL.

**Outcome:** Clean repo, Docker environment, dev environment ready.

---

## Phase 1: Backend MVP

**Goal:** Implement core backend services.

### 1. Job Scraper Service
- **Classes/Files:**
  - `JobScraperService.java` – scraping logic
  - `Job.java` – JPA entity
  - `JobRepository.java` – JPA repository
  - `JobController.java` – REST endpoints `/jobs`
- **Tasks:**
  - Scrape 1 job site (CamHR)
  - Normalize and save jobs to PostgreSQL
  - Unit test scraping logic
  - Integration test `/jobs` endpoints

### 2. Resume Service
- **Classes/Files:**
  - `ResumeService.java`
  - `ResumeController.java` – REST endpoints `/resumes`
  - `Resume.java` – entity
  - `ResumeRepository.java` – repository
- **Tasks:**
  - Upload, store, and manage resumes (PDF/Word)
  - Unit tests: parsing, CRUD
  - Integration tests: REST endpoints

### 3. AI Cover Letter Service (OpenCLAW)
- **Classes/Files:**
  - `OpenClawService.java` – API integration
  - `CoverLetterController.java` – REST `/coverletters`
- **Tasks:**
  - Generate tailored cover letter using resume + job description
  - Store results in DB
  - Unit and integration tests

### 4. Application Tracker
- **Classes/Files:**
  - `Application.java` – entity
  - `ApplicationController.java` – REST `/applications`
  - `ApplicationService.java`
- **Tasks:**
  - CRUD application tracking
  - Status tracking: Applied, Interview, Offer, Rejected
  - Tests for service & endpoints

### 5. Backend Testing
- Unit tests: service methods
- Integration tests: REST endpoints + DB (Testcontainers)
- Coverage goal: ≥70%

**Outcome:** Backend MVP functional, tested, and ready for frontend integration.

---

## Phase 2: Frontend MVP

**Goal:** Connect frontend to backend MVP.

### 1. Project Setup
- React + TypeScript project
- TailwindCSS / Material-UI
- Axios HTTP client

### 2. Components
- `Dashboard.tsx` – job list, applications
- `ResumeList.tsx` – upload/view resumes
- `CoverLetterPreview.tsx` – AI-generated letters
- `ApplicationTracker.tsx` – track application status
- `JobCard.tsx` – individual job component

### 3. State Management
- React Context or Redux Toolkit
- Store jobs, resumes, cover letters, application status

### 4. API Integration
- Axios calls:
  - `/jobs` GET
  - `/resumes` CRUD
  - `/coverletters` POST/GET
  - `/applications` CRUD

### 5. Testing
- Unit tests: Jest + React Testing Library
- Integration tests: component workflows
- E2E tests: Cypress / Playwright

**Outcome:** Frontend MVP functional, connected to backend.

---

## Phase 3: Advanced Features

**Goal:** Add automation, AI enhancements, and notifications.

### 1. Multi-source Job Scraper
- Extend `JobScraperService` to scrape multiple Cambodian sites
- Normalize data across sources

### 2. OpenCLAW Enhancements
- Resume ranking per job
- Optional job description summarization

### 3. Notifications
- Telegram bot integration
- Discord webhook integration
- Scheduler triggers notifications for new jobs

### 4. Scheduler
- Spring `@Scheduled` to scrape jobs and generate cover letters automatically

### 5. Error Handling & Logging
- Use SLF4J / Logback
- Structured API error responses

**Outcome:** Smart automated system with multi-source scraping, AI enhancements, and notifications.

---

## Phase 4: Testing, CI/CD & Quality

**Goal:** Make project production-ready.

### 1. CI/CD Pipeline (GitHub Actions)
- Backend:
  - Compile, unit & integration tests, coverage
- Frontend:
  - Install dependencies, unit/integration tests, lint, build
- Docker:
  - Build backend & frontend images
- Deployment:
  - Docker Compose deployment triggered on `main` branch

### 2. Testing
- Backend: unit & integration tests
- Frontend: unit, integration, E2E
- Coverage goal ≥70%
- Linting: ESLint / Prettier (frontend), Checkstyle / SpotBugs (backend)

**Outcome:** Professional-grade CI/CD, fully tested, deployable.

---

## Phase 5: Portfolio & Polish

**Goal:** Make project portfolio-ready.

- Add screenshots and demo videos
- Mermaid diagrams for:
  - Architecture
  - CI/CD pipeline
- README.md with tech stack, roadmap, features
- Highlight OpenCLAW AI integration
- Ensure all tests pass, Docker setup smooth

**Outcome:** Complete, polished, professional project ready for recruiters.

---

## Environment Variables (`.env` usage)

| Environment | Backend `.env` | Frontend `.env` | Notes |
|-------------|----------------|----------------|-------|
| Local Dev   | `.env`          | `.env`          | Use real dev DB + API keys |
| Testing     | `.env.test`     | `.env.test` (optional) | Test DB + mock API keys |
| Production  | `.env.production` | `.env.production` | Prod DB + API keys |
| CI/CD       | GitHub secrets  | GitHub secrets  | Injected dynamically |

---

## Notes
- Use **separate test DB and mock AI keys** to avoid affecting real data.
- All sensitive info should be excluded from repo (`.gitignore`) except `.env.example`.
- This roadmap can be used to **track progress** like a real software team would.

---
