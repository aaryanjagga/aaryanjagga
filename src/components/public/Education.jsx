import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, BookOpen, Award } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function Education({ education }) {
  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="py-20 sm:py-28 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          badge="Academics"
          title="Formal foundations in computing."
          subtitle="Theoretical computer science, software engineering curricula, and university coursework."
        />

        <div className="space-y-6">
          {education.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="p-6 sm:p-8 hoverEffect">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-100">
                        {item.degree}
                      </h3>
                      <p className="text-sm font-semibold text-indigo-400 mt-0.5">
                        {item.institution}
                      </p>
                      {item.field_of_study && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {item.field_of_study}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start">
                    {item.is_current ? (
                      <Badge variant="emerald" size="sm" dot>Current Student</Badge>
                    ) : null}
                    {item.grade_cgpa && (
                      <Badge variant="indigo" size="sm">{item.grade_cgpa}</Badge>
                    )}
                  </div>
                </div>

                {/* Timeline and Location */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-4 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.start_date} — {item.end_date || (item.is_current ? 'Present' : '')}</span>
                  </div>
                  {item.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {item.description && (
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {item.description}
                  </p>
                )}

                {/* Coursework */}
                {item.coursework && (
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Key Curricular Focus:</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-mono">
                      {item.coursework}
                    </p>
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
