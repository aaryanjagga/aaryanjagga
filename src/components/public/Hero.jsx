import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Terminal, FileText, Code2, Database, Layers } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function Hero({ profile }) {
  const heading = profile?.hero_heading || 'Building digital products that turn ideas into reality.';
  const description = profile?.hero_description || 'Full-Stack Developer, SaaS builder, and product architect focused on crafting clean, high-performance web applications and intuitive digital experiences.';

  const handleCtaClick = (url) => {
    if (url?.startsWith('#')) {
      const el = document.getElementById(url.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (url) {
      window.location.href = url;
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center text-center">
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-indigo-500/20 text-xs font-medium text-slate-300 shadow-lg shadow-indigo-500/5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200">Aaryan Jagga</span>
            <span className="text-slate-500">•</span>
            <span className="text-indigo-400 font-semibold">Full-Stack & SaaS Builder</span>
          </div>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6"
        >
          <span className="gradient-text">{heading}</span>
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10"
        >
          {description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mb-16"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => handleCtaClick(profile?.cta_primary_url || '#projects')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {profile?.cta_primary_text || 'Explore Projects'}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleCtaClick(profile?.cta_secondary_url || '#contact')}
          >
            {profile?.cta_secondary_text || "Let's Connect"}
          </Button>

          {profile?.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Resume</span>
            </a>
          )}
        </motion.div>

        {/* Interactive Technical Product Showcase Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-3xl glass-panel rounded-2xl p-4 sm:p-6 text-left border border-white/10 shadow-2xl relative overflow-hidden group"
        >
          {/* Top Bar with mock dots */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-[11px] text-slate-400">aaryan.config.ts</span>
            </div>
            <span className="font-mono text-[11px] text-indigo-400">builder-mode: active</span>
          </div>

          {/* Interactive Code Preview */}
          <div className="py-4 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed overflow-x-auto">
            <p className="text-slate-500">// Personal Brand & Product Architecture</p>
            <p>
              <span className="text-purple-400">const</span> <span className="text-indigo-300">developer</span> = &#123;
            </p>
            <p className="pl-4">
              name: <span className="text-emerald-300">&apos;{profile?.full_name || 'Aaryan Jagga'}&apos;</span>,
            </p>
            <p className="pl-4">
              education: <span className="text-emerald-300">&apos;BCA — Panjab University&apos;</span>,
            </p>
            <p className="pl-4">
              stack: [<span className="text-amber-300">&apos;React&apos;</span>, <span className="text-amber-300">&apos;TypeScript&apos;</span>, <span className="text-amber-300">&apos;Node.js&apos;</span>, <span className="text-amber-300">&apos;Tailwind CSS&apos;</span>, <span className="text-amber-300">&apos;SQLite&apos;</span>],
            </p>
            <p className="pl-4">
              focus: <span className="text-emerald-300">&apos;End-to-End SaaS, High-Performance Web Apps, Clean Systems&apos;</span>,
            </p>
            <p>&#125;;</p>
          </div>

          {/* Bottom Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5">
            <Badge variant="indigo" size="sm">
              <Code2 className="w-3 h-3 mr-1" /> Full Stack
            </Badge>
            <Badge variant="emerald" size="sm">
              <Layers className="w-3 h-3 mr-1" /> Clean Architecture
            </Badge>
            <Badge variant="purple" size="sm">
              <Sparkles className="w-3 h-3 mr-1" /> Modern Motion
            </Badge>
            <Badge variant="cyan" size="sm">
              <Database className="w-3 h-3 mr-1" /> Real SQLite DB
            </Badge>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
