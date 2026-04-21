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
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'ALL'>('ALL');

  useEffect(() => { dispatch(fetchApplications()); }, [dispatch]);

  const filtered = apps.filter(app => statusFilter === 'ALL' || app.status === statusFilter);

  const handleAdd = () => {
    if (!form.jobTitle.trim() || !form.company.trim()) return;
    dispatch(addApplication(form));
    setForm(EMPTY);
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Application Tracker</h1>
          <p className="text-slate-500 text-sm mt-1">Keep track of your job application stages.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
          >
            <option value="ALL">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={() => setShowForm(v => !v)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100 active:scale-95"
          >
            + New App
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Add Application Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 ml-1">Job Title</label>
              <input
                placeholder="Software Engineer"
                value={form.jobTitle}
                onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 ml-1">Company</label>
              <input
                placeholder="Google"
                value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 ml-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as ApplicationStatus }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 ml-1">Applied Date</label>
              <input
                type="date"
                value={form.appliedAt}
                onChange={e => setForm(f => ({ ...f, appliedAt: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
          <div className="space-y-1.5 mb-6">
            <label className="text-xs font-semibold text-slate-500 ml-1">Notes</label>
            <textarea
              placeholder="Referral from Jane, follow up next week..."
              rows={3}
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Save Application
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="text-slate-500 px-6 py-2.5 text-sm font-medium hover:bg-slate-50 rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm mb-6 border border-red-100 flex items-center gap-2">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">No applications found matching your criteria.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(app => (
            <div key={app.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-slate-900 truncate">{app.jobTitle}</p>
                </div>
                <p className="text-sm text-slate-500 font-medium">{app.company}{app.appliedAt && ` · Applied ${new Date(app.appliedAt).toLocaleDateString()}`}</p>
                {app.notes && <p className="text-xs text-slate-400 mt-2 line-clamp-2 italic">{app.notes}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <select
                  value={app.status}
                  onChange={e => dispatch(patchApplication({ id: app.id, fields: { status: e.target.value as ApplicationStatus } }))}
                  className={`text-xs px-3 py-1.5 rounded-full border border-transparent font-bold focus:outline-none transition-colors shadow-sm cursor-pointer ${STATUS_COLORS[app.status]}`}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                  onClick={() => { if(confirm('Delete application?')) dispatch(removeApplication(app.id)) }}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete Application"
                >
                  <span className="text-lg">✕</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
