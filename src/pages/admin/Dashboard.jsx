import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Cpu,
  GraduationCap,
  Briefcase,
  Award,
  Mail,
  Plus,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { api } from '../../services/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const loadStats = async () => {
    try {
      const res = await api.getStats();
      setData(res);
    } catch (err) {
      console.error('Failed to load stats:', err);
      toast.error('Failed to load dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleMarkRead = async (id, currentStatus) => {
    try {
      await api.toggleMessageRead(id, !currentStatus);
      toast.success('Message status updated');
      loadStats();
    } catch (err) {
      toast.error('Failed to update message');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const { counts, recentProjects = [], recentMessages = [] } = data || {};

  const statCards = [
    { label: 'Total Projects', value: counts?.projects || 0, icon: FolderGit2, path: '/admin/projects', color: 'text-indigo-400' },
    { label: 'Technical Skills', value: counts?.skills || 0, icon: Cpu, path: '/admin/skills', color: 'text-emerald-400' },
    { label: 'Work Experience', value: counts?.experience || 0, icon: Briefcase, path: '/admin/experience', color: 'text-amber-400' },
    { label: 'Certifications', value: counts?.certifications || 0, icon: Award, path: '/admin/certifications', color: 'text-purple-400' },
    { label: 'Education', value: counts?.education || 0, icon: GraduationCap, path: '/admin/education', color: 'text-cyan-400' },
    { label: 'Services', value: counts?.services || 0, icon: Layers, path: '/admin/services', color: 'text-blue-400' },
    { label: 'Total Inquiries', value: counts?.messages || 0, icon: Mail, path: '/admin/messages', color: 'text-rose-400', badge: counts?.unreadMessages > 0 ? `${counts.unreadMessages} Unread` : null },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Portfolio Overview</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dynamic content management engine. Real-time changes immediately propagate to the public portfolio.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/admin/projects">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add Project
            </Button>
          </Link>
          <Link to="/admin/messages">
            <Button variant="secondary" size="sm" leftIcon={<Mail className="w-3.5 h-3.5" />}>
              Inbox ({counts?.unreadMessages || 0})
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} to={stat.path}>
              <Card className="p-4 sm:p-5 hoverEffect group h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  {stat.badge && (
                    <Badge variant="rose" size="sm" dot>
                      {stat.badge}
                    </Badge>
                  )}
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight block">
                    {stat.value}
                  </span>
                  <span className="text-xs text-slate-400 mt-0.5 block">{stat.label}</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Projects & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <Card className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
              <span>Recent Projects</span>
            </h3>
            <Link to="/admin/projects" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              <span>Manage all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentProjects.length > 0 ? (
            <div className="space-y-3">
              {recentProjects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="min-w-0 pr-3">
                    <p className="text-sm font-semibold text-slate-200 truncate">{p.name}</p>
                    <span className="text-xs text-slate-500 font-mono">{p.category}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={p.status === 'Completed' ? 'emerald' : 'amber'} size="sm">
                      {p.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No projects added yet.</p>
          )}
        </Card>

        {/* Recent Inquiries */}
        <Card className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-rose-400" />
              <span>Recent Inquiries</span>
            </h3>
            <Link to="/admin/messages" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              <span>View inbox</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentMessages.length > 0 ? (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl border transition-colors ${
                    msg.is_read
                      ? 'bg-white/[0.01] border-white/5 text-slate-400'
                      : 'bg-indigo-950/20 border-indigo-500/20 text-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold">{msg.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1">{msg.subject || 'Inquiry'}</p>
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/5 text-[11px]">
                    <a href={`mailto:${msg.email}`} className="text-indigo-400 hover:underline truncate">
                      {msg.email}
                    </a>
                    <button
                      onClick={() => handleMarkRead(msg.id, msg.is_read)}
                      className="text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {msg.is_read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No messages received yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
