# 🎓 Student Helping Portal

A complete, medium-scale academic thesis project: a student helping website where students can find academic information, study resources, notices, downloads, guides, and articles — with a full admin panel to manage everything.

> Built as a thesis-level project demonstrating a complete full-stack application: authentication, role-based access control, a relational database with 15 models, a public-facing content site, and a 13-module admin dashboard.

---

## ✨ Features

### Public Site
- **Home page** — hero with search, latest notices, popular resources, latest articles, quick links
- **Study Resources** — browse/filter by category, department, and resource type; detail pages with view/download counters
- **Academic Information** — departments, subjects, academic calendar, exam schedule, result info
- **Student Guides** — admission, scholarship, internship, career, and research guides
- **Downloads** — forms, syllabus, templates, and documents with download tracking
- **Notices** — university, exam, scholarship, and general notices
- **Articles/Blog** — study tips, technology, programming, research, student life
- **About & Contact** — mission/team info, contact form with FAQ
- **Global search** across resources, notices, and articles

### Student Accounts
- Register / Login / Logout (credentials-based)
- Student dashboard with recent notices and saved-item count
- Bookmark/save resources and articles, with a dedicated bookmarks page
- Profile editing (name, avatar) and password change

### Admin Panel (`/admin`)
Full CRUD for 14 modules, all backed by real database operations:
1. **Dashboard** — totals for users, resources, notices, articles, downloads + recent messages
2. **Categories** — shared taxonomy across resource/article/notice/download/guide types
3. **Departments**
4. **Subjects** (linked to departments)
5. **Resources** (notes, PDF books, previous questions, assignments, video tutorials)
6. **Notices**
7. **Articles**
8. **Downloads**
9. **Guides**
10. **Academic Calendar**
11. **Exam Schedule** (linked to departments/subjects)
12. **Contact Messages** (read/unread, view, delete)
13. **Users** (role change, block/unblock, delete — with self-action safeguards)
14. **Settings** (site name, logo, contact info, social links, SEO)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Server Components) |
| Language | TypeScript |
| Database | MySQL via Prisma ORM |
| Styling | Tailwind CSS + Shadcn-style UI components |
| Auth | NextAuth v5 (Auth.js) — Credentials provider, JWT sessions, Prisma adapter |
| Validation | Zod |
| Password hashing | bcryptjs |

---

## 📁 Folder Structure

```
student-helping-portal/
├── prisma/
│   ├── schema.prisma          # Full data model (15 models, 7 enums)
│   └── seed.ts                # Seed script: admin/student users + sample content
├── src/
│   ├── app/
│   │   ├── (public)/          # Public site (home, resources, notices, articles, etc.)
│   │   ├── (auth)/            # Login / register
│   │   ├── (dashboard)/       # Student dashboard, bookmarks, profile
│   │   ├── admin/             # Admin panel pages (13 modules)
│   │   ├── api/
│   │   │   ├── admin/         # Admin-only CRUD API routes
│   │   │   ├── auth/          # NextAuth route handler
│   │   │   └── ...            # Register, bookmarks, contact, view/download tracking
│   │   ├── layout.tsx         # Root layout (fonts, providers)
│   │   ├── globals.css        # Theme tokens (Tailwind + CSS variables)
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── components/
│   │   ├── ui/                # Shadcn-style primitives (button, dialog, table, etc.)
│   │   ├── layout/             # Navbar, footer
│   │   ├── admin/              # Admin sidebar, topbar, delete button, breadcrumbs
│   │   └── shared/              # Cards, forms, pagination, empty/loading states
│   ├── lib/
│   │   ├── auth.ts             # NextAuth config (Credentials + Prisma adapter)
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── session.ts          # requireAuth / requireAdmin (page guards)
│   │   ├── admin-guard.ts      # requireAdminApi (API route guard)
│   │   ├── validations.ts      # Zod schemas for every entity
│   │   ├── content-meta.ts     # Resource/notice/guide type labels & icons
│   │   └── utils.ts            # cn(), date formatting, slugify
│   └── middleware.ts            # Protects /admin and /dashboard routes
├── .env.example
├── package.json
└── README.md
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
NEXTAUTH_SECRET="generate-with-openssl-rand--base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secret:
```bash
openssl rand -base64 32
```

---

## 🚀 Installation & Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure your database
Create a MySQL database and set `DATABASE_URL` in `.env` (see above). Any MySQL 8+ instance works — local, Docker, or a managed provider (PlanetScale, Railway, etc.).

### 3. One-command setup (recommended)
```bash
npm run setup
```
This installs dependencies, generates the Prisma client, pushes the schema to your database, and seeds demo data — all in one step.

### 4. Start the dev server
```bash
npm run dev
```
This starts only the Next.js dev server. It does not run migration or seed every time.

### Auto-migrating dev server (alternative)
If you'd rather have schema sync + seeding happen automatically every time you start developing:
```bash
npm run dev:auto
```
This runs `prisma generate` → `prisma db push` → `prisma db seed` → `next dev`, every time.

Recommended:
- First time only: `npm run setup` or `npm run dev:auto`
- Regular development after setup: `npm run dev`

> **Why `db push` instead of `migrate dev`?** This project uses `prisma db push` for development convenience (no migration history needed for a thesis project). If you want versioned migrations for production, switch the `prisma:migrate` script to `prisma migrate dev` and run `prisma migrate deploy` in production.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js dev server only |
| `npm run dev:auto` | Generate client + sync DB + seed + start dev server |
| `npm run build` | Production build (also regenerates Prisma client) |
| `npm run start` | Start the production server (after `build`) |
| `npm run setup` | Install deps + generate client + sync DB + seed (one-time setup) |
| `npm run prisma:generate` | Generate the Prisma client |
| `npm run prisma:migrate` | Sync schema to database (`prisma db push`) |
| `npm run prisma:seed` | Run the seed script |

---

## 🔐 Default Login Credentials

After seeding, two accounts are available:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@studentportal.com` | `admin123456` |
| **Student** | `student@studentportal.com` | `student123456` |

> ⚠️ Change these credentials before deploying anywhere beyond local development/demo use.

---

## 🌐 Key URLs

| Area | URL |
|---|---|
| Public homepage | `http://localhost:3000/` |
| Login | `http://localhost:3000/login` |
| Register | `http://localhost:3000/register` |
| Student dashboard | `http://localhost:3000/dashboard` |
| Admin panel | `http://localhost:3000/admin` |

---

## 🗄 Database Schema Overview

15 models, fully relational:

- **Auth**: `User`, `Account`, `Session`, `VerificationToken` (NextAuth/Auth.js standard shape)
- **Taxonomy**: `Category`, `Department`, `Subject`
- **Content**: `Resource`, `Notice`, `Article`, `Download`, `Guide`
- **Academics**: `AcademicCalendar`, `ExamSchedule`
- **Engagement**: `Bookmark`, `ContactMessage`
- **Config**: `SiteSetting` (singleton row)

Enums: `Role`, `Status`, `CategoryType`, `ResourceType`, `NoticeType`, `GuideType`, `BookmarkType`.

Run `npx prisma studio` at any time to browse your data visually.

---

## 🖼 Screenshots

> _Add screenshots here after running the app locally:_
- [ ] Home page
- [ ] Resources listing with filters
- [ ] Resource detail page
- [ ] Admin dashboard
- [ ] Admin resource CRUD dialog
- [ ] Student dashboard / bookmarks

---

## 🎓 About This Thesis Project

This project demonstrates a complete, production-style academic web application built end-to-end:

- A normalized relational schema covering 15 entities with proper foreign keys, cascading deletes, and enums
- Role-based access control (ADMIN / STUDENT) enforced at both the middleware and page/API level
- A full content-management workflow: draft → published → archived, with view/download analytics
- Server Components for data-heavy public pages (fast, SEO-friendly) and Client Components for interactive admin CRUD
- Form validation with Zod shared between client and server
- A cohesive design system (Shadcn-style components, custom academic color palette, responsive layouts)

It is intentionally scoped as a **medium-level** project — complete and production-quality in structure, but without unnecessary complexity (no microservices, no third-party payment/file-storage integrations, no multi-tenancy).

---

## 🔭 Future Improvements

- File upload support for resources/downloads (currently uses external URLs)
- Email notifications for new notices/scholarships (e.g. via Resend or Nodemailer)
- Rich text / Markdown editor for article and guide content instead of plain textareas
- Full-text search (e.g. MySQL `FULLTEXT` indexes or a dedicated search service) instead of `LIKE`-based search
- OAuth login providers (Google, GitHub) — the schema already supports this via the `Account` model
- Pagination/infinite scroll on the admin tables for very large datasets
- Audit log for admin actions
- Dark mode toggle (the design tokens already include a `.dark` theme)

---

## 📝 Notes

- This project uses **NextAuth v5 (beta)** with the **Credentials provider** and **JWT session strategy** — the Prisma adapter is included for schema compatibility and future OAuth support, but is not required for the credentials-only flow.
- All admin API routes are protected by `requireAdminApi()`, and all admin/dashboard pages are protected by `requireAdmin()` / `requireAuth()` plus global middleware on `/admin/*` and `/dashboard/*`.
- An admin cannot change their own role, block themselves, or delete their own account (safeguard against accidental lockout).
- `npm audit` may report a moderate PostCSS advisory bundled *inside* `next`'s own internal build tooling (`node_modules/next/node_modules/postcss`). This is an upstream Next.js packaging detail unrelated to this project's own pinned `postcss` version (which is already on a patched release) and isn't fixable from the application side without downgrading Next.js itself.

## Author

**Md. Shahanur Islam Shagor**

Enterprise B2B Marketplace Architecture

Global Trade Platform

Built with Next.js, MySQL & prisma ❤️

---
