import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Public Pages
import Home from './pages/public/Home';
import ProjectsPage from './pages/public/ProjectsPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import NotFound from './pages/public/NotFound';

// Admin CMS Components & Pages
import AdminLayout from './components/admin/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProfileAdmin from './pages/admin/ProfileAdmin';
import ProjectsAdmin from './pages/admin/ProjectsAdmin';
import SkillsAdmin from './pages/admin/SkillsAdmin';
import ExperienceAdmin from './pages/admin/ExperienceAdmin';
import EducationAdmin from './pages/admin/EducationAdmin';
import CertificationsAdmin from './pages/admin/CertificationsAdmin';
import AchievementsAdmin from './pages/admin/AchievementsAdmin';
import ServicesAdmin from './pages/admin/ServicesAdmin';
import SocialsAdmin from './pages/admin/SocialsAdmin';
import MessagesAdmin from './pages/admin/MessagesAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Only scroll to top if not an anchor link navigation
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Public Portfolio Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Private Admin CMS Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<AdminLayout title="Overview" />}>
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<ProfileAdmin />} />
                <Route path="projects" element={<ProjectsAdmin />} />
                <Route path="skills" element={<SkillsAdmin />} />
                <Route path="experience" element={<ExperienceAdmin />} />
                <Route path="education" element={<EducationAdmin />} />
                <Route path="certifications" element={<CertificationsAdmin />} />
                <Route path="achievements" element={<AchievementsAdmin />} />
                <Route path="services" element={<ServicesAdmin />} />
                <Route path="socials" element={<SocialsAdmin />} />
                <Route path="messages" element={<MessagesAdmin />} />
                <Route path="settings" element={<SettingsAdmin />} />
              </Route>

              {/* 404 Custom Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
