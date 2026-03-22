import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import JobCard from '../components/JobCard';
import Dashboard from '../pages/Dashboard';
import jobsReducer from '../store/slices/jobsSlice';
import resumesReducer from '../store/slices/resumesSlice';
import coverLettersReducer from '../store/slices/coverLettersSlice';
import applicationsReducer from '../store/slices/applicationsSlice';
import type { Job } from '../types';

// ─── MSW server ──────────────────────────────────────────────────────────────

const mockJobs: Job[] = [
  { id: 1, title: 'Frontend Dev', company: 'Acme', location: 'Remote', description: 'React role', url: 'http://acme.com', postedAt: '2024-01-01T00:00:00' },
  { id: 2, title: 'Backend Dev',  company: 'Beta', location: 'Phnom Penh', description: 'Java role', url: 'http://beta.com', postedAt: '2024-01-02T00:00:00' },
];

const server = setupServer(
  http.get('/api/jobs',        () => HttpResponse.json(mockJobs)),
  http.post('/api/jobs/scrape', () => HttpResponse.text('Jobs scraped and saved successfully!')),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ─── helpers ─────────────────────────────────────────────────────────────────

const makeStore = () => configureStore({
  reducer: {
    jobs: jobsReducer,
    resumes: resumesReducer,
    coverLetters: coverLettersReducer,
    applications: applicationsReducer,
  },
});

const renderWithStore = (ui: React.ReactElement) =>
  render(
    <Provider store={makeStore()}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );

// ─── JobCard ─────────────────────────────────────────────────────────────────

describe('JobCard', () => {
  const job = mockJobs[0];

  it('renders title and company', () => {
    render(<MemoryRouter><JobCard job={job} /></MemoryRouter>);
    expect(screen.getByText('Frontend Dev')).toBeInTheDocument();
    expect(screen.getByText(/Acme/)).toBeInTheDocument();
  });

  it('renders description snippet', () => {
    render(<MemoryRouter><JobCard job={job} /></MemoryRouter>);
    expect(screen.getByText('React role')).toBeInTheDocument();
  });

  it('renders a View link with correct href', () => {
    render(<MemoryRouter><JobCard job={job} /></MemoryRouter>);
    const link = screen.getByRole('link', { name: /view/i });
    expect(link).toHaveAttribute('href', 'http://acme.com');
  });
});

// ─── Dashboard ───────────────────────────────────────────────────────────────

describe('Dashboard', () => {
  it('renders heading', () => {
    renderWithStore(<Dashboard />);
    expect(screen.getByText('Job Dashboard')).toBeInTheDocument();
  });

  it('renders scrape button', () => {
    renderWithStore(<Dashboard />);
    expect(screen.getByRole('button', { name: /scrape jobs/i })).toBeInTheDocument();
  });

  it('filters jobs by search input', async () => {
    renderWithStore(<Dashboard />);
    // Wait for jobs to load
    expect(await screen.findByText('Frontend Dev')).toBeInTheDocument();
    expect(screen.getByText('Backend Dev')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/search jobs/i), { target: { value: 'Frontend' } });
    expect(screen.getByText('Frontend Dev')).toBeInTheDocument();
    expect(screen.queryByText('Backend Dev')).not.toBeInTheDocument();
  });

  it('shows empty state when no jobs match search', async () => {
    renderWithStore(<Dashboard />);
    await screen.findByText('Frontend Dev');
    fireEvent.change(screen.getByPlaceholderText(/search jobs/i), { target: { value: 'zzznomatch' } });
    expect(screen.getByText(/no jobs found/i)).toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    server.use(http.get('/api/jobs', () => HttpResponse.error()));
    renderWithStore(<Dashboard />);
    expect(await screen.findByText(/failed to load jobs/i)).toBeInTheDocument();
  });
});
