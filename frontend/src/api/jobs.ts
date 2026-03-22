import type { Job } from '../types';
import api from './client';

export const getJobs = (): Promise<Job[]> =>
  api.get<Job[]>('/jobs').then((r: { data: Job[] }) => r.data);

export const scrapeJobs = (): Promise<string> =>
  api.post<string>('/jobs/scrape').then((r: { data: string }) => r.data);
