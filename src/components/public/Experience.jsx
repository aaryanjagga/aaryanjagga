import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section id="experience" className="py-20 sm:py-28 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          badge="Career Journey"
          title="Practical engineering & industry experience."
          subtitle="Internships, leadership ambassadorships, and technical software contributions."
        />

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-8 border-l border-white/10 space-y-10 sm:space-y-12">
          {experience.map((item, index) => {
            const responsibilities = item.responsibilities || [];
            const technologies = item.technologies || [];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="relative group"
              >
                {/* Timeline node */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-indigo-500 flex items-center justify-center group-hover:scale-125 group-hover:bg-indigo-500 transition-all">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:bg-white" />
                </div>

                <Card className="p-5 sm:p-7 hoverEffect">
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {item.role}
                      </h3>
                      <p className="text-sm font-semibold text-indigo-400 mt-0.5">
                        {item.company}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="indigo" size="sm">
                        {item.employment_type || 'Internship'}
                      </Badge>
                      {item.is_current ? (
                        <Badge variant="emerald" size="sm" dot>
                          Current
                        </Badge>
                      ) : null}
                    </div>
                  </div>

                  {/* Date & Location */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-4 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.start_date} {item.end_date ? `— ${item.end_date}` : item.is_current ? '— Present' : ''}</span>
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  {item.description && (
                    <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Responsibilities list */}
                  {responsibilities.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {responsibilities.map((resp, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{resp}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech stack */}
                  {technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                      {technologies.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white/5 text-slate-300 border border-white/5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
