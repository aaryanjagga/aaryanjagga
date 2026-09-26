import { Link } from 'react-router-dom';
import { Terminal, Home } from 'lucide-react';
import Button from '../../components/ui/Button';
import HeroBackground from '../../components/common/HeroBackground';

export default function NotFound() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 text-center">
      <HeroBackground />

      <div className="relative z-10 max-w-md mx-auto glass-panel rounded-2xl p-8 border border-white/10 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-5">
          <Terminal className="w-7 h-7" />
        </div>

        <span className="font-mono text-xs font-semibold text-indigo-400 uppercase tracking-widest block mb-1">
          Error 404
        </span>

        <h1 className="text-3xl font-bold text-slate-100 mb-3">
          Page Not Found
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed mb-6">
          The route you are attempting to access does not exist or has been shifted in the architecture.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
