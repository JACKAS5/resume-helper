import type { CoverLetter } from '../types';
import api from './client';

export const getCoverLetters = (): Promise<CoverLetter[]> =>
  api.get<CoverLetter[]>('/coverletters').then((r: { data: CoverLetter[] }) => r.data);

export const generateCoverLetter = (resumeId: number, jobDescription: string): Promise<CoverLetter> =>
  api.post<CoverLetter>('/coverletters/generate', { resumeId, jobDescription })
     .then((r: { data: CoverLetter }) => r.data);

export const deleteCoverLetter = (id: number) => api.delete(`/coverletters/${id}`);
