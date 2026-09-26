import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.resolve(__dirname, 'portfolio.db');
const uploadsDir = path.resolve(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable WAL mode & foreign keys for high performance and integrity
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      full_name TEXT NOT NULL,
      professional_title TEXT NOT NULL,
      short_tagline TEXT,
      hero_heading TEXT,
      hero_description TEXT,
      cta_primary_text TEXT DEFAULT 'Explore Projects',
      cta_primary_url TEXT DEFAULT '#projects',
      cta_secondary_text TEXT DEFAULT 'Get in Touch',
      cta_secondary_url TEXT DEFAULT '#contact',
      bio_short TEXT,
      bio_long TEXT,
      highlights_json TEXT DEFAULT '[]',
      avatar_url TEXT,
      location TEXT,
      email TEXT,
      phone TEXT,
      resume_url TEXT,
      github_url TEXT,
      linkedin_url TEXT,
      website_url TEXT,
      is_available_for_work INTEGER DEFAULT 1,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution TEXT NOT NULL,
      degree TEXT NOT NULL,
      field_of_study TEXT,
      start_date TEXT,
      end_date TEXT,
      is_current INTEGER DEFAULT 0,
      description TEXT,
      grade_cgpa TEXT,
      location TEXT,
      logo_url TEXT,
      coursework TEXT,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL, -- 'Frontend', 'Backend', 'Languages', 'Databases', 'Tools', 'AI', 'DevOps'
      icon TEXT,
      proficiency INTEGER DEFAULT 80, -- 1 to 100
      experience_years TEXT,
      description TEXT,
      is_featured INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      short_desc TEXT NOT NULL,
      full_desc TEXT,
      image_url TEXT,
      gallery_json TEXT DEFAULT '[]',
      technologies_json TEXT DEFAULT '[]',
      github_url TEXT,
      live_url TEXT,
      case_study_url TEXT,
      category TEXT DEFAULT 'Full-Stack',
      status TEXT DEFAULT 'Completed', -- 'Completed', 'In Progress', 'Concept', 'Archived'
      is_featured INTEGER DEFAULT 0,
      start_date TEXT,
      end_date TEXT,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      employment_type TEXT DEFAULT 'Internship',
      start_date TEXT,
      end_date TEXT,
      is_current INTEGER DEFAULT 0,
      description TEXT,
      responsibilities_json TEXT DEFAULT '[]',
      technologies_json TEXT DEFAULT '[]',
      company_logo TEXT,
      location TEXT,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      issuer TEXT NOT NULL,
      issue_date TEXT,
      credential_id TEXT,
      credential_url TEXT,
      certificate_image TEXT,
      description TEXT,
      is_featured INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT,
      organization TEXT,
      icon TEXT,
      link TEXT,
      is_featured INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT,
      features_json TEXT DEFAULT '[]',
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS social_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT,
      is_visible INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      site_title TEXT DEFAULT 'Aaryan Jagga — Developer & Builder',
      site_description TEXT DEFAULT 'Full-Stack Developer, SaaS Builder & Digital Product Architect portfolio.',
      meta_keywords TEXT DEFAULT 'Aaryan Jagga, Full Stack Developer, React, Node.js, SaaS, Software Engineer',
      logo_url TEXT,
      favicon_url TEXT,
      footer_text TEXT DEFAULT 'Designed and engineered with precision by Aaryan Jagga.',
      allow_messages INTEGER DEFAULT 1,
      primary_accent TEXT DEFAULT '#6366f1',
      dark_mode_default INTEGER DEFAULT 1,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export default db;
