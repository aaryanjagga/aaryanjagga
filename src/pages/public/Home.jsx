import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import HeroBackground from '../../components/common/HeroBackground';
import Hero from '../../components/public/Hero';
import About from '../../components/public/About';
import Skills from '../../components/public/Skills';
import Projects from '../../components/public/Projects';
import Experience from '../../components/public/Experience';
import Education from '../../components/public/Education';
import Certifications from '../../components/public/Certifications';
import Achievements from '../../components/public/Achievements';
import Services from '../../components/public/Services';
import Contact from '../../components/public/Contact';
import Skeleton from '../../components/ui/Skeleton';

export default function Home() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadPortfolioData = async () => {
      try {
        const res = await api.getPortfolio();
        if (isMounted) {
          setData(res);
          // Set dynamic document title and meta description
          if (res.site_settings?.site_title) {
            document.title = res.site_settings.site_title;
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load portfolio data');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadPortfolioData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center animate-pulse">
          <div className="w-5 h-5 rounded-md bg-indigo-500 animate-spin" />
        </div>
        <p className="text-sm font-mono text-slate-500 dark:text-slate-400">Initializing digital workspace...</p>
        <div className="w-64 space-y-2">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-3/4 mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-rose-400 mb-2">Connection Problem</h2>
        <p className="text-sm text-slate-400 max-w-md mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const {
    profile,
    education,
    skills,
    projects,
    experience,
    certifications,
    achievements,
    services,
    social_links,
    site_settings,
  } = data || {};

  return (
    <div className="min-h-screen relative selection:bg-indigo-500/30 selection:text-indigo-200">
      <HeroBackground />
      <Navbar profile={profile} />

      <main className="relative z-10">
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience experience={experience} />
        <Education education={education} />
        <Certifications certifications={certifications} />
        <Achievements achievements={achievements} />
        <Services services={services} />
        <Contact profile={profile} siteSettings={site_settings} />
      </main>

      <Footer
        profile={profile}
        socialLinks={social_links}
        siteSettings={site_settings}
      />
    </div>
  );
}
