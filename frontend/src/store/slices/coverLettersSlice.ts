import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { CoverLetter } from '../../types';
import { getCoverLetters, generateCoverLetter, deleteCoverLetter } from '../../api/coverletters';

interface CoverLettersState {
  items: CoverLetter[];
  loading: boolean;
  generating: boolean;
  error: string;
}

const initialState: CoverLettersState = { items: [], loading: false, generating: false, error: '' };

export const fetchCoverLetters = createAsyncThunk('coverLetters/fetch', () => getCoverLetters());

export const generateLetter = createAsyncThunk(
  'coverLetters/generate',
  ({ resumeId, jobDescription }: { resumeId: number; jobDescription: string }) =>
    generateCoverLetter(resumeId, jobDescription)
);

export const removeLetter = createAsyncThunk('coverLetters/delete', async (id: number) => {
  await deleteCoverLetter(id);
  return id;
});

const coverLettersSlice = createSlice({
  name: 'coverLetters',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCoverLetters.pending,    s => { s.loading = true; s.error = ''; })
      .addCase(fetchCoverLetters.fulfilled,  (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchCoverLetters.rejected,   s => { s.loading = false; s.error = 'Failed to load letters.'; })
      .addCase(generateLetter.pending,    s => { s.generating = true; s.error = ''; })
      .addCase(generateLetter.fulfilled,  (s, a) => { s.generating = false; s.items.unshift(a.payload); })
      .addCase(generateLetter.rejected,   s => { s.generating = false; s.error = 'Generation failed.'; })
      .addCase(removeLetter.fulfilled,    (s, a) => { s.items = s.items.filter(l => l.id !== a.payload); })
      .addCase(removeLetter.rejected,     s => { s.error = 'Delete failed.'; });
  },
});

export default coverLettersSlice.reducer;
