import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  Layers,
  Share2,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  X,
  Terminal,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Profile & Hero', path: '/admin/profile', icon: User },
    { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Skills', path: '/admin/skills', icon: Cpu },
    { name: 'Experience', path: '/admin/experience', icon: Briefcase },
    { name: 'Education', path: '/admin/education', icon: GraduationCap },
    { name: 'Certifications', path: '/admin/certifications', icon: Award },
    { name: 'Achievements', path: '/admin/achievements', icon: Trophy },
    { name: 'Services', path: '/admin/services', icon: Layers },
    { name: 'Social Links', path: '/admin/socials', icon: Share2 },
    { name: 'Messages', path: '/admin/messages', icon: Mail },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white/95 lg:bg-white/90 dark:bg-slate-950/95 dark:lg:bg-slate-950/80 border-r border-slate-200/80 dark:border-white/10 backdrop-blur-xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 shrink-0">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block leading-tight">Admin CMS</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Portfolio Control</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-black/5 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Info Bar */}
        <div className="px-5 py-3 border-b border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs">
          <div className="min-w-0">
            <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{user?.name || 'Aaryan Jagga'}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email || 'admin@aaryanjagga.dev'}</p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
            Admin
          </span>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-black/5 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-200/80 dark:border-white/10 space-y-1 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-black/5 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-white/5 transition-all"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Live Website</span>
            </span>
          </a>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
