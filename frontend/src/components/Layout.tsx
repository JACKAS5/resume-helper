import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Send, 
  Briefcase, 
  Menu,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/slices/authSlice';
import { ToastContainer } from './ui/Toast';

const links = [
  { to: '/',             label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/resumes',      label: 'Resumes',      icon: FileText },
  { to: '/cover-letters',label: 'Cover Letters',icon: Send },
  { to: '/applications', label: 'Applications', icon: Briefcase },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

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

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-indigo-50 text-indigo-700 font-medium" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              <link.icon className={cn("w-5 h-5 shrink-0", collapsed && "mx-auto")} />
              {!collapsed && <span>{link.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  {link.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          {!collapsed ? (
            <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt={user.name} className="w-full h-full rounded-full" />
                ) : (
                  <UserIcon className="w-5 h-5 text-indigo-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-700 truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <UserIcon className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          )}
          
          <button 
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors group relative",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium">Sign Out</span>}
            {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  Sign Out
                </div>
              )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
