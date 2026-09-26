import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import HeroBackground from '../../components/common/HeroBackground';
import About from '../../components/public/About';
import Experience from '../../components/public/Experience';
import Education from '../../components/public/Education';
import Certifications from '../../components/public/Certifications';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';

export default function AboutPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getPortfolio()
      .then((res) => {
        if (isMounted) {
          setData(res);
          document.title = `About — ${res.profile?.full_name || 'Aaryan Jagga'}`;
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen relative selection:bg-indigo-500/30 selection:text-indigo-200">
      <HeroBackground />
      <Navbar profile={data?.profile} />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Home
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-8">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <>
              <About profile={data?.profile} />
              <Experience experience={data?.experience} />
              <Education education={data?.education} />
              <Certifications certifications={data?.certifications} />
            </>
          )}
        </div>
      </main>

      <Footer
        profile={data?.profile}
        socialLinks={data?.social_links}
        siteSettings={data?.site_settings}
      />
    </div>
  );
}
