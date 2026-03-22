import type { Resume } from '../types';
import api from './client';

export const getResumes = (): Promise<Resume[]> =>
  api.get<Resume[]>('/resumes').then((r: { data: Resume[] }) => r.data);

export const uploadResume = (file: File): Promise<Resume> => {
  const form = new FormData();
  form.append('file', file);
  return api.post<Resume>('/resumes/upload', form).then((r: { data: Resume }) => r.data);
};

export const deleteResume = (id: number) => api.delete(`/resumes/${id}`);

export const parseResume = (id: number): Promise<string> =>
  api.get<string>(`/resumes/${id}/parse`).then((r: { data: string }) => r.data);
