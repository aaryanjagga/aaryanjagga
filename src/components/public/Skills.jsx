import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Code2, Cpu, Database, Terminal, Sparkles, Layout, Server, HardDrive, GitBranch, Binary, FileCode2, Palette, Network } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function Skills({ skills = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract categories dynamically
  const categories = useMemo(() => {
    if (!skills || skills.length === 0) return ['All'];
    const set = new Set(skills.map((s) => s.category));
    return ['All', ...Array.from(set)];
  }, [skills]);

  // Filter skills by category & search term
  const filteredSkills = useMemo(() => {
    if (!skills || skills.length === 0) return [];
    return skills.filter((skill) => {
      const matchCat = selectedCategory === 'All' || skill.category === selectedCategory;
      const matchQuery =
        !searchQuery ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (skill.description && skill.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [skills, selectedCategory, searchQuery]);

  if (!skills || skills.length === 0) return null;

  const getSkillIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
      case 'code':
      case 'code2': return <Code2 className="w-4 h-4 text-indigo-400" />;
      case 'filecode2': return <FileCode2 className="w-4 h-4 text-blue-400" />;
      case 'terminal': return <Terminal className="w-4 h-4 text-amber-400" />;
      case 'palette': return <Palette className="w-4 h-4 text-cyan-400" />;
      case 'layout': return <Layout className="w-4 h-4 text-orange-400" />;
      case 'server': return <Server className="w-4 h-4 text-emerald-400" />;
      case 'cpu': return <Cpu className="w-4 h-4 text-rose-400" />;
      case 'network': return <Network className="w-4 h-4 text-sky-400" />;
      case 'database': return <Database className="w-4 h-4 text-teal-400" />;
      case 'harddrive': return <HardDrive className="w-4 h-4 text-blue-400" />;
      case 'binary': return <Binary className="w-4 h-4 text-yellow-400" />;
      case 'gitbranch': return <GitBranch className="w-4 h-4 text-red-400" />;
      case 'sparkles': return <Sparkles className="w-4 h-4 text-purple-400" />;
      default: return <Code2 className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <section id="skills" className="py-20 sm:py-28 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          badge="Technical Skills"
          title="Engineered with modern tools & languages."
          subtitle="Proficiency across frontend interfaces, backend engines, databases, and development tooling."
        />

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl glass-panel w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-900/60 border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
            >
              <Card className="p-4 sm:p-5 hoverEffect group h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                        {getSkillIcon(skill.icon)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                          {skill.name}
                        </h4>
                        <span className="text-[11px] text-slate-400 block">{skill.category}</span>
                      </div>
                    </div>
                    {skill.experience_years && (
                      <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                        {skill.experience_years}
                      </span>
                    )}
                  </div>

                  {skill.description && (
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      {skill.description}
                    </p>
                  )}
                </div>

                {/* Proficiency Gauge */}
                <div className="pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Proficiency</span>
                    <span className="font-mono text-indigo-400 font-medium">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">
            No technologies found matching &quot;{searchQuery}&quot;.
          </div>
        )}
      </div>
    </section>
  );
}
