import { motion } from 'framer-motion';
import { User, MapPin, GraduationCap, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import Card from '../ui/Card';

export default function About({ profile }) {
  if (!profile) return null;

  const highlights = profile.highlights || [];

  return (
    <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          badge="About Me"
          title="Engineering systems with craft and purpose."
          subtitle="A look behind the code, philosophy, and background driving my work."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Bio & Highlights (8 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6"
          >
            <Card className="p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                <span>The Story</span>
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {profile.bio_short || 'Student and passionate builder pursuing BCA at Panjab University, dedicated to crafting resilient full-stack systems and user-centric SaaS tools.'}
              </p>
              {profile.bio_long && (
                <p className="text-sm text-slate-400 leading-relaxed pt-2 border-t border-white/5">
                  {profile.bio_long}
                </p>
              )}
            </Card>

            {/* Core Highlights */}
            {highlights.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {highlights.map((item, idx) => (
                  <Card key={idx} className="p-4 flex items-start gap-3 hoverEffect">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-300 font-medium leading-snug">
                      {item}
                    </span>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Key Facts & Education Card (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Identity Card */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg">
                  AJ
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-100">{profile.full_name || 'Aaryan Jagga'}</h4>
                  <p className="text-xs text-indigo-400 font-medium">Code With Aaryan</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-white/5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Panjab University — BCA (Current)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{profile.location || 'Chandigarh, India'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300">Full-Stack & SaaS Focus</span>
                </div>
              </div>

              {profile.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 hover:text-white border border-white/10 transition-colors"
                >
                  <span>View Full Curriculum Vitae</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </Card>

            {/* Quick Principles Card */}
            <Card className="p-5 border border-indigo-500/15 bg-indigo-950/10">
              <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
                Engineering Creed
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Prioritize shipping working products over empty claims. Build fast, test rigorously, and maintain strict standards for UI precision and backend resilience.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
