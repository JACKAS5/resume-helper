import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Application } from '../../types';
import { getApplications, createApplication, updateApplication, deleteApplication } from '../../api/applications';

interface ApplicationsState {
  items: Application[];
  loading: boolean;
  error: string;
}

const initialState: ApplicationsState = { items: [], loading: false, error: '' };

export const fetchApplications = createAsyncThunk('applications/fetch', () => getApplications());

export const addApplication = createAsyncThunk(
  'applications/create',
  (app: Omit<Application, 'id'>) => createApplication(app)
);

export const patchApplication = createAsyncThunk(
  'applications/update',
  ({ id, fields }: { id: number; fields: Partial<Application> }) => updateApplication(id, fields)
);

export const removeApplication = createAsyncThunk('applications/delete', async (id: number) => {
  await deleteApplication(id);
  return id;
});

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchApplications.pending,    s => { s.loading = true; s.error = ''; })
      .addCase(fetchApplications.fulfilled,  (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchApplications.rejected,   s => { s.loading = false; s.error = 'Failed to load applications.'; })
      .addCase(addApplication.fulfilled,     (s, a) => { s.items.push(a.payload); })
      .addCase(addApplication.rejected,      s => { s.error = 'Failed to add application.'; })
      .addCase(patchApplication.fulfilled,   (s, a) => {
        const idx = s.items.findIndex(x => x.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(removeApplication.fulfilled,  (s, a) => { s.items = s.items.filter(x => x.id !== a.payload); })
      .addCase(removeApplication.rejected,   s => { s.error = 'Delete failed.'; });
  },
});

export default applicationsSlice.reducer;
