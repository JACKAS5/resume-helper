import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Resume } from '../../types';
import { getResumes, uploadResume, deleteResume } from '../../api/resumes';

interface ResumesState {
  items: Resume[];
  loading: boolean;
  error: string;
}

const initialState: ResumesState = { items: [], loading: false, error: '' };

export const fetchResumes  = createAsyncThunk('resumes/fetch',  () => getResumes());
export const uploadFile    = createAsyncThunk('resumes/upload', (file: File) => uploadResume(file));
export const removeResume  = createAsyncThunk('resumes/delete', async (id: number) => {
  await deleteResume(id);
  return id;
});

const resumesSlice = createSlice({
  name: 'resumes',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchResumes.pending,    s => { s.loading = true; s.error = ''; })
      .addCase(fetchResumes.fulfilled,  (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchResumes.rejected,   s => { s.loading = false; s.error = 'Failed to load resumes.'; })
      .addCase(uploadFile.fulfilled,    (s, a) => { s.items.push(a.payload); })
      .addCase(uploadFile.rejected,     s => { s.error = 'Upload failed.'; })
      .addCase(removeResume.fulfilled,  (s, a) => { s.items = s.items.filter(r => r.id !== a.payload); })
      .addCase(removeResume.rejected,   s => { s.error = 'Delete failed.'; });
  },
});

export default resumesSlice.reducer;
