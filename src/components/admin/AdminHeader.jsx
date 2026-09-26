import { Menu, ExternalLink, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';

export default function AdminHeader({ title, onOpenSidebar }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-slate-950/60 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl glass-panel text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-xl glass-panel text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white transition-all cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        <a href="/" target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
            View Live Site
          </Button>
        </a>
      </div>
    </header>
  );
}
