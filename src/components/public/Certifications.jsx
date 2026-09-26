import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function Certifications({ certifications }) {
  if (!certifications || certifications.length === 0) return null;

  return (
    <section id="certifications" className="py-20 sm:py-28 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          badge="Credentials"
          title="Verified industry certifications & simulations."
          subtitle="Programs completed across engineering, cloud, data visualization, and software architecture."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <Card className="p-5 hoverEffect h-full flex flex-col justify-between group">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
                          {cert.issuer}
                        </span>
                        <h4 className="text-sm sm:text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                          {cert.name}
                        </h4>
                      </div>
                    </div>

                    {cert.is_featured ? (
                      <Badge variant="emerald" size="sm" dot>
                        Featured
                      </Badge>
                    ) : null}
                  </div>

                  {cert.description && (
                    <p className="text-xs text-slate-400 mt-2 mb-3 leading-relaxed">
                      {cert.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    {cert.issue_date && (
                      <span className="font-mono">{cert.issue_date}</span>
                    )}
                    {cert.credential_id && (
                      <span className="font-mono text-[11px] bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        ID: {cert.credential_id}
                      </span>
                    )}
                  </div>

                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
