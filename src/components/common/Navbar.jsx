import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, ArrowUpRight, ShieldCheck, Terminal } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ profile }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'About', href: '/about' },
    { name: 'Skills', href: '/#skills' },
    { name: 'Projects', href: '/projects' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Education', href: '/#education' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-4 transition-all duration-300 pointer-events-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl glass-panel text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-white transition-all hover:border-indigo-500/20 dark:hover:border-white/20 group"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400 group-hover:scale-105 transition-transform">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm tracking-tight gradient-text">
            {profile?.full_name || 'Aaryan Jagga'}
          </span>
          {profile?.is_available_for_work ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium border border-emerald-500/20 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              Available
            </span>
          ) : null}
        </Link>

        {/* Desktop Navigation Capsule */}
        <nav className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-2xl glass-panel shadow-lg shadow-black/5 dark:shadow-black/10">
          {navLinks.map((link) => (
            link.href.startsWith('/#') ? (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-black/5 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5 rounded-xl transition-all"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
                  location.pathname === link.href
                    ? 'text-slate-900 bg-slate-200/80 dark:text-white dark:bg-white/10 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-black/5 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            )
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          {/* Resume Link */}
          {profile?.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-200 dark:hover:text-white dark:border-white/10 transition-all"
            >
              <span>Resume</span>
              <ArrowUpRight className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            </a>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl glass-panel text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white hover:border-indigo-500/20 dark:hover:border-white/20 transition-all cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Logged in Admin Indicator (Discrete shortcut for owner) */}
          {isAuthenticated && (
            <Link
              to="/admin"
              className="p-2 rounded-xl glass-panel text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 hover:border-emerald-500/40 transition-all cursor-pointer"
              title="Admin Panel Active"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-xl glass-panel text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:border-indigo-500/20 dark:hover:border-white/20 transition-all cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-3 max-w-6xl mx-auto rounded-2xl glass-dropdown p-4 border border-slate-200/80 dark:border-white/10 shadow-2xl pointer-events-auto flex flex-col gap-1"
          >
            {navLinks.map((link) => (
              link.href.startsWith('/#') ? (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    if (location.pathname === '/') {
                      e.preventDefault();
                      handleNavClick(link.href);
                    } else {
                      setMobileMenuOpen(false);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-black/5 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5 transition-all text-left"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    location.pathname === link.href
                      ? 'text-slate-900 bg-slate-200/80 dark:text-white dark:bg-white/10 font-semibold'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-black/5 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              )
            ))}

            {profile?.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-600/10 dark:text-indigo-400 dark:border-indigo-500/20"
              >
                <span>Download Resume</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
