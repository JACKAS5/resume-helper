import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchJobs, triggerScrape } from '../store/slices/jobsSlice';
import JobCard from '../components/JobCard';
import { 
  Search, 
  RefreshCw, 
  Filter, 
  Briefcase, 
  FileCheck, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { items: jobs, loading, scraping, error } = useAppSelector(s => s.jobs);
  const [search, setSearch] = useState('');

  useEffect(() => { dispatch(fetchJobs()); }, [dispatch]);

  const filtered = jobs.filter(j =>
    `${j.title} ${j.company}`.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Total Jobs', value: jobs.length, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Applied', value: 12, icon: FileCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Interviews', value: 3, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending', value: 8, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your job search progress.</p>
        </div>
        <button
          onClick={() => dispatch(triggerScrape())}
          disabled={scraping}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm active:scale-95",
            scraping 
              ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
              : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 shadow-indigo-100"
          )}
        >
          <RefreshCw className={cn("w-4 h-4", scraping && "animate-spin")} />
          {scraping ? 'Scraping Jobs...' : 'Scrape New Jobs'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs by title or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>
          <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        <div className="p-6 min-h-[400px]">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm mb-6 flex items-center gap-2 border border-red-100">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
             </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No jobs found</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-1">
                Try adjusting your search terms or scrape for new opportunities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
