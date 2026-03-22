import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Send, 
  Briefcase, 
  Menu,
  Settings
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

const links = [
  { to: '/',             label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/resumes',      label: 'Resumes',      icon: FileText },
  { to: '/coverletters', label: 'Cover Letters',icon: Send },
  { to: '/tracker',      label: 'Applications', icon: Briefcase },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out relative z-20",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && "justify-center w-full")}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="font-bold text-slate-800 text-lg tracking-tight whitespace-nowrap">
                JobFlow
              </span>
            )}
          </div>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors hidden md:block",
              collapsed && "absolute -right-3 top-20 bg-white border border-slate-200 shadow-sm rounded-full w-6 h-6 p-0 flex items-center justify-center z-50"
            )}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map(l => {
            const isActive = location.pathname === l.to;
            const Icon = l.icon;
            
            return (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon className={cn("w-5 h-5 shrink-0 transition-transform duration-200", isActive && "scale-110")} />
                {!collapsed && <span className="font-medium text-sm">{l.label}</span>}
                
                {isActive && !collapsed && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-1">
          <button className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors",
            collapsed && "justify-center px-2"
          )}>
            <Settings className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium text-sm">Settings</span>}
          </button>
          
          <div className={cn("mt-4 flex items-center gap-3 px-3", collapsed && "justify-center px-0")}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shrink-0 border-2 border-white shadow-sm" />
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-700 truncate">Demo User</p>
                <p className="text-xs text-slate-400 truncate">user@example.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50/50 relative">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent opacity-60" />
        <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
