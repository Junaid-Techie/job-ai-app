# 🌐 Job AI Matcher — Frontend

### Next.js 15 · TypeScript · Tailwind CSS · NextAuth · Framer Motion

[![Next.js](https://img.shields.io/badge/Next.js-15-111827?style=flat)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06b6d4?style=flat)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat)](https://vercel.com)

---

## 🌍 Live Application

**Frontend**
👉 https://job-ai-app-six.vercel.app

**Backend API**
👉 https://job-ai-app-backend.onrender.com/docs

---

## 🧠 What This Frontend Does

The frontend is the full user-facing application for the Job AI Matcher platform. It provides:

- **Landing page** with animated hero, bento-grid features, and dashboard preview
- **Authentication flows** — Register, login, forgot password, reset password
- **Dashboard** — Job search (live + semantic), recommendations, saved jobs, application tracking
- **Profile management** — Comprehensive 20+ field career profile with avatar support
- **Resume management** — Upload PDF/DOCX/TXT or paste text; switch between multiple profiles
- **Auto-apply workflow** — One-click apply with GPT-generated cover letter display
- **Interview prep** — AI coaching guide per tracked application
- **Multi-page site** — Features, About, Contact pages

---

## 📂 App Structure

```
frontend/
│
├── app/
│   ├── page.tsx               # Landing page (hero, bento grid, features preview)
│   ├── layout.tsx             # Root layout (Navbar, auth providers)
│   ├── providers.tsx          # NextAuth SessionProvider wrapper
│   ├── globals.css            # Global styles + glass-panel utility
│   │
│   ├── dashboard/
│   │   └── page.tsx           # Main dashboard: Search, Recommendations, Saved, Applications
│   ├── profile/
│   │   └── page.tsx           # Full career profile editor
│   ├── login/
│   │   └── page.tsx           # Email + password login
│   ├── register/
│   │   └── page.tsx           # New user registration
│   ├── reset-password/
│   │   └── page.tsx           # Password reset (token consumed from email link)
│   ├── features/
│   │   └── page.tsx           # Features showcase page
│   ├── about/
│   │   └── page.tsx           # About page
│   ├── contact/
│   │   └── page.tsx           # Contact page
│   │
│   ├── api/
│   │   └── auth/[...nextauth]/ # NextAuth handler
│   │
│   └── components/
│       └── Navbar.tsx         # Top navigation (session-aware)
│
├── types/                     # TypeScript types
├── public/                    # Static assets
├── package.json
├── next.config.ts
└── tsconfig.json
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Authentication | NextAuth.js (credentials provider) |
| HTTP | Native Fetch API |
| Deployment | Vercel |

---

## 🎯 Key Pages & Features

### Landing Page (`/`)
- Animated gradient hero section
- Live pulse badge ("Introducing Auto-Apply AI 3.0")
- Animated dashboard wireframe preview
- Bento-grid feature showcase (Semantic Engine, 1-Click Apply, Cover Letters, Pipeline)
- Session-aware CTAs (Start For Free / Enter Dashboard)

### Dashboard (`/dashboard`)
Tabbed interface with 4 panels:

1. **Search** — Upload or select resume → run live job ingestion + semantic match → view ranked results with similarity scores, filters, Save + Apply buttons
2. **Recommendations** — Instant top matches from latest resume (auto-loads on tab open)
3. **Saved Jobs** — Bookmarked positions with Apply Now shortcut
4. **Applications** — Full application history with status, cover letter preview, and Interview Prep trigger

### Profile (`/profile`)
4-section form:
1. **Core Identity** — Avatar, name, email (locked), phone, location, headline, summary
2. **Background & Preferences** — Current company, education, salary, experience, job type, skills
3. **Compliance & Demographics** — Work authorization, sponsorship, gender, ethnicity, veteran status, disability status (for EEOC auto-fill)
4. **Web Presence** — LinkedIn, GitHub, portfolio URLs

### Auth Pages
- `/register` — Create account (first name, last name, email, password)
- `/login` — Email + password, returns JWT stored in NextAuth session
- `/reset-password` — Consumes token from email link, sets new password

---

## ⚙️ Local Development

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Create `.env.local`
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Point to local or prod backend
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### 3. Start dev server
```bash
npm run dev
```

Opens at: `http://localhost:3000`

---

## 🚀 Production Deployment (Vercel)

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Framework Preset | Next.js |
| Build Command | `next build` (auto-detected) |

**Required Environment Variables on Vercel:**
```
NEXT_PUBLIC_API_URL = https://job-ai-app-backend.onrender.com
NEXTAUTH_URL       = https://job-ai-app-six.vercel.app
NEXTAUTH_SECRET    = your-secret-here
```

---

## 🔐 Authentication Architecture

- **NextAuth.js** with a **Credentials Provider** calls `POST /auth/login` on the backend
- The backend returns a JWT access token, which NextAuth stores in the session as `session.accessToken`
- Every protected page reads `session.accessToken` and passes it as `Authorization: Bearer <token>` to the API
- Unauthenticated users are redirected to `/login` via `useSession` + `router.push`

---

## 🌐 CORS

The backend allows cross-origin requests from:
- `http://localhost:3000` (local dev)
- `https://job-ai-app-six.vercel.app` (production)

No additional browser configuration needed.

---

## ✅ Implemented Features

| Feature | Status |
|---|---|
| Landing page with animated hero | ✅ |
| User registration | ✅ |
| Email + password login | ✅ |
| Forgot / reset password flow | ✅ |
| Resume upload (PDF, DOCX, TXT) | ✅ |
| Resume paste (text) | ✅ |
| Multi-resume selector | ✅ |
| Live job ingestion + semantic match | ✅ |
| Search filters (work mode, salary) | ✅ |
| Similarity score badges | ✅ |
| Save job to library | ✅ |
| One-click auto-apply + cover letter | ✅ |
| Application tracking dashboard | ✅ |
| AI interview prep per application | ✅ |
| Personalized recommendations tab | ✅ |
| Full profile editor (20+ fields) | ✅ |
| Compliance / EEOC data collection | ✅ |
| Avatar upload (base64) | ✅ |
| Session-aware navigation | ✅ |
| Framer Motion page transitions | ✅ |
| Glassmorphism UI design | ✅ |
| Responsive design | ✅ |
| Features, About, Contact pages | ✅ |

---

## 🏆 Engineering Highlights

- NextAuth credentials provider bridging JWT-based FastAPI auth
- Session token threading from NextAuth → every authenticated API call
- Inline tab-driven data fetching (each tab fetches its own data on focus)
- Multi-resume management with dynamic selector + upload toggle
- Compliance form that pre-populates from backend profile on load
- Avatar handled as base64 dataURL for instant local preview before save
- Framer Motion `initial/animate/whileInView` patterns across all pages
- Environment-aware API URL (local vs production via `NEXT_PUBLIC_API_URL`)

---

## 📜 License

MIT License
