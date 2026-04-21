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

import { JobCardSkeleton } from '../components/ui/Skeleton';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { items: jobs, loading, scraping, error } = useAppSelector(s => s.jobs);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [minMatchScore, setMinMatchScore] = useState<number | ''>('');

  useEffect(() => { dispatch(fetchJobs()); }, [dispatch]);

  const filtered = jobs.filter(j => {
    const matchesSearch = `${j.title} ${j.company}`.toLowerCase().includes(search.toLowerCase());
    const matchesLocation = locationFilter === '' || (j.location && j.location.toLowerCase().includes(locationFilter.toLowerCase()));
    const matchesScore = minMatchScore === '' || (j.matchScore !== undefined && j.matchScore >= minMatchScore);
    return matchesSearch && matchesLocation && matchesScore;
  });

  const uniqueLocations = Array.from(new Set(jobs.map(j => j.location || 'Remote'))).filter(Boolean).sort();

  const stats = [
    { label: 'Total Jobs', value: jobs.length, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'High Match', value: jobs.filter(j => (j.matchScore || 0) >= 80).length, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'New Today', value: jobs.filter(j => {
      const posted = j.postedAt ? new Date(j.postedAt) : null;
      return posted && posted.toDateString() === new Date().toDateString();
    }).length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Locations', value: uniqueLocations.length, icon: FileCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
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
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-4">
          <div className="flex gap-3">
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
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm transition-all flex items-center gap-2 border",
                showFilters 
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {(locationFilter !== '' || minMatchScore !== '') && (
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Location</label>
                <select 
                  value={locationFilter}
                  onChange={e => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="">All Locations</option>
                  {uniqueLocations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Min Match Score</label>
                <select 
                  value={minMatchScore}
                  onChange={e => setMinMatchScore(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="">Any Score</option>
                  <option value="90">90% +</option>
                  <option value="80">80% +</option>
                  <option value="70">70% +</option>
                  <option value="60">60% +</option>
                  <option value="50">50% +</option>
                </select>
              </div>

              <div className="flex items-end pb-0.5">
                <button 
                  onClick={() => {
                    setLocationFilter('');
                    setMinMatchScore('');
                  }}
                  className="text-sm font-medium text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1.5 px-2 py-1"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
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
                  <JobCardSkeleton key={i} />
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
