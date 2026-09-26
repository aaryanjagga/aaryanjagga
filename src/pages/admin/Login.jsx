import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import HeroBackground from '../../components/common/HeroBackground';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // If already authenticated, redirect straight to /admin
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Authenticated successfully. Welcome back, Aaryan!');
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDemo = () => {
    setEmail('admin@aaryanjagga.dev');
    setPassword('AdminSecure2026!');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6">
      <HeroBackground />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-dropdown rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Admin Gateway</h1>
            <p className="text-xs text-slate-400">
              Private Content Management System for Aaryan Jagga
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Admin Email"
              type="email"
              placeholder="admin@aaryanjagga.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Admin Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to CMS
            </Button>
          </form>

          {/* Development Quick Fill Hint */}
          <div className="pt-4 border-t border-white/5 text-center">
            <button
              type="button"
              onClick={handleUseDemo}
              className="text-[11px] text-slate-500 hover:text-indigo-400 font-mono transition-colors cursor-pointer"
            >
              Use Initial Credentials (admin@aaryanjagga.dev)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
