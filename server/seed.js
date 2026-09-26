import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { initDatabase } from './db.js';
import { hashPassword } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export async function seedDatabase() {
  initDatabase();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@aaryanjagga.dev';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecure2026!';
  const adminName = process.env.ADMIN_NAME || 'Aaryan Jagga';

  // 1. Seed Admin User
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
  if (!existingUser) {
    const hashedPassword = await hashPassword(adminPassword);
    db.prepare(`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (?, ?, ?, 'admin')
    `).run(adminEmail, hashedPassword, adminName);
    console.log(`[Seed] Created admin user: ${adminEmail}`);
  }

  // 2. Seed Profile
  const existingProfile = db.prepare('SELECT id FROM profile WHERE id = 1').get();
  if (!existingProfile) {
    db.prepare(`
      INSERT INTO profile (
        id, full_name, professional_title, short_tagline, hero_heading, hero_description,
        cta_primary_text, cta_primary_url, cta_secondary_text, cta_secondary_url,
        bio_short, bio_long, highlights_json, avatar_url, location, email, phone,
        resume_url, github_url, linkedin_url, website_url, is_available_for_work
      ) VALUES (
        1, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?
      )
    `).run(
      'Aaryan Jagga',
      'Developer / Builder / Full-Stack Developer / SaaS Builder',
      'Building digital products that turn ideas into reality.',
      'Building digital products that turn ideas into reality.',
      'Full-Stack Developer, SaaS builder, and product architect focused on crafting clean, high-performance web applications and intuitive digital experiences.',
      'Explore Projects',
      '#projects',
      "Let's Connect",
      '#contact',
      'Student and passionate builder pursuing BCA at Panjab University, dedicated to crafting resilient full-stack systems and user-centric SaaS tools.',
      'Passionate full-stack developer with a builder mindset. Experienced in architecting end-to-end web applications with React, Node.js, Express, and modern databases. Striving for elegance in code, speed in execution, and simplicity in UI/UX.',
      JSON.stringify([
        'Full-Stack Web Development & SaaS Architecture',
        'BCA Student at Panjab University',
        'Built 10+ open-source & production web applications',
        'Hands-on experience in REST APIs, modern UI systems & cloud deployments'
      ]),
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      'Chandigarh, India',
      'admin@aaryanjagga.dev',
      '+91 98765 43210',
      '/resume.pdf',
      'https://github.com/aaryanjagga',
      'https://linkedin.com/in/aaryanjagga',
      'https://aaryanjagga.dev',
      1
    );
    console.log('[Seed] Seeded profile for Aaryan Jagga');
  }

  // 3. Seed Site Settings
  const existingSettings = db.prepare('SELECT id FROM site_settings WHERE id = 1').get();
  if (!existingSettings) {
    db.prepare(`
      INSERT INTO site_settings (
        id, site_title, site_description, meta_keywords, footer_text, allow_messages, primary_accent, dark_mode_default
      ) VALUES (
        1, ?, ?, ?, ?, 1, '#6366f1', 1
      )
    `).run(
      'Aaryan Jagga — Developer & Builder',
      'Portfolio of Aaryan Jagga: Full-Stack Developer, SaaS Builder, and Product Architect.',
      'Aaryan Jagga, Full Stack Developer, React, Node.js, Express, SQLite, SaaS, Code With Aaryan',
      'Designed and engineered with precision by Aaryan Jagga.'
    );
    console.log('[Seed] Seeded site settings');
  }

  // 4. Seed Education
  const educationCount = db.prepare('SELECT COUNT(*) as count FROM education').get().count;
  if (educationCount === 0) {
    const insertEdu = db.prepare(`
      INSERT INTO education (
        institution, degree, field_of_study, start_date, end_date, is_current, description,
        grade_cgpa, location, logo_url, coursework, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertEdu.run(
      'Panjab University',
      'BCA — Bachelor of Computer Applications',
      'Computer Science & Software Development',
      '2023',
      '2026',
      1,
      'Pursuing degree with rigorous training in computer architecture, database management, data structures, algorithms, and full-stack software development.',
      'Current Student',
      'Chandigarh, India',
      'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=200&q=80',
      'Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, Web Technologies, Software Engineering',
      1
    );
    console.log('[Seed] Seeded education records');
  }

  // 5. Seed Skills
  const skillsCount = db.prepare('SELECT COUNT(*) as count FROM skills').get().count;
  if (skillsCount === 0) {
    const insertSkill = db.prepare(`
      INSERT INTO skills (name, category, icon, proficiency, experience_years, description, is_featured, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialSkills = [
      // Frontend
      { name: 'React', category: 'Frontend', icon: 'Code', proficiency: 92, experience_years: '2+ yrs', description: 'Component architecture, hooks, state machines, context', is_featured: 1, display_order: 1 },
      { name: 'TypeScript', category: 'Frontend', icon: 'FileCode2', proficiency: 85, experience_years: '2+ yrs', description: 'Strict typing, interfaces, generics, type-safe fullstack', is_featured: 1, display_order: 2 },
      { name: 'JavaScript (ES6+)', category: 'Frontend', icon: 'Terminal', proficiency: 95, experience_years: '3+ yrs', description: 'Async/await, closures, prototypes, event loop, DOM', is_featured: 1, display_order: 3 },
      { name: 'Tailwind CSS', category: 'Frontend', icon: 'Palette', proficiency: 94, experience_years: '2+ yrs', description: 'Utility-first layout, custom design systems, responsiveness', is_featured: 1, display_order: 4 },
      { name: 'HTML5 & CSS3', category: 'Frontend', icon: 'Layout', proficiency: 96, experience_years: '3+ yrs', description: 'Semantic markup, accessibility, CSS Grid, Flexbox, keyframes', is_featured: 0, display_order: 5 },
      // Backend
      { name: 'Node.js', category: 'Backend', icon: 'Server', proficiency: 88, experience_years: '2+ yrs', description: 'Event-driven servers, file streaming, microservices, auth', is_featured: 1, display_order: 6 },
      { name: 'Express.js', category: 'Backend', icon: 'Cpu', proficiency: 90, experience_years: '2+ yrs', description: 'RESTful API routing, middleware pipelines, error handling', is_featured: 1, display_order: 7 },
      { name: 'REST APIs', category: 'Backend', icon: 'Network', proficiency: 92, experience_years: '2+ yrs', description: 'Resource design, rate-limiting, JWT auth, status codes', is_featured: 0, display_order: 8 },
      // Databases
      { name: 'MongoDB', category: 'Databases', icon: 'Database', proficiency: 82, experience_years: '1.5+ yrs', description: 'Document schemas, aggregation pipelines, indexing', is_featured: 1, display_order: 9 },
      { name: 'SQLite', category: 'Databases', icon: 'HardDrive', proficiency: 85, experience_years: '2+ yrs', description: 'ACID transactions, relational schemas, query optimization', is_featured: 1, display_order: 10 },
      // Languages
      { name: 'Python', category: 'Languages', icon: 'Binary', proficiency: 84, experience_years: '2+ yrs', description: 'Scripting, backend logic, data parsing, algorithm challenges', is_featured: 1, display_order: 11 },
      // Tools & AI
      { name: 'Git & GitHub', category: 'Tools', icon: 'GitBranch', proficiency: 90, experience_years: '3+ yrs', description: 'Branching, PRs, version control, CI/CD deployment hooks', is_featured: 1, display_order: 12 },
      { name: 'AI & Automation Tools', category: 'AI', icon: 'Sparkles', proficiency: 86, experience_years: '1+ yrs', description: 'Prompt workflows, LLM integration, agentic scaffolding', is_featured: 1, display_order: 13 }
    ];

    for (const s of initialSkills) {
      insertSkill.run(s.name, s.category, s.icon, s.proficiency, s.experience_years, s.description, s.is_featured, s.display_order);
    }
    console.log(`[Seed] Seeded ${initialSkills.length} skills`);
  }

  // 6. Seed Projects (Real projects of Aaryan)
  const projectsCount = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
  if (projectsCount === 0) {
    const insertProject = db.prepare(`
      INSERT INTO projects (
        name, slug, short_desc, full_desc, image_url, gallery_json, technologies_json,
        github_url, live_url, case_study_url, category, status, is_featured, start_date, end_date, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialProjects = [
      {
        name: 'SpendWise',
        slug: 'spendwise',
        short_desc: 'Comprehensive personal finance and intelligent budgeting platform with analytics and category tracking.',
        full_desc: 'SpendWise is designed to give users real-time clarity over personal cash flow. Features interactive visual charts, automated expense classification, monthly limits, and monthly export reports.',
        image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
        gallery_json: JSON.stringify([
          'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80'
        ]),
        technologies_json: JSON.stringify(['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Chart.js']),
        github_url: 'https://github.com/aaryanjagga/spendwise',
        live_url: 'https://spendwise.aaryanjagga.dev',
        case_study_url: '',
        category: 'Full-Stack',
        status: 'Completed',
        is_featured: 1,
        start_date: '2024-03',
        end_date: '2024-05',
        display_order: 1
      },
      {
        name: 'PathFinder',
        slug: 'pathfinder',
        short_desc: 'Interactive algorithm visualizer exploring Dijkstra, A-Star, BFS, and DFS with customizable obstacles.',
        full_desc: 'An educational, interactive visualizer that helps students and developers understand graph search algorithms through step-by-step canvas rendering, wall generation, and speed controls.',
        image_url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1000&q=80',
        gallery_json: JSON.stringify([
          'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1000&q=80'
        ]),
        technologies_json: JSON.stringify(['TypeScript', 'React', 'Algorithms', 'Tailwind CSS', 'Canvas API']),
        github_url: 'https://github.com/aaryanjagga/pathfinder',
        live_url: 'https://pathfinder.aaryanjagga.dev',
        case_study_url: '',
        category: 'Frontend',
        status: 'Completed',
        is_featured: 1,
        start_date: '2024-01',
        end_date: '2024-02',
        display_order: 2
      },
      {
        name: 'GoSocials',
        slug: 'gosocials',
        short_desc: 'Social media content management and scheduling workspace built for modern creators and builders.',
        full_desc: 'GoSocials simplifies multi-channel scheduling with a centralized calendar view, automated queue publishing, markdown draft editor, and engagement metric monitoring.',
        image_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1000&q=80',
        gallery_json: JSON.stringify([
          'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1000&q=80'
        ]),
        technologies_json: JSON.stringify(['React', 'Node.js', 'REST API', 'Tailwind CSS', 'SQLite']),
        github_url: 'https://github.com/aaryanjagga/gosocials',
        live_url: 'https://gosocials.aaryanjagga.dev',
        case_study_url: '',
        category: 'SaaS',
        status: 'Completed',
        is_featured: 1,
        start_date: '2024-06',
        end_date: '2024-08',
        display_order: 3
      },
      {
        name: 'ResumeCraft',
        slug: 'resumecraft',
        short_desc: 'ATS-friendly dynamic resume builder with instantaneous split-screen preview and PDF export.',
        full_desc: 'Craft structured, modern resumes without formatting headaches. Offers modular section reordering, ATS compliance checks, custom color themes, and high-resolution PDF download.',
        image_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1000&q=80',
        gallery_json: JSON.stringify([
          'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1000&q=80'
        ]),
        technologies_json: JSON.stringify(['React', 'TypeScript', 'Tailwind CSS', 'html2pdf.js']),
        github_url: 'https://github.com/aaryanjagga/resumecraft',
        live_url: 'https://resumecraft.aaryanjagga.dev',
        case_study_url: '',
        category: 'SaaS',
        status: 'Completed',
        is_featured: 1,
        start_date: '2024-08',
        end_date: '2024-09',
        display_order: 4
      },
      {
        name: 'StockSync',
        slug: 'stocksync',
        short_desc: 'Real-time inventory and supply tracking system with automated stock alerts and supplier directory.',
        full_desc: 'Engineered for small and mid-sized businesses to monitor SKU levels, low-stock notifications, transaction logs, and reorder cycles through an intuitive data grid.',
        image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
        gallery_json: JSON.stringify([]),
        technologies_json: JSON.stringify(['Node.js', 'Express', 'React', 'MongoDB', 'Tailwind CSS']),
        github_url: 'https://github.com/aaryanjagga/stocksync',
        live_url: '',
        case_study_url: '',
        category: 'Full-Stack',
        status: 'Completed',
        is_featured: 0,
        start_date: '2024-04',
        end_date: '2024-05',
        display_order: 5
      },
      {
        name: 'Medisync',
        slug: 'medisync',
        short_desc: 'Healthcare appointment booking and patient record portal with role-based access control.',
        full_desc: 'Streamlines doctor-patient interaction with calendar scheduling, prescription records, slot availability indicators, and notification pings.',
        image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
        gallery_json: JSON.stringify([]),
        technologies_json: JSON.stringify(['React', 'Node.js', 'Express', 'JWT', 'SQLite']),
        github_url: 'https://github.com/aaryanjagga/medisync',
        live_url: '',
        case_study_url: '',
        category: 'Full-Stack',
        status: 'Completed',
        is_featured: 0,
        start_date: '2024-02',
        end_date: '2024-03',
        display_order: 6
      },
      {
        name: 'Zenith Goods',
        slug: 'zenith-goods',
        short_desc: 'Modern e-commerce storefront with client-side cart persistence, category filtering, and checkout flow.',
        full_desc: 'Clean, minimalist digital store featuring product image galleries, instant search, price filter sliders, discount calculation, and responsive cart drawer.',
        image_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1000&q=80',
        gallery_json: JSON.stringify([]),
        technologies_json: JSON.stringify(['React', 'Tailwind CSS', 'Context API', 'Vite']),
        github_url: 'https://github.com/aaryanjagga/zenith-goods',
        live_url: 'https://zenith-goods.aaryanjagga.dev',
        case_study_url: '',
        category: 'Frontend',
        status: 'Completed',
        is_featured: 0,
        start_date: '2023-11',
        end_date: '2023-12',
        display_order: 7
      },
      {
        name: 'CBT Simulator',
        slug: 'cbt-simulator',
        short_desc: 'Computer-Based Testing examination environment with timer, question palette, and result analytics.',
        full_desc: 'Simulates standardized computer-based competitive exams. Includes question status marking (answered, flagged, unvisited), countdown clock, and detailed scorecard generation upon submission.',
        image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80',
        gallery_json: JSON.stringify([]),
        technologies_json: JSON.stringify(['JavaScript', 'React', 'CSS3', 'Local Storage']),
        github_url: 'https://github.com/aaryanjagga/cbt-simulator',
        live_url: '',
        case_study_url: '',
        category: 'Frontend',
        status: 'Completed',
        is_featured: 0,
        start_date: '2023-09',
        end_date: '2023-10',
        display_order: 8
      },
      {
        name: 'CodeSynth',
        slug: 'codesynth',
        short_desc: 'Developer code snippet vault and playground with syntax highlighting and tag grouping.',
        full_desc: 'A lightweight productivity tool for developers to store, categorize, and quickly search recurring code templates, utility functions, and CLI scripts with instant clipboard copy.',
        image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
        gallery_json: JSON.stringify([]),
        technologies_json: JSON.stringify(['React', 'TypeScript', 'Prism.js', 'Tailwind CSS']),
        github_url: 'https://github.com/aaryanjagga/codesynth',
        live_url: '',
        case_study_url: '',
        category: 'Tools',
        status: 'Completed',
        is_featured: 0,
        start_date: '2024-05',
        end_date: '2024-06',
        display_order: 9
      },
      {
        name: 'T-Rex Run',
        slug: 't-rex-run',
        short_desc: 'Remake of the classic endless runner featuring physics-based jump mechanics and obstacle speed scaling.',
        full_desc: 'Built using HTML5 Canvas and vanilla JavaScript to demonstrate collision detection, frame request timing, sprite animation loops, and local high-score caching.',
        image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
        gallery_json: JSON.stringify([]),
        technologies_json: JSON.stringify(['JavaScript', 'HTML5 Canvas', 'CSS3', 'Game Physics']),
        github_url: 'https://github.com/aaryanjagga/t-rex-run',
        live_url: '',
        case_study_url: '',
        category: 'Frontend',
        status: 'Completed',
        is_featured: 0,
        start_date: '2023-07',
        end_date: '2023-08',
        display_order: 10
      },
      {
        name: 'AuraDrift',
        slug: 'auradrift',
        short_desc: 'Ambient audio mixer and focus companion with customizable sound layers and pomodoro timer.',
        full_desc: 'Designed for deep work sessions. Allows users to blend rainfall, white noise, café ambiance, and binaural waves with integrated work/break cycles.',
        image_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1000&q=80',
        gallery_json: JSON.stringify([]),
        technologies_json: JSON.stringify(['React', 'Web Audio API', 'Tailwind CSS']),
        github_url: 'https://github.com/aaryanjagga/auradrift',
        live_url: '',
        case_study_url: '',
        category: 'Tools',
        status: 'Completed',
        is_featured: 0,
        start_date: '2024-07',
        end_date: '2024-08',
        display_order: 11
      },
      {
        name: 'Ezdev',
        slug: 'ezdev',
        short_desc: 'All-in-one developer utility toolbox containing JSON formatters, regex testers, and hashing tools.',
        full_desc: 'Fast browser-based Swiss Army knife for web developers. Provides offline-first tools: JSON validator/formatter, Base64 encoder/decoder, JWT debugger, and color palette generator.',
        image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
        gallery_json: JSON.stringify([]),
        technologies_json: JSON.stringify(['TypeScript', 'React', 'Tailwind CSS']),
        github_url: 'https://github.com/aaryanjagga/ezdev',
        live_url: '',
        case_study_url: '',
        category: 'Tools',
        status: 'Completed',
        is_featured: 0,
        start_date: '2024-08',
        end_date: '2024-09',
        display_order: 12
      }
    ];

    for (const p of initialProjects) {
      insertProject.run(
        p.name, p.slug, p.short_desc, p.full_desc, p.image_url, p.gallery_json, p.technologies_json,
        p.github_url, p.live_url, p.case_study_url, p.category, p.status, p.is_featured,
        p.start_date, p.end_date, p.display_order
      );
    }
    console.log(`[Seed] Seeded ${initialProjects.length} projects`);
  }

  // 7. Seed Experience
  const expCount = db.prepare('SELECT COUNT(*) as count FROM experience').get().count;
  if (expCount === 0) {
    const insertExp = db.prepare(`
      INSERT INTO experience (
        company, role, employment_type, start_date, end_date, is_current, description,
        responsibilities_json, technologies_json, company_logo, location, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialExperience = [
      {
        company: 'CodeAlpha',
        role: 'Python Programming Intern',
        employment_type: 'Internship',
        start_date: '2024-01',
        end_date: '2024-02',
        is_current: 0,
        description: 'Completed dedicated development assignments focused on core Python, algorithmic problem solving, and script automation.',
        responsibilities_json: JSON.stringify([
          'Developed functional Python applications and data processing scripts.',
          'Implemented clean code conventions, modular error handling, and unit test suites.',
          'Collaborated with mentor feedback loops for code optimization and complexity reduction.'
        ]),
        technologies_json: JSON.stringify(['Python', 'Data Structures', 'OOP', 'Algorithms']),
        company_logo: '',
        location: 'Remote',
        display_order: 1
      },
      {
        company: 'CodeAlpha',
        role: 'Web Development Intern',
        employment_type: 'Internship',
        start_date: '2023-11',
        end_date: '2023-12',
        is_current: 0,
        description: 'Built responsive web interfaces and interactive components adhering to modern frontend best practices.',
        responsibilities_json: JSON.stringify([
          'Engineered mobile-responsive UI layouts using HTML5, CSS3, and JavaScript.',
          'Integrated asynchronous APIs and client-side data rendering.',
          'Optimized DOM rendering performance and cross-browser visual fidelity.'
        ]),
        technologies_json: JSON.stringify(['JavaScript', 'HTML5', 'CSS3', 'REST APIs']),
        company_logo: '',
        location: 'Remote',
        display_order: 2
      },
      {
        company: 'Thiranex',
        role: 'Technical Intern',
        employment_type: 'Internship',
        start_date: '2023-08',
        end_date: '2023-10',
        is_current: 0,
        description: 'Contributed to technical research, prototype building, and software engineering tasks.',
        responsibilities_json: JSON.stringify([
          'Assisted in evaluating architectural approaches for internal web services.',
          'Documented API endpoints and drafted technical workflow diagrams.',
          'Participated in code reviews and sprint retrospectives.'
        ]),
        technologies_json: JSON.stringify(['JavaScript', 'Node.js', 'Git', 'Agile']),
        company_logo: '',
        location: 'Remote',
        display_order: 3
      },
      {
        company: 'Internshala',
        role: 'Campus Ambassador',
        employment_type: 'Ambassadorship',
        start_date: '2023-05',
        end_date: '2023-07',
        is_current: 0,
        description: 'Represented Internshala across collegiate networks, driving awareness of student internships, tech training, and skill workshops.',
        responsibilities_json: JSON.stringify([
          'Organized informational sessions introducing students to professional tech career paths.',
          'Facilitated student onboarding for skill-building courses and internship opportunities.',
          'Strengthened campus community engagement and communication channels.'
        ]),
        technologies_json: JSON.stringify(['Leadership', 'Communication', 'Community Building']),
        company_logo: '',
        location: 'Chandigarh, India',
        display_order: 4
      }
    ];

    for (const e of initialExperience) {
      insertExp.run(
        e.company, e.role, e.employment_type, e.start_date, e.end_date, e.is_current,
        e.description, e.responsibilities_json, e.technologies_json, e.company_logo,
        e.location, e.display_order
      );
    }
    console.log(`[Seed] Seeded ${initialExperience.length} experience entries`);
  }

  // 8. Seed Certifications
  const certsCount = db.prepare('SELECT COUNT(*) as count FROM certifications').get().count;
  if (certsCount === 0) {
    const insertCert = db.prepare(`
      INSERT INTO certifications (
        name, issuer, issue_date, credential_id, credential_url, certificate_image, description, is_featured, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialCerts = [
      {
        name: 'Technology Consulting Virtual Experience',
        issuer: 'Deloitte',
        issue_date: '2024',
        credential_id: 'DEL-VIRT-2024',
        credential_url: 'https://forage.com',
        certificate_image: '',
        description: 'Completed practical simulation assessing cloud migration strategies, systems analysis, and enterprise tech solutions.',
        is_featured: 1,
        display_order: 1
      },
      {
        name: 'Data Visualisation: Empowering Business with Effective Insights',
        issuer: 'Tata',
        issue_date: '2024',
        credential_id: 'TATA-DV-2024',
        credential_url: 'https://forage.com',
        certificate_image: '',
        description: 'Learned impactful data storytelling, dashboard modeling, and executive KPI presentation.',
        is_featured: 1,
        display_order: 2
      },
      {
        name: 'Software Engineering Virtual Experience',
        issuer: 'Goldman Sachs',
        issue_date: '2024',
        credential_id: 'GS-SE-2024',
        credential_url: 'https://forage.com',
        certificate_image: '',
        description: 'Hands-on practice solving algorithmic challenges, security controls, and password cracking defenses.',
        is_featured: 1,
        display_order: 3
      },
      {
        name: 'Python & Machine Learning Foundations',
        issuer: 'Google / Kaggle',
        issue_date: '2023',
        credential_id: 'KAGGLE-ML-FOUND',
        credential_url: 'https://kaggle.com/learn',
        certificate_image: '',
        description: 'Core concepts in data wrangling, model validation, and supervised learning fundamentals.',
        is_featured: 1,
        display_order: 4
      },
      {
        name: 'Software Engineering Virtual Internship',
        issuer: 'JPMorgan Chase & Co.',
        issue_date: '2024',
        credential_id: 'JPMC-SE-2024',
        credential_url: 'https://forage.com',
        certificate_image: '',
        description: 'Interfaced with real-time financial data feeds, perspective charts, and data feed visualizers.',
        is_featured: 1,
        display_order: 5
      },
      {
        name: 'Cloud & Web Fundamentals',
        issuer: 'Microsoft',
        issue_date: '2023',
        credential_id: 'MS-WEB-2023',
        credential_url: 'https://microsoft.com/learn',
        certificate_image: '',
        description: 'Explored cloud architecture, virtual networks, and distributed computing models.',
        is_featured: 0,
        display_order: 6
      },
      {
        name: 'Full Stack & Web Development Training',
        issuer: 'Simplilearn',
        issue_date: '2023',
        credential_id: 'SL-FS-2023',
        credential_url: 'https://simplilearn.com',
        certificate_image: '',
        description: 'End-to-end full stack training spanning frontend interfaces, REST architectures, and backend databases.',
        is_featured: 0,
        display_order: 7
      }
    ];

    for (const c of initialCerts) {
      insertCert.run(c.name, c.issuer, c.issue_date, c.credential_id, c.credential_url, c.certificate_image, c.description, c.is_featured, c.display_order);
    }
    console.log(`[Seed] Seeded ${initialCerts.length} certifications`);
  }

  // 9. Seed Achievements
  const achieveCount = db.prepare('SELECT COUNT(*) as count FROM achievements').get().count;
  if (achieveCount === 0) {
    const insertAchieve = db.prepare(`
      INSERT INTO achievements (title, description, date, organization, icon, link, is_featured, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialAchievements = [
      {
        title: 'Built & Shipped 10+ Modern Web Applications',
        description: 'Conceived, architected, and deployed diverse open-source applications spanning SaaS tools, interactive visualizers, and productivity dashboards.',
        date: '2023 - Present',
        organization: 'Independent Builder',
        icon: 'Rocket',
        link: 'https://github.com/aaryanjagga',
        is_featured: 1,
        display_order: 1
      },
      {
        title: 'Code With Aaryan Brand & Community',
        description: 'Established the "Code With Aaryan" developer identity sharing coding projects, modern tech tutorials, and software architecture insights.',
        date: '2023 - Present',
        organization: 'Code With Aaryan',
        icon: 'Award',
        link: '',
        is_featured: 1,
        display_order: 2
      },
      {
        title: 'Completed Multiple Industry Engineering Simulations',
        description: 'Earned virtual credentials across Goldman Sachs, Deloitte, and JPMorgan Chase covering system architecture and data visualization.',
        date: '2024',
        organization: 'Forage & Industry Partners',
        icon: 'CheckCircle2',
        link: '',
        is_featured: 1,
        display_order: 3
      }
    ];

    for (const a of initialAchievements) {
      insertAchieve.run(a.title, a.description, a.date, a.organization, a.icon, a.link, a.is_featured, a.display_order);
    }
    console.log(`[Seed] Seeded achievements`);
  }

  // 10. Seed Services
  const servicesCount = db.prepare('SELECT COUNT(*) as count FROM services').get().count;
  if (servicesCount === 0) {
    const insertService = db.prepare(`
      INSERT INTO services (title, description, icon, features_json, is_active, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const initialServices = [
      {
        title: 'Full-Stack Web Development',
        description: 'End-to-end development of dynamic, robust web applications from intuitive UI layers down to performant databases.',
        icon: 'Layers',
        features_json: JSON.stringify(['React & TypeScript frontend architecture', 'Express & Node.js backend services', 'Clean REST APIs with authentication', 'Database design & optimization']),
        is_active: 1,
        display_order: 1
      },
      {
        title: 'SaaS Product Engineering',
        description: 'Transforming product concepts into scalable, user-ready digital software with subscription tiers, dashboards, and role-based permissions.',
        icon: 'Sparkles',
        features_json: JSON.stringify(['Multi-tenant or workspace models', 'Interactive analytical dashboards', 'Fast prototyping & MVP delivery', 'State management & workflow automation']),
        is_active: 1,
        display_order: 2
      },
      {
        title: 'Frontend & UI Implementation',
        description: 'Pixel-perfect, accessible, and fluid user interfaces inspired by Linear, Apple, and Vercel standards with Framer Motion.',
        icon: 'Palette',
        features_json: JSON.stringify(['Responsive across all viewports (320px+)', 'Custom design tokens & dark/light themes', 'High-speed loading & low bundle weight', 'Smooth micro-interactions']),
        is_active: 1,
        display_order: 3
      },
      {
        title: 'Backend & API Architecture',
        description: 'Secure, structured RESTful services designed for high availability, input validation, and clean database integration.',
        icon: 'Server',
        features_json: JSON.stringify(['JWT & session-based security', 'Input sanitation & error pipelines', 'SQLite & MongoDB persistence', 'File uploads & static asset handling']),
        is_active: 1,
        display_order: 4
      }
    ];

    for (const s of initialServices) {
      insertService.run(s.title, s.description, s.icon, s.features_json, s.is_active, s.display_order);
    }
    console.log(`[Seed] Seeded services`);
  }

  // 11. Seed Social Links
  const socialsCount = db.prepare('SELECT COUNT(*) as count FROM social_links').get().count;
  if (socialsCount === 0) {
    const insertSocial = db.prepare(`
      INSERT INTO social_links (platform, url, icon, is_visible, display_order)
      VALUES (?, ?, ?, ?, ?)
    `);

    const initialSocials = [
      { platform: 'GitHub', url: 'https://github.com/aaryanjagga', icon: 'Github', is_visible: 1, display_order: 1 },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/aaryanjagga', icon: 'Linkedin', is_visible: 1, display_order: 2 },
      { platform: 'X / Twitter', url: 'https://x.com/aaryanjagga', icon: 'Twitter', is_visible: 1, display_order: 3 },
      { platform: 'YouTube', url: 'https://youtube.com/@codewithaaryan', icon: 'Youtube', is_visible: 1, display_order: 4 }
    ];

    for (const s of initialSocials) {
      insertSocial.run(s.platform, s.url, s.icon, s.is_visible, s.display_order);
    }
    console.log(`[Seed] Seeded social links`);
  }

  console.log('[Seed] Database seeding completed successfully!');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase().catch((err) => {
    console.error('Failed to seed database:', err);
    process.exit(1);
  });
}
