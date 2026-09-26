import express from 'express';
import db from '../db.js';
import { requireAuth } from '../auth.js';

const router = express.Router();

// Apply auth middleware to ALL admin routes
router.use(requireAuth);

function safeJsonParse(data, fallback = []) {
  if (!data) return fallback;
  try {
    return JSON.parse(data);
  } catch (e) {
    return fallback;
  }
}

// ----------------------------------------------------
// STATS / DASHBOARD OVERVIEW
// ----------------------------------------------------
router.get('/stats', (req, res) => {
  try {
    const totalProjects = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
    const totalSkills = db.prepare('SELECT COUNT(*) as count FROM skills').get().count;
    const totalEducation = db.prepare('SELECT COUNT(*) as count FROM education').get().count;
    const totalExperience = db.prepare('SELECT COUNT(*) as count FROM experience').get().count;
    const totalCerts = db.prepare('SELECT COUNT(*) as count FROM certifications').get().count;
    const totalAchievements = db.prepare('SELECT COUNT(*) as count FROM achievements').get().count;
    const totalServices = db.prepare('SELECT COUNT(*) as count FROM services').get().count;
    const totalMessages = db.prepare('SELECT COUNT(*) as count FROM messages').get().count;
    const unreadMessages = db.prepare('SELECT COUNT(*) as count FROM messages WHERE is_read = 0').get().count;

    const recentProjects = db.prepare('SELECT id, name, category, status, is_featured, created_at FROM projects ORDER BY id DESC LIMIT 5').all();
    const recentMessages = db.prepare('SELECT id, name, email, subject, message, is_read, created_at FROM messages ORDER BY created_at DESC LIMIT 5').all();

    res.json({
      counts: {
        projects: totalProjects,
        skills: totalSkills,
        education: totalEducation,
        experience: totalExperience,
        certifications: totalCerts,
        achievements: totalAchievements,
        services: totalServices,
        messages: totalMessages,
        unreadMessages
      },
      recentProjects,
      recentMessages
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// ----------------------------------------------------
// PROFILE MANAGEMENT
// ----------------------------------------------------
router.get('/profile', (req, res) => {
  try {
    const raw = db.prepare('SELECT * FROM profile WHERE id = 1').get() || {};
    res.json({
      ...raw,
      highlights: safeJsonParse(raw.highlights_json, [])
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/profile', (req, res) => {
  try {
    const {
      full_name, professional_title, short_tagline, hero_heading, hero_description,
      cta_primary_text, cta_primary_url, cta_secondary_text, cta_secondary_url,
      bio_short, bio_long, highlights, avatar_url, location, email, phone,
      resume_url, github_url, linkedin_url, website_url, is_available_for_work
    } = req.body;

    const highlights_json = JSON.stringify(highlights || []);

    db.prepare(`
      UPDATE profile SET
        full_name = ?, professional_title = ?, short_tagline = ?, hero_heading = ?, hero_description = ?,
        cta_primary_text = ?, cta_primary_url = ?, cta_secondary_text = ?, cta_secondary_url = ?,
        bio_short = ?, bio_long = ?, highlights_json = ?, avatar_url = ?, location = ?,
        email = ?, phone = ?, resume_url = ?, github_url = ?, linkedin_url = ?,
        website_url = ?, is_available_for_work = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).run(
      full_name || '', professional_title || '', short_tagline || '', hero_heading || '', hero_description || '',
      cta_primary_text || 'Explore Projects', cta_primary_url || '#projects',
      cta_secondary_text || 'Get in Touch', cta_secondary_url || '#contact',
      bio_short || '', bio_long || '', highlights_json, avatar_url || '', location || '',
      email || '', phone || '', resume_url || '', github_url || '', linkedin_url || '',
      website_url || '', is_available_for_work ? 1 : 0
    );

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ----------------------------------------------------
// PROJECTS CRUD
// ----------------------------------------------------
router.get('/projects', (req, res) => {
  try {
    const raw = db.prepare('SELECT * FROM projects ORDER BY display_order ASC, id DESC').all();
    const projects = raw.map(p => ({
      ...p,
      gallery: safeJsonParse(p.gallery_json, []),
      technologies: safeJsonParse(p.technologies_json, [])
    }));
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/projects', (req, res) => {
  try {
    const {
      name, slug, short_desc, full_desc, image_url, gallery, technologies,
      github_url, live_url, case_study_url, category, status, is_featured,
      start_date, end_date, display_order
    } = req.body;

    if (!name || !short_desc) {
      return res.status(400).json({ error: 'Project name and short description are required' });
    }

    const finalSlug = slug ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const info = db.prepare(`
      INSERT INTO projects (
        name, slug, short_desc, full_desc, image_url, gallery_json, technologies_json,
        github_url, live_url, case_study_url, category, status, is_featured,
        start_date, end_date, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, finalSlug, short_desc, full_desc || '', image_url || '',
      JSON.stringify(gallery || []), JSON.stringify(technologies || []),
      github_url || '', live_url || '', case_study_url || '',
      category || 'Full-Stack', status || 'Completed', is_featured ? 1 : 0,
      start_date || '', end_date || '', display_order || 0
    );

    res.status(201).json({ success: true, id: info.lastInsertRowid, message: 'Project created successfully' });
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ error: err.message.includes('UNIQUE') ? 'A project with this slug already exists' : 'Failed to create project' });
  }
});

router.put('/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, slug, short_desc, full_desc, image_url, gallery, technologies,
      github_url, live_url, case_study_url, category, status, is_featured,
      start_date, end_date, display_order
    } = req.body;

    const finalSlug = slug ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    db.prepare(`
      UPDATE projects SET
        name = ?, slug = ?, short_desc = ?, full_desc = ?, image_url = ?,
        gallery_json = ?, technologies_json = ?, github_url = ?, live_url = ?,
        case_study_url = ?, category = ?, status = ?, is_featured = ?,
        start_date = ?, end_date = ?, display_order = ?
      WHERE id = ?
    `).run(
      name, finalSlug, short_desc, full_desc || '', image_url || '',
      JSON.stringify(gallery || []), JSON.stringify(technologies || []),
      github_url || '', live_url || '', case_study_url || '',
      category || 'Full-Stack', status || 'Completed', is_featured ? 1 : 0,
      start_date || '', end_date || '', display_order || 0,
      id
    );

    res.json({ success: true, message: 'Project updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/projects/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ----------------------------------------------------
// SKILLS CRUD
// ----------------------------------------------------
router.get('/skills', (req, res) => {
  try {
    const skills = db.prepare('SELECT * FROM skills ORDER BY display_order ASC, proficiency DESC').all();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

router.post('/skills', (req, res) => {
  try {
    const { name, category, icon, proficiency, experience_years, description, is_featured, display_order } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'Skill name and category are required' });
    }

    const info = db.prepare(`
      INSERT INTO skills (name, category, icon, proficiency, experience_years, description, is_featured, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, category, icon || 'Code', proficiency || 80,
      experience_years || '', description || '', is_featured ? 1 : 0, display_order || 0
    );

    res.status(201).json({ success: true, id: info.lastInsertRowid, message: 'Skill created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

router.put('/skills/:id', (req, res) => {
  try {
    const { name, category, icon, proficiency, experience_years, description, is_featured, display_order } = req.body;
    db.prepare(`
      UPDATE skills SET
        name = ?, category = ?, icon = ?, proficiency = ?,
        experience_years = ?, description = ?, is_featured = ?, display_order = ?
      WHERE id = ?
    `).run(
      name, category, icon || 'Code', proficiency || 80,
      experience_years || '', description || '', is_featured ? 1 : 0, display_order || 0,
      req.params.id
    );

    res.json({ success: true, message: 'Skill updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

router.delete('/skills/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM skills WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// ----------------------------------------------------
// EDUCATION CRUD
// ----------------------------------------------------
router.get('/education', (req, res) => {
  try {
    const edu = db.prepare('SELECT * FROM education ORDER BY display_order ASC, start_date DESC').all();
    res.json(edu);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch education records' });
  }
});

router.post('/education', (req, res) => {
  try {
    const {
      institution, degree, field_of_study, start_date, end_date, is_current,
      description, grade_cgpa, location, logo_url, coursework, display_order
    } = req.body;

    if (!institution || !degree) {
      return res.status(400).json({ error: 'Institution and degree are required' });
    }

    const info = db.prepare(`
      INSERT INTO education (
        institution, degree, field_of_study, start_date, end_date, is_current,
        description, grade_cgpa, location, logo_url, coursework, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      institution, degree, field_of_study || '', start_date || '', end_date || '',
      is_current ? 1 : 0, description || '', grade_cgpa || '', location || '',
      logo_url || '', coursework || '', display_order || 0
    );

    res.status(201).json({ success: true, id: info.lastInsertRowid, message: 'Education record added' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create education record' });
  }
});

router.put('/education/:id', (req, res) => {
  try {
    const {
      institution, degree, field_of_study, start_date, end_date, is_current,
      description, grade_cgpa, location, logo_url, coursework, display_order
    } = req.body;

    db.prepare(`
      UPDATE education SET
        institution = ?, degree = ?, field_of_study = ?, start_date = ?, end_date = ?,
        is_current = ?, description = ?, grade_cgpa = ?, location = ?, logo_url = ?,
        coursework = ?, display_order = ?
      WHERE id = ?
    `).run(
      institution, degree, field_of_study || '', start_date || '', end_date || '',
      is_current ? 1 : 0, description || '', grade_cgpa || '', location || '',
      logo_url || '', coursework || '', display_order || 0,
      req.params.id
    );

    res.json({ success: true, message: 'Education record updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update education record' });
  }
});

router.delete('/education/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM education WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Education record deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete education record' });
  }
});

// ----------------------------------------------------
// EXPERIENCE CRUD
// ----------------------------------------------------
router.get('/experience', (req, res) => {
  try {
    const raw = db.prepare('SELECT * FROM experience ORDER BY display_order ASC, start_date DESC').all();
    const exp = raw.map(e => ({
      ...e,
      responsibilities: safeJsonParse(e.responsibilities_json, []),
      technologies: safeJsonParse(e.technologies_json, [])
    }));
    res.json(exp);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch experience records' });
  }
});

router.post('/experience', (req, res) => {
  try {
    const {
      company, role, employment_type, start_date, end_date, is_current,
      description, responsibilities, technologies, company_logo, location, display_order
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({ error: 'Company and role are required' });
    }

    const info = db.prepare(`
      INSERT INTO experience (
        company, role, employment_type, start_date, end_date, is_current,
        description, responsibilities_json, technologies_json, company_logo, location, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      company, role, employment_type || 'Internship', start_date || '', end_date || '',
      is_current ? 1 : 0, description || '', JSON.stringify(responsibilities || []),
      JSON.stringify(technologies || []), company_logo || '', location || '', display_order || 0
    );

    res.status(201).json({ success: true, id: info.lastInsertRowid, message: 'Experience created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create experience record' });
  }
});

router.put('/experience/:id', (req, res) => {
  try {
    const {
      company, role, employment_type, start_date, end_date, is_current,
      description, responsibilities, technologies, company_logo, location, display_order
    } = req.body;

    db.prepare(`
      UPDATE experience SET
        company = ?, role = ?, employment_type = ?, start_date = ?, end_date = ?,
        is_current = ?, description = ?, responsibilities_json = ?, technologies_json = ?,
        company_logo = ?, location = ?, display_order = ?
      WHERE id = ?
    `).run(
      company, role, employment_type || 'Internship', start_date || '', end_date || '',
      is_current ? 1 : 0, description || '', JSON.stringify(responsibilities || []),
      JSON.stringify(technologies || []), company_logo || '', location || '', display_order || 0,
      req.params.id
    );

    res.json({ success: true, message: 'Experience updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update experience record' });
  }
});

router.delete('/experience/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM experience WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Experience record deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

// ----------------------------------------------------
// CERTIFICATIONS CRUD
// ----------------------------------------------------
router.get('/certifications', (req, res) => {
  try {
    const certs = db.prepare('SELECT * FROM certifications ORDER BY display_order ASC, issue_date DESC').all();
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
});

router.post('/certifications', (req, res) => {
  try {
    const { name, issuer, issue_date, credential_id, credential_url, certificate_image, description, is_featured, display_order } = req.body;
    if (!name || !issuer) {
      return res.status(400).json({ error: 'Certificate name and issuer are required' });
    }

    const info = db.prepare(`
      INSERT INTO certifications (
        name, issuer, issue_date, credential_id, credential_url, certificate_image, description, is_featured, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, issuer, issue_date || '', credential_id || '', credential_url || '',
      certificate_image || '', description || '', is_featured ? 1 : 0, display_order || 0
    );

    res.status(201).json({ success: true, id: info.lastInsertRowid, message: 'Certification created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create certification' });
  }
});

router.put('/certifications/:id', (req, res) => {
  try {
    const { name, issuer, issue_date, credential_id, credential_url, certificate_image, description, is_featured, display_order } = req.body;
    db.prepare(`
      UPDATE certifications SET
        name = ?, issuer = ?, issue_date = ?, credential_id = ?, credential_url = ?,
        certificate_image = ?, description = ?, is_featured = ?, display_order = ?
      WHERE id = ?
    `).run(
      name, issuer, issue_date || '', credential_id || '', credential_url || '',
      certificate_image || '', description || '', is_featured ? 1 : 0, display_order || 0,
      req.params.id
    );

    res.json({ success: true, message: 'Certification updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update certification' });
  }
});

router.delete('/certifications/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM certifications WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Certification deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete certification' });
  }
});

// ----------------------------------------------------
// ACHIEVEMENTS CRUD
// ----------------------------------------------------
router.get('/achievements', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM achievements ORDER BY display_order ASC').all();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

router.post('/achievements', (req, res) => {
  try {
    const { title, description, date, organization, icon, link, is_featured, display_order } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Achievement title is required' });
    }

    const info = db.prepare(`
      INSERT INTO achievements (title, description, date, organization, icon, link, is_featured, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title, description || '', date || '', organization || '',
      icon || 'Award', link || '', is_featured ? 1 : 0, display_order || 0
    );

    res.status(201).json({ success: true, id: info.lastInsertRowid, message: 'Achievement created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create achievement' });
  }
});

router.put('/achievements/:id', (req, res) => {
  try {
    const { title, description, date, organization, icon, link, is_featured, display_order } = req.body;
    db.prepare(`
      UPDATE achievements SET
        title = ?, description = ?, date = ?, organization = ?, icon = ?,
        link = ?, is_featured = ?, display_order = ?
      WHERE id = ?
    `).run(
      title, description || '', date || '', organization || '',
      icon || 'Award', link || '', is_featured ? 1 : 0, display_order || 0,
      req.params.id
    );

    res.json({ success: true, message: 'Achievement updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update achievement' });
  }
});

router.delete('/achievements/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM achievements WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Achievement deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete achievement' });
  }
});

// ----------------------------------------------------
// SERVICES CRUD
// ----------------------------------------------------
router.get('/services', (req, res) => {
  try {
    const raw = db.prepare('SELECT * FROM services ORDER BY display_order ASC').all();
    const services = raw.map(s => ({
      ...s,
      features: safeJsonParse(s.features_json, [])
    }));
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.post('/services', (req, res) => {
  try {
    const { title, description, icon, features, is_active, display_order } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Service title and description are required' });
    }

    const info = db.prepare(`
      INSERT INTO services (title, description, icon, features_json, is_active, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      title, description, icon || 'Layers', JSON.stringify(features || []),
      is_active !== undefined ? (is_active ? 1 : 0) : 1, display_order || 0
    );

    res.status(201).json({ success: true, id: info.lastInsertRowid, message: 'Service created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

router.put('/services/:id', (req, res) => {
  try {
    const { title, description, icon, features, is_active, display_order } = req.body;
    db.prepare(`
      UPDATE services SET
        title = ?, description = ?, icon = ?, features_json = ?,
        is_active = ?, display_order = ?
      WHERE id = ?
    `).run(
      title, description, icon || 'Layers', JSON.stringify(features || []),
      is_active ? 1 : 0, display_order || 0,
      req.params.id
    );

    res.json({ success: true, message: 'Service updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

router.delete('/services/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// ----------------------------------------------------
// SOCIAL LINKS CRUD
// ----------------------------------------------------
router.get('/socials', (req, res) => {
  try {
    const socials = db.prepare('SELECT * FROM social_links ORDER BY display_order ASC').all();
    res.json(socials);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch social links' });
  }
});

router.post('/socials', (req, res) => {
  try {
    const { platform, url, icon, is_visible, display_order } = req.body;
    if (!platform || !url) {
      return res.status(400).json({ error: 'Platform and URL are required' });
    }

    const info = db.prepare(`
      INSERT INTO social_links (platform, url, icon, is_visible, display_order)
      VALUES (?, ?, ?, ?, ?)
    `).run(platform, url, icon || 'Link', is_visible ? 1 : 0, display_order || 0);

    res.status(201).json({ success: true, id: info.lastInsertRowid, message: 'Social link created' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create social link' });
  }
});

router.put('/socials/:id', (req, res) => {
  try {
    const { platform, url, icon, is_visible, display_order } = req.body;
    db.prepare(`
      UPDATE social_links SET
        platform = ?, url = ?, icon = ?, is_visible = ?, display_order = ?
      WHERE id = ?
    `).run(platform, url, icon || 'Link', is_visible ? 1 : 0, display_order || 0, req.params.id);

    res.json({ success: true, message: 'Social link updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update social link' });
  }
});

router.delete('/socials/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM social_links WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Social link deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete social link' });
  }
});

// ----------------------------------------------------
// CONTACT MESSAGES INBOX
// ----------------------------------------------------
router.get('/messages', (req, res) => {
  try {
    const { search, filter } = req.query;
    let query = 'SELECT * FROM messages WHERE 1=1';
    const params = [];

    if (filter === 'unread') {
      query += ' AND is_read = 0';
    } else if (filter === 'read') {
      query += ' AND is_read = 1';
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY created_at DESC';

    const messages = db.prepare(query).all(...params);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.put('/messages/:id/read', (req, res) => {
  try {
    const { is_read } = req.body;
    db.prepare('UPDATE messages SET is_read = ? WHERE id = ?').run(is_read ? 1 : 0, req.params.id);
    res.json({ success: true, message: 'Message status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

router.delete('/messages/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM messages WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// ----------------------------------------------------
// SITE SETTINGS
// ----------------------------------------------------
router.get('/settings', (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM site_settings WHERE id = 1').get() || {};
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch site settings' });
  }
});

router.put('/settings', (req, res) => {
  try {
    const {
      site_title, site_description, meta_keywords, logo_url, favicon_url,
      footer_text, allow_messages, primary_accent, dark_mode_default
    } = req.body;

    db.prepare(`
      UPDATE site_settings SET
        site_title = ?, site_description = ?, meta_keywords = ?, logo_url = ?, favicon_url = ?,
        footer_text = ?, allow_messages = ?, primary_accent = ?, dark_mode_default = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).run(
      site_title || '', site_description || '', meta_keywords || '',
      logo_url || '', favicon_url || '', footer_text || '',
      allow_messages ? 1 : 0, primary_accent || '#6366f1',
      dark_mode_default ? 1 : 0
    );

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update site settings' });
  }
});

export default router;
