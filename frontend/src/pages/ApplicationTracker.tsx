import { useEffect, useState } from 'react';
import type { Application, ApplicationStatus } from '../types';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchApplications, addApplication, patchApplication, removeApplication } from '../store/slices/applicationsSlice';

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  APPLIED:   'bg-blue-50 text-blue-600',
  INTERVIEW: 'bg-yellow-50 text-yellow-600',
  OFFER:     'bg-green-50 text-green-600',
  REJECTED:  'bg-red-50 text-red-500',
};

const STATUSES: ApplicationStatus[] = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];
const EMPTY: Omit<Application, 'id'> = { jobTitle: '', company: '', status: 'APPLIED', appliedAt: '', notes: '' };

export default function ApplicationTracker() {
  const dispatch = useAppDispatch();
  const { items: apps, loading, error } = useAppSelector(s => s.applications);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { dispatch(fetchApplications()); }, [dispatch]);

  const handleAdd = () => {
    if (!form.jobTitle.trim() || !form.company.trim()) return;
    dispatch(addApplication(form));
    setForm(EMPTY);
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Application Tracker</h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
        >
          + Add Application
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Job title"
              value={form.jobTitle}
              onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <input
              placeholder="Company"
              value={form.company}
              onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value as ApplicationStatus }))}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <input
              type="date"
              value={form.appliedAt}
              onChange={e => setForm(f => ({ ...f, appliedAt: e.target.value }))}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <textarea
            placeholder="Notes (optional)"
            rows={2}
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            onClick={handleAdd}
            className="self-start bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
          >
            Save
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-slate-400 text-sm">Loading…</p>
      ) : apps.length === 0 ? (
        <p className="text-slate-400 text-sm">No applications tracked yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {apps.map(app => (
            <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{app.jobTitle}</p>
                <p className="text-sm text-slate-500">{app.company}{app.appliedAt && ` · ${app.appliedAt}`}</p>
                {app.notes && <p className="text-xs text-slate-400 mt-1 truncate">{app.notes}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={app.status}
                  onChange={e => dispatch(patchApplication({ id: app.id, fields: { status: e.target.value as ApplicationStatus } }))}
                  className={`text-xs px-2 py-1 rounded-full border-0 font-medium focus:outline-none ${STATUS_COLORS[app.status]}`}
                >
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
                <button
                  onClick={() => dispatch(removeApplication(app.id))}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
