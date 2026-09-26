import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import SectionHeading from '../common/SectionHeading';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

export default function Contact({ profile, siteSettings }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.sendMessage(formData);
      setIsSuccess(true);
      toast.success('Your message has been delivered to Aaryan Jagga!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          badge="Get in Touch"
          title="Let's build something exceptional."
          subtitle="Have a project in mind, an opportunity to discuss, or want to collaborate? Send a direct dispatch below."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info & Status (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 space-y-4"
          >
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                <span>Direct Channels</span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                I am consistently active and open to discussing full-stack development, SaaS architecture, or innovative product collaborations.
              </p>

              <div className="space-y-3 pt-3 border-t border-white/5 text-xs text-slate-300">
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-slate-500 block">Email Dispatch</span>
                      <span className="text-slate-200 font-mono truncate block">{profile.email}</span>
                    </div>
                  </a>
                )}

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Location</span>
                    <span className="text-slate-200">{profile?.location || 'Chandigarh, India'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Current Status</span>
                    <span className="text-emerald-400 font-medium">Available for select projects</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right: Contact Form (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7"
          >
            <Card className="p-6 sm:p-8">
              {isSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-100">Message Delivered</h4>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    Thank you for reaching out! Your message has been saved in my inbox. I will reply to you as soon as possible.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSuccess(false)}
                    className="mt-4"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name *"
                      name="name"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Your Email *"
                      name="email"
                      type="email"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Input
                    label="Subject"
                    name="subject"
                    placeholder="Project Inquiry / Opportunity"
                    value={formData.subject}
                    onChange={handleChange}
                  />

                  <Textarea
                    label="Message *"
                    name="message"
                    rows={5}
                    placeholder="Tell me about your product, project scope, or idea..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto"
                      isLoading={isSubmitting}
                      rightIcon={<Send className="w-4 h-4" />}
                    >
                      Send Message
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
