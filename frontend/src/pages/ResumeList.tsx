import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchResumes, uploadFile, removeResume } from '../store/slices/resumesSlice';

export default function ResumeList() {
  const dispatch = useAppDispatch();
  const { items: resumes, loading, error } = useAppSelector(s => s.resumes);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { dispatch(fetchResumes()); }, [dispatch]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    dispatch(uploadFile(file));
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Resumes</h1>
        <label className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-indigo-700 transition-colors">
          + Upload
          <input ref={inputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-slate-400 text-sm">Loading…</p>
      ) : resumes.length === 0 ? (
        <p className="text-slate-400 text-sm">No resumes yet. Upload a PDF or DOCX.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {resumes.map(r => (
            <div key={r.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">{r.fileName}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {r.fileType} · {new Date(r.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`/api/resumes/${r.id}/download`}
                  className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors"
                >
                  Download
                </a>
                <button
                  onClick={() => dispatch(removeResume(r.id))}
                  className="text-xs bg-red-50 text-red-500 px-3 py-1 rounded-full hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
