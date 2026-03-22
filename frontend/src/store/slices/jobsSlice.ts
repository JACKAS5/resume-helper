import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Job } from '../../types';
import { getJobs, scrapeJobs } from '../../api/jobs';

interface JobsState {
  items: Job[];
  loading: boolean;
  scraping: boolean;
  error: string;
}

const initialState: JobsState = { items: [], loading: false, scraping: false, error: '' };

export const fetchJobs = createAsyncThunk('jobs/fetch', () => getJobs());
export const triggerScrape = createAsyncThunk('jobs/scrape', async (_, { dispatch }) => {
  await scrapeJobs();
  await dispatch(fetchJobs());
});

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchJobs.pending,    s => { s.loading = true; s.error = ''; })
      .addCase(fetchJobs.fulfilled,  (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchJobs.rejected,   s => { s.loading = false; s.error = 'Failed to load jobs.'; })
      .addCase(triggerScrape.pending,   s => { s.scraping = true; })
      .addCase(triggerScrape.fulfilled, s => { s.scraping = false; })
      .addCase(triggerScrape.rejected,  s => { s.scraping = false; s.error = 'Scrape failed.'; });
  },
});

export default jobsSlice.reducer;
