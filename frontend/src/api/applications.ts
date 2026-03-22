import type { Application } from '../types';
import api from './client';

export const getApplications = (): Promise<Application[]> =>
  api.get<Application[]>('/applications').then((r: { data: Application[] }) => r.data);

export const createApplication = (app: Omit<Application, 'id'>): Promise<Application> =>
  api.post<Application>('/applications', app).then((r: { data: Application }) => r.data);

export const updateApplication = (id: number, fields: Partial<Application>): Promise<Application> =>
  api.patch<Application>(`/applications/${id}`, fields).then((r: { data: Application }) => r.data);

export const deleteApplication = (id: number) => api.delete(`/applications/${id}`);
