import express from 'express';
import db from '../db.js';

const router = express.Router();

function safeJsonParse(data, fallback = []) {
  if (!data) return fallback;
  try {
    return JSON.parse(data);
  } catch (e) {
    return fallback;
  }
}

// GET /api/portfolio - All data for instantaneous, unified portfolio loading
router.get('/portfolio', (req, res) => {
  try {
    const rawProfile = db.prepare('SELECT * FROM profile WHERE id = 1').get() || {};
    const profile = {
      ...rawProfile,
      highlights: safeJsonParse(rawProfile.highlights_json, [])
    };

    const education = db.prepare('SELECT * FROM education ORDER BY display_order ASC, start_date DESC').all();

    const skills = db.prepare('SELECT * FROM skills ORDER BY display_order ASC, proficiency DESC').all();

    const rawProjects = db.prepare('SELECT * FROM projects ORDER BY display_order ASC, id DESC').all();
    const projects = rawProjects.map(p => ({
      ...p,
      gallery: safeJsonParse(p.gallery_json, []),
      technologies: safeJsonParse(p.technologies_json, [])
    }));

    const rawExperience = db.prepare('SELECT * FROM experience ORDER BY display_order ASC, start_date DESC').all();
    const experience = rawExperience.map(e => ({
      ...e,
      responsibilities: safeJsonParse(e.responsibilities_json, []),
      technologies: safeJsonParse(e.technologies_json, [])
    }));

    const certifications = db.prepare('SELECT * FROM certifications ORDER BY display_order ASC, issue_date DESC').all();

    const achievements = db.prepare('SELECT * FROM achievements ORDER BY display_order ASC').all();

    const rawServices = db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC').all();
    const services = rawServices.map(s => ({
      ...s,
      features: safeJsonParse(s.features_json, [])
    }));

    const social_links = db.prepare('SELECT * FROM social_links WHERE is_visible = 1 ORDER BY display_order ASC').all();

    const site_settings = db.prepare('SELECT * FROM site_settings WHERE id = 1').get() || {};

    res.json({
      profile,
      education,
      skills,
      projects,
      experience,
      certifications,
      achievements,
      services,
      social_links,
      site_settings
    });
  } catch (err) {
    console.error('Error fetching portfolio data:', err);
    res.status(500).json({ error: 'Failed to fetch portfolio data' });
  }
});

// GET /api/projects/:slug - Detailed single project
router.get('/projects/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const project = db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      ...project,
      gallery: safeJsonParse(project.gallery_json, []),
      technologies: safeJsonParse(project.technologies_json, [])
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
});

// POST /api/contact - Public contact submission
router.post('/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    const settings = db.prepare('SELECT allow_messages FROM site_settings WHERE id = 1').get();
    if (settings && settings.allow_messages === 0) {
      return res.status(403).json({ error: 'Message submissions are currently disabled' });
    }

    const info = db.prepare(`
      INSERT INTO messages (name, email, subject, message, is_read)
      VALUES (?, ?, ?, ?, 0)
    `).run(name.trim(), email.trim(), (subject || 'General Inquiry').trim(), message.trim());

    res.status(201).json({
      success: true,
      message: 'Your message has been delivered to Aaryan Jagga.',
      messageId: info.lastInsertRowid
    });
  } catch (err) {
    console.error('Error handling contact submission:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

export default router;
