import { motion } from 'framer-motion';
import { Rocket, Award, CheckCircle2, Trophy, Star, ExternalLink } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import Card from '../ui/Card';

export default function Achievements({ achievements }) {
  if (!achievements || achievements.length === 0) return null;

  const getAchievementIcon = (icon) => {
    switch (icon?.toLowerCase()) {
      case 'rocket': return <Rocket className="w-5 h-5 text-indigo-400" />;
      case 'award': return <Award className="w-5 h-5 text-amber-400" />;
      case 'checkcircle2': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'star': return <Star className="w-5 h-5 text-purple-400" />;
      default: return <Trophy className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <section id="achievements" className="py-20 sm:py-28 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          badge="Milestones"
          title="Key accomplishments & technical initiatives."
          subtitle="Significant milestones across shipping products, independent building, and community."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {achievements.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
            >
              <Card className="p-6 hoverEffect h-full flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getAchievementIcon(item.icon)}
                    </div>
                    {item.date && (
                      <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                        {item.date}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors mb-2">
                    {item.title}
                  </h4>

                  {item.organization && (
                    <p className="text-xs font-semibold text-indigo-400 mb-2">
                      {item.organization}
                    </p>
                  )}

                  {item.description && (
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {item.link && (
                  <div className="pt-4 border-t border-white/5 mt-4">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <span>Explore details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
