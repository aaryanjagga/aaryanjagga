# Aaryan Jagga — Premium Developer Portfolio + Private Admin CMS

> A technical, high-performance personal brand portfolio and dynamic Content Management System (CMS) designed by **Aaryan Jagga** (Developer / Builder / Full-Stack Developer / SaaS Builder).

Combining the aesthetics of **Apple, Vercel, Linear, and Raycast**, this application features a single-page interactive showcase, dedicated project explorer, and a private authenticated Admin CMS that dynamically controls every section of the portfolio without requiring code modifications.

---

## Architecture Overview

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Framer Motion, Lucide Icons, React Router v7.
- **Backend**: Express.js REST API, JSON Web Token (JWT) authentication, BCrypt password hashing, Multer multipart file upload engine.
- **Database**: SQLite (via `better-sqlite3`) utilizing WAL (Write-Ahead Logging) mode and foreign key constraints for sub-millisecond atomic transactions and zero-dependency portability.

```
portfolio/
├── server/
│   ├── db.js                 # SQLite database setup with WAL mode & table migrations
│   ├── seed.js               # Idempotent database seeder with verified real information
│   ├── auth.js               # JWT verification & bcryptjs password hashing utilities
│   ├── routes/
│   │   ├── auth.js           # Admin login, session check, and password update
│   │   ├── public.js         # Public portfolio payload & contact dispatch
│   │   ├── admin.js          # Full CRUD operations for all portfolio collections
│   │   └── upload.js         # Image upload handler saving to /uploads
│   └── index.js              # Express API server entrypoint (port 5000)
├── src/
│   ├── components/
│   │   ├── ui/               # Reusable primitives: Button, Card, Badge, Modal, Input, Select, etc.
│   │   ├── common/           # Navbar, Footer, HeroBackground, SectionHeading
│   │   ├── public/           # Hero, About, Skills, Projects, Experience, Education, Certs, Contact
│   │   └── admin/            # AdminLayout, AdminSidebar, AdminHeader
│   ├── context/
│   │   ├── AuthContext.jsx   # Admin authentication session and token storage
│   │   ├── ThemeContext.jsx  # Dark/Light theme toggle with localStorage persistence
│   │   └── ToastContext.jsx  # Floating notifications
│   ├── pages/
│   │   ├── public/           # Home, ProjectsPage, AboutPage, ContactPage, NotFound
│   │   └── admin/            # Dashboard, ProfileAdmin, ProjectsAdmin, SkillsAdmin, MessagesAdmin, etc.
│   ├── services/
│   │   └── api.js            # Unified fetch client with JWT interceptor
│   ├── App.jsx               # React Router layout and routing table
│   └── index.css             # Tailwind CSS tokens, glassmorphism, and dark styling
├── uploads/                  # Uploaded project screenshots and media assets
├── .env.example              # Sample environment configuration
└── package.json              # Scripts for concurrent execution and building
```

---

## Quick Start & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```
Ensure the variables in `.env` match your preferences:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@aaryanjagga.dev
ADMIN_PASSWORD=AdminSecure2026!
ADMIN_NAME=Aaryan Jagga
DB_PATH=./server/portfolio.db
CLIENT_URL=http://localhost:5173
```

### 3. Database Initialization & Seeding
The database auto-initializes on server start. To manually trigger or reset the idempotent seeder with Aaryan's verified projects and background:
```bash
npm run seed
```

### 4. Run Development Server
Run both the Express API server (Port 5000) and the Vite frontend (Port 5173) concurrently:
```bash
npm run dev
```

Visit the application:
- **Public Portfolio**: [http://localhost:5173](http://localhost:5173)
- **Admin Gateway**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

---

## Private Admin CMS Credentials

- **URL**: `/admin/login`
- **Email**: `admin@aaryanjagga.dev`
- **Password**: `AdminSecure2026!`

> **Security Note**: Admin routes are protected with JWT tokens. Passwords are never stored in plaintext and are hashed with bcrypt. You can update your password at any time via `/admin/settings`.

---

## Content Management Capabilities

Every portfolio section can be managed without modifying code:

| Section | Capabilities |
| :--- | :--- |
| **Profile & Hero** | Edit Name, Title, Tagline, Hero Headline, CTAs, Biography, Key Highlights, Contact info, and Availability status. |
| **Projects** | Add, edit, delete, reorder projects. Supports cover image upload, case study descriptions, tech stack tags, live demo & GitHub links, status pills (Completed, In Progress, Concept), and featured flags. |
| **Skills** | Grouped into Frontend, Backend, Databases, Languages, Tools, AI. Configure proficiency sliders (1-100), experience duration, and icon presets. |
| **Experience** | Vertical milestone timeline. Manage companies, roles, employment types, date ranges, current status, responsibilities lists, and tech badges. |
| **Education** | Academic background (BCA Panjab University), graduation dates, CGPA, and detailed coursework lists. |
| **Certifications** | Verified credentials from Deloitte, Tata, Goldman Sachs, JP Morgan, Google, etc., with verification links. |
| **Achievements** | Milestone cards showcasing shipped products, independent building, and community initiatives. |
| **Services** | Capability cards with feature checklists for Full-Stack, SaaS, UI implementation, and backend engineering. |
| **Social Links** | Manage GitHub, LinkedIn, X/Twitter, and YouTube links with custom display ordering and visibility toggles. |
| **Messages Inbox** | Review incoming inquiries from the public contact form, mark as read/unread, delete, and send one-click email replies. |
| **Site Settings** | Configure document title, SEO meta description, search keywords, footer copyright text, and toggle contact message acceptance. |

---

## Scripts Reference

- `npm run dev`: Starts both backend API and Vite frontend concurrently.
- `npm run dev:client`: Runs Vite frontend only.
- `npm run dev:server`: Runs Express server only.
- `npm run seed`: Executes database schema migration and idempotent seeder.
- `npm run build`: Generates optimized production build in `/dist`.
- `npm run lint`: Runs ESLint analysis across codebase.
- `npm run preview`: Previews the production build locally.

---

## Deployment Instructions

### Option 1: Monolithic Node Service (VPS / DigitalOcean / Render / Railway)
1. Set production environment variables in your hosting provider (`NODE_ENV=production`, `PORT=5000`, `JWT_SECRET=...`).
2. Run `npm run build` to compile the Vite frontend into `dist/`.
3. In `server/index.js`, serve the static `dist/` directory for production:
   ```js
   if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.resolve(__dirname, '../dist')));
     app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../dist/index.html')));
   }
   ```
4. Start the server using `npm run server` or PM2: `pm2 start server/index.js --name "aaryan-portfolio"`.

### Option 2: Decoupled (Vercel Frontend + Render/Railway Backend)
1. Deploy `dist/` to **Vercel** with rewrites routing `/api/*` to your backend URL.
2. Deploy `server/` to **Railway** or **Render** with a persistent disk for SQLite `portfolio.db` and `uploads/`.

---

## Verification & Standards
- Built to adhere strictly to WCAG accessibility, `prefers-reduced-motion` compliance, mobile responsiveness down to 320px width, zero console errors, and authentic verified records without fabricated claims.
