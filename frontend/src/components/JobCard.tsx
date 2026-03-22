import type { Job } from '../types';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ExternalLink,
  MoreHorizontal,
  Bookmark
} from 'lucide-react';

interface Props {
  job: Job;
}

export default function JobCard({ job }: Props) {
  // Quick helper for relative time (e.g., "2 days ago")
  const postedDate = job.postedAt ? new Date(job.postedAt) : null;
  const daysAgo = postedDate 
    ? Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 text-slate-400 font-bold text-lg select-none">
          {job.company.charAt(0).toUpperCase()}
        </div>
        <div className="flex gap-2">
          <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1">
          {job.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Building2 className="w-3.5 h-3.5" />
          <span className="font-medium">{job.company}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
            <MapPin className="w-3 h-3" />
            {job.location || 'Remote'}
          </div>
          {daysAgo !== null && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-500 text-xs font-medium border border-slate-100">
              <Calendar className="w-3 h-3" />
              {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
            </div>
          )}
        </div>

        {job.description && (
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">
            {job.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-indigo-600 transition-colors shadow-sm"
        >
          Apply Now
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
