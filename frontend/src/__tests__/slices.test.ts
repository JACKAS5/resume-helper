import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import jobsReducer, { fetchJobs, triggerScrape } from '../store/slices/jobsSlice';
import resumesReducer, { fetchResumes, uploadFile, removeResume } from '../store/slices/resumesSlice';
import coverLettersReducer, { fetchCoverLetters, generateLetter, removeLetter } from '../store/slices/coverLettersSlice';
import applicationsReducer, { fetchApplications, addApplication, removeApplication, patchApplication } from '../store/slices/applicationsSlice';
import type { Job, Resume, CoverLetter, Application } from '../types';

// ─── helpers ────────────────────────────────────────────────────────────────

const makeStore = () => configureStore({
  reducer: {
    jobs: jobsReducer,
    resumes: resumesReducer,
    coverLetters: coverLettersReducer,
    applications: applicationsReducer,
  },
});

const job: Job = { id: 1, title: 'Dev', company: 'Acme', location: 'Remote', description: '', url: 'http://x.com', postedAt: '' };
const resume: Resume = { id: 1, fileName: 'cv.pdf', fileType: 'application/pdf', uploadedAt: '' };
const letter: CoverLetter = { id: 1, resumeId: 1, jobDescription: 'desc', content: 'Dear...', createdAt: '' };
const app: Application = { id: 1, jobTitle: 'Dev', company: 'Acme', status: 'APPLIED', appliedAt: '2024-01-01', notes: '' };

// ─── jobsSlice ───────────────────────────────────────────────────────────────

describe('jobsSlice', () => {
  it('sets loading on fetchJobs.pending', () => {
    const store = makeStore();
    store.dispatch({ type: fetchJobs.pending.type });
    expect(store.getState().jobs.loading).toBe(true);
  });

  it('stores jobs on fetchJobs.fulfilled', () => {
    const store = makeStore();
    store.dispatch({ type: fetchJobs.fulfilled.type, payload: [job] });
    expect(store.getState().jobs.items).toHaveLength(1);
    expect(store.getState().jobs.items[0].title).toBe('Dev');
  });

  it('sets error on fetchJobs.rejected', () => {
    const store = makeStore();
    store.dispatch({ type: fetchJobs.rejected.type });
    expect(store.getState().jobs.error).toBe('Failed to load jobs.');
  });

  it('sets scraping on triggerScrape.pending', () => {
    const store = makeStore();
    store.dispatch({ type: triggerScrape.pending.type });
    expect(store.getState().jobs.scraping).toBe(true);
  });
});

// ─── resumesSlice ────────────────────────────────────────────────────────────

describe('resumesSlice', () => {
  it('stores resumes on fetchResumes.fulfilled', () => {
    const store = makeStore();
    store.dispatch({ type: fetchResumes.fulfilled.type, payload: [resume] });
    expect(store.getState().resumes.items).toHaveLength(1);
  });

  it('appends resume on uploadFile.fulfilled', () => {
    const store = makeStore();
    store.dispatch({ type: uploadFile.fulfilled.type, payload: resume });
    expect(store.getState().resumes.items).toHaveLength(1);
  });

  it('removes resume on removeResume.fulfilled', () => {
    const store = makeStore();
    store.dispatch({ type: fetchResumes.fulfilled.type, payload: [resume] });
    store.dispatch({ type: removeResume.fulfilled.type, payload: 1 });
    expect(store.getState().resumes.items).toHaveLength(0);
  });
});

// ─── coverLettersSlice ───────────────────────────────────────────────────────

describe('coverLettersSlice', () => {
  it('stores letters on fetchCoverLetters.fulfilled', () => {
    const store = makeStore();
    store.dispatch({ type: fetchCoverLetters.fulfilled.type, payload: [letter] });
    expect(store.getState().coverLetters.items).toHaveLength(1);
  });

  it('prepends letter on generateLetter.fulfilled', () => {
    const store = makeStore();
    const second: CoverLetter = { ...letter, id: 2 };
    store.dispatch({ type: fetchCoverLetters.fulfilled.type, payload: [letter] });
    store.dispatch({ type: generateLetter.fulfilled.type, payload: second });
    expect(store.getState().coverLetters.items[0].id).toBe(2);
  });

  it('removes letter on removeLetter.fulfilled', () => {
    const store = makeStore();
    store.dispatch({ type: fetchCoverLetters.fulfilled.type, payload: [letter] });
    store.dispatch({ type: removeLetter.fulfilled.type, payload: 1 });
    expect(store.getState().coverLetters.items).toHaveLength(0);
  });

  it('sets generating on generateLetter.pending', () => {
    const store = makeStore();
    store.dispatch({ type: generateLetter.pending.type });
    expect(store.getState().coverLetters.generating).toBe(true);
  });
});

// ─── applicationsSlice ───────────────────────────────────────────────────────

describe('applicationsSlice', () => {
  it('stores apps on fetchApplications.fulfilled', () => {
    const store = makeStore();
    store.dispatch({ type: fetchApplications.fulfilled.type, payload: [app] });
    expect(store.getState().applications.items).toHaveLength(1);
  });

  it('appends app on addApplication.fulfilled', () => {
    const store = makeStore();
    store.dispatch({ type: addApplication.fulfilled.type, payload: app });
    expect(store.getState().applications.items).toHaveLength(1);
  });

  it('updates status on patchApplication.fulfilled', () => {
    const store = makeStore();
    store.dispatch({ type: fetchApplications.fulfilled.type, payload: [app] });
    store.dispatch({ type: patchApplication.fulfilled.type, payload: { ...app, status: 'INTERVIEW' } });
    expect(store.getState().applications.items[0].status).toBe('INTERVIEW');
  });

  it('removes app on removeApplication.fulfilled', () => {
    const store = makeStore();
    store.dispatch({ type: fetchApplications.fulfilled.type, payload: [app] });
    store.dispatch({ type: removeApplication.fulfilled.type, payload: 1 });
    expect(store.getState().applications.items).toHaveLength(0);
  });
});
