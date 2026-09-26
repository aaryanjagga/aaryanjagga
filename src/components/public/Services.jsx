import { motion } from 'framer-motion';
import { Layers, Sparkles, Palette, Server, ArrowRight, Check } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function Services({ services }) {
  if (!services || services.length === 0) return null;

  const getServiceIcon = (icon) => {
    switch (icon?.toLowerCase()) {
      case 'sparkles': return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'palette': return <Palette className="w-5 h-5 text-emerald-400" />;
      case 'server': return <Server className="w-5 h-5 text-purple-400" />;
      default: return <Layers className="w-5 h-5 text-indigo-400" />;
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-20 sm:py-28 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          badge="Capabilities"
          title="What I build & architect."
          subtitle="Specialized services spanning full-stack web applications, SaaS MVPs, and modern frontend systems."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const features = service.features || [];

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Card className="p-6 sm:p-7 hoverEffect h-full flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                      {getServiceIcon(service.icon)}
                    </div>

                    <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors mb-2.5">
                      {service.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Features list */}
                    {features.length > 0 && (
                      <div className="space-y-2.5 pt-4 border-t border-white/5">
                        {features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                            <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-emerald-400" />
                            </div>
                            <span className="leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/5 mt-6">
                    <button
                      onClick={scrollToContact}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer group-hover:translate-x-1 duration-200"
                    >
                      <span>Inquire about this capability</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
