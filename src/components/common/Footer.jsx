import { Link } from 'react-router-dom';
import { Globe, Terminal, ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon, YoutubeIcon } from './SocialIcons';

export default function Footer({ profile, socialLinks, siteSettings }) {
  const getSocialIcon = (platform) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return <GithubIcon className="w-4 h-4" />;
    if (p.includes('linkedin')) return <LinkedinIcon className="w-4 h-4" />;
    if (p.includes('twitter') || p.includes('x')) return <TwitterIcon className="w-4 h-4" />;
    if (p.includes('youtube')) return <YoutubeIcon className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-slate-200/80 dark:border-white/10 bg-slate-100/60 dark:bg-slate-950/40 backdrop-blur-xl mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight gradient-text">
                {profile?.full_name || 'Aaryan Jagga'}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              {profile?.short_tagline || 'Building digital products that turn ideas into reality.'}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {socialLinks && socialLinks.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="w-8 h-8 rounded-xl bg-slate-200/60 hover:bg-slate-200 border border-slate-300/60 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all hover:scale-105"
                >
                  {getSocialIcon(s.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-wider">Navigation</p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</Link></li>
              <li><Link to="/projects" className="hover:text-slate-900 dark:hover:text-white transition-colors">Projects</Link></li>
              <li><Link to="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link></li>
              {profile?.resume_url && (
                <li>
                  <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Resume
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Back to top & Info */}
          <div className="flex flex-col justify-between items-start md:items-end">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-200/60 hover:bg-slate-200 border border-slate-300/60 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 text-xs text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <div className="mt-6 md:mt-0 text-left md:text-right">
              <span className="text-[11px] text-slate-500 block">Status</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5 md:justify-end mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {profile?.full_name || 'Aaryan Jagga'}. {siteSettings?.footer_text || 'All rights reserved.'}</p>
          <div className="flex items-center gap-4">
            <span>Built with React & SQLite</span>
            <span>•</span>
            <Link
              to="/admin/login"
              className="text-slate-500 hover:text-slate-800 dark:text-slate-600 dark:hover:text-slate-400 transition-colors"
              title="Private Management Portal"
            >
              CMS Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
