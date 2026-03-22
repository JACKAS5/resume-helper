import { useEffect, useState } from 'react';
import type { CoverLetter } from '../types';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchCoverLetters, generateLetter, removeLetter } from '../store/slices/coverLettersSlice';
import { fetchResumes } from '../store/slices/resumesSlice';

export default function CoverLetterPreview() {
  const dispatch = useAppDispatch();
  const { items: letters, generating, error } = useAppSelector(s => s.coverLetters);
  const { items: resumes } = useAppSelector(s => s.resumes);
  const [resumeId, setResumeId] = useState<number | ''>('');
  const [jobDesc, setJobDesc] = useState('');
  const [selected, setSelected] = useState<CoverLetter | null>(null);

  useEffect(() => {
    dispatch(fetchCoverLetters());
    dispatch(fetchResumes());
  }, [dispatch]);

  const handleGenerate = async () => {
    if (!resumeId || !jobDesc.trim()) return;
    const result = await dispatch(generateLetter({ resumeId: Number(resumeId), jobDescription: jobDesc }));
    if (generateLetter.fulfilled.match(result)) {
      setSelected(result.payload);
      setJobDesc('');
    }
  };

  const handleDelete = (id: number) => {
    dispatch(removeLetter(id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Cover Letters</h1>

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-slate-700 mb-3">Generate New Letter</h2>
        <div className="flex flex-col gap-3">
          <select
            value={resumeId}
            onChange={e => setResumeId(Number(e.target.value))}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Select a resume…</option>
            {resumes.map(r => <option key={r.id} value={r.id}>{r.fileName}</option>)}
          </select>
          <textarea
            rows={4}
            placeholder="Paste the job description here…"
            value={jobDesc}
            onChange={e => setJobDesc(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleGenerate}
            disabled={generating || !resumeId || !jobDesc.trim()}
            className="self-start bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {generating ? 'Generating…' : '✦ Generate'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 flex flex-col gap-2">
          {letters.length === 0 && <p className="text-slate-400 text-sm">No letters yet.</p>}
          {letters.map(l => (
            <div
              key={l.id}
              onClick={() => setSelected(l)}
              className={`cursor-pointer bg-white border rounded-xl p-3 hover:shadow-sm transition-shadow ${selected?.id === l.id ? 'border-indigo-400' : 'border-slate-200'}`}
            >
              <p className="text-sm font-medium text-slate-700 line-clamp-1">{l.jobDescription}</p>
              <p className="text-xs text-slate-400 mt-0.5">{new Date(l.createdAt).toLocaleDateString()}</p>
              <button
                onClick={e => { e.stopPropagation(); handleDelete(l.id); }}
                className="text-xs text-red-400 hover:text-red-600 mt-1"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-5 min-h-48">
          {selected ? (
            <>
              <p className="text-xs text-slate-400 mb-3">
                Resume ID: {selected.resumeId} · {new Date(selected.createdAt).toLocaleString()}
              </p>
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                {selected.content}
              </pre>
            </>
          ) : (
            <p className="text-slate-400 text-sm">Select a letter to preview.</p>
          )}
        </div>
      </div>
    </div>
  );
}
