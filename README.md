# 🚀 Job AI Matcher
### AI-Powered Semantic Job Intelligence & Auto-Apply Platform

![Typing SVG](https://readme-typing-svg.herokuapp.com?size=22&duration=3500&color=6B7280&lines=Semantic+Job+Matching;Auto-Apply+with+AI+Cover+Letters;Vector+Database+Powered;Full+User+Authentication+%26+Profiles)

[![Python](https://img.shields.io/badge/Python-3.11-4b5563?style=flat)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-374151?style=flat)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-475569?style=flat)](https://supabase.com)
[![pgvector](https://img.shields.io/badge/Vector-Search-334155?style=flat)](https://github.com/pgvector/pgvector)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o+Embeddings-1f2937?style=flat)](https://openai.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-111827?style=flat)](https://nextjs.org)
[![Deployment](https://img.shields.io/badge/Deployment-Render%20%7C%20Vercel-6b7280?style=flat)](https://vercel.com)

---

## 🌍 Live Application

**Frontend**
👉 https://job-ai-app-six.vercel.app

**Backend API Docs**
👉 https://job-ai-app-backend.onrender.com/docs

---

## 🧠 Vision

Job AI Matcher is a production-grade, full-stack AI platform that transforms the job search process from a manual grind into an intelligent, automated pipeline.

> Upload your resume once. The agent scans the global market, matches jobs semantically, writes tailored cover letters, and tracks every application — autonomously.

---

## 🎯 The Problem

Traditional job platforms:
- Rely on exact keyword matching
- Miss semantically relevant opportunities
- Fail to understand transferable skills
- Require heavy manual filtering and repetitive form-filling

This platform introduces:

✔ Resume semantic understanding via vector embeddings
✔ AI-powered similarity ranking (pgvector L2 distance)
✔ Live job ingestion from multiple free APIs
✔ GPT-4o-mini cover letter generation on auto-apply
✔ AI-generated interview prep guides
✔ Full user profile & compliance data management
✔ Application tracking dashboard
✔ Saved job library

---

## 🏗 Architecture

```
┌──────────────────────────────┐
│        🌐 Next.js 15          │
│   App Router · Vercel CDN    │
│  Auth (NextAuth) · Tailwind  │
└──────────────┬───────────────┘
               ↓ HTTPS / REST
┌──────────────────────────────┐
│       ⚙ FastAPI Backend       │
│   JWT Auth · SQLAlchemy ORM  │
│     Render (Free Tier)       │
└──────┬───────────────┬───────┘
       ↓               ↓
┌──────────────┐  ┌───────────────────┐
│  🤖 OpenAI   │  │ 🌐 Live Job APIs  │
│  Embeddings  │  │  Remotive         │
│  GPT-4o-mini │  │  Arbeitnow        │
└──────┬───────┘  └───────────────────┘
       ↓
┌──────────────────────────────┐
│  🗄 Supabase PostgreSQL       │
│  pgvector · Session Pooler   │
│  Resumes · Jobs · Users      │
│  Applications · SavedJobs    │
└──────────────────────────────┘
```

---

## 🔬 How It Works

### 1️⃣ Resume Intelligence
Upload PDF/DOCX/TXT or paste text → Extracted → OpenAI `text-embedding-3-small` → 1536-dim vector stored in PostgreSQL

### 2️⃣ Auto Skill Extraction
On upload, GPT-4o-mini extracts top skills and populates the user's profile automatically.

### 3️⃣ Live Job Ingestion
On search trigger, the backend fetches fresh jobs from Remotive and Arbeitnow APIs in real-time. Deduplication prevents re-embedding identical listings.

### 4️⃣ Semantic Matching
```python
Job.embedding.l2_distance(resume.embedding)
```
Ranked by vector distance, converted to a human-readable similarity score:
```
similarity_score = round((1 / (1 + distance)) * 100, 2)
```

### 5️⃣ Filtering Layer
Results can be narrowed by:
- Work mode (Remote / Hybrid / On-site)
- Salary range
- Job type
- Location
- Experience level
- Sponsorship requirement
- Industry
- Recency (posted within N days)

### 6️⃣ Auto-Apply
One click generates a GPT-4o-mini cover letter tailored to the specific job + resume, submits an application record, and tracks status.

### 7️⃣ Interview Prep
For any tracked application, the AI generates 3 tailored interview questions + coaching tips based on the job description and the user's resume.

---

## 🛠 Full Technology Stack

### Backend
| Layer | Technology |
|---|---|
| API Framework | FastAPI |
| ORM | SQLAlchemy |
| Vector Search | pgvector (L2 distance) |
| DB Driver | psycopg2-binary |
| AI / NLP | OpenAI SDK (embeddings + GPT-4o-mini) |
| Auth | JWT (python-jose) + Argon2 password hashing |
| File Parsing | PyPDF2, python-docx |
| File Storage | Supabase Storage |
| Email | Resend API (password reset) |
| Job Ingestion | Remotive API, Arbeitnow API |

### Database (Supabase PostgreSQL)
| Table | Purpose |
|---|---|
| `users` | Profile, auth, compliance, preferences |
| `resumes` | Content, 1536-dim embedding, file metadata |
| `jobs` | Title, description, filters, 1536-dim embedding, URL |
| `applications` | Job applications, status, GPT cover letter |
| `saved_jobs` | User bookmarked jobs |
| `password_reset_tokens` | Secure 1-hour reset tokens |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Auth | NextAuth.js |

### Deployment
| Service | Host |
|---|---|
| Backend | Render (Free Tier) |
| Frontend | Vercel |
| Database | Supabase (Free Tier) |
| AI | OpenAI API |

---

## 📂 Monorepo Structure

```
job-ai-app/
│
├── backend/
│   ├── api/
│   │   ├── main.py              # All API routes (match, apply, profile, saved, recommendations)
│   │   ├── auth.py              # Register, login, forgot/reset password
│   │   ├── upload.py            # Resume file upload + skill extraction
│   │   ├── models.py            # SQLAlchemy models (User, Resume, Job, Application, SavedJob)
│   │   ├── database.py          # DB connection
│   │   ├── embedding_service.py # OpenAI embedding wrapper
│   │   ├── security.py          # JWT creation / verification
│   │   └── supabase_client.py   # Supabase storage client
│   ├── scripts/
│   │   └── ingest_jobs.py       # Remotive + Arbeitnow ingestion
│   ├── requirements.txt
│   └── runtime.txt              # Python 3.11
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # Landing page
│   │   ├── dashboard/           # Job search, match, apply, recommendations, saved
│   │   ├── profile/             # Full career profile management
│   │   ├── login/               # Auth login
│   │   ├── register/            # New user registration
│   │   ├── reset-password/      # Password reset flow
│   │   ├── features/            # Feature showcase page
│   │   ├── about/               # About page
│   │   └── contact/             # Contact page
│   └── ...
│
└── README.md
```

---

## 🔑 Full API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login, returns JWT |
| `POST` | `/auth/forgot-password` | Send password reset email |
| `POST` | `/auth/reset-password` | Reset password with token |
| `POST` | `/upload-resume` | Upload PDF/DOCX/TXT, extract text + skills |
| `POST` | `/add-resume/` | Add resume via pasted text |
| `GET` | `/resumes/` | List user's uploaded resumes |
| `GET` | `/match-jobs/{resume_id}` | Semantic match with structured filters |
| `POST` | `/search-and-match/{resume_id}` | Ingest live jobs THEN match |
| `POST` | `/auto-apply/` | Apply to job + generate GPT cover letter |
| `GET` | `/applications/` | Get user's application history |
| `GET` | `/interview-prep/{application_id}` | AI interview prep guide |
| `POST` | `/save-job/{job_id}` | Save a job to library |
| `GET` | `/saved-jobs/` | Get saved jobs list |
| `GET` | `/recommendations/` | Auto-recommendations from latest resume |
| `GET` | `/profile/` | Get full user profile |
| `PUT` | `/profile/` | Update user profile |
| `POST` | `/add-job/` | Admin: add job (secret-key protected) |
| `POST` | `/admin/sync-jobs/` | Admin: background job sync |

---

## ✅ Completed Feature Milestones

### Phase 1 — Core Infrastructure
- [x] Vector database integration (pgvector)
- [x] Semantic similarity search via OpenAI embeddings
- [x] Monorepo cloud deployment (Vercel + Render + Supabase)
- [x] CORS configuration between Vercel and Render

### Phase 2 — Automation & Intelligence
- [x] Live job ingestion from Remotive + Arbeitnow APIs
- [x] Search-and-match: ingest fresh jobs, then match in one call
- [x] Auto-apply with GPT-4o-mini tailored cover letter
- [x] AI-generated interview prep guides per application
- [x] Auto-extracted skills on resume upload
- [x] Personalized recommendations from latest resume
- [x] Saved job library
- [x] Application tracking dashboard

### Phase 3 — User Management & Platform
- [x] Full user registration and JWT login
- [x] Secure password hashing (Argon2)
- [x] Forgot / reset password via email (Resend API)
- [x] Comprehensive profile management (20+ fields)
- [x] EEOC / compliance data collection for auto-apply
- [x] Resume file upload (PDF, DOCX, TXT) to Supabase Storage
- [x] Multi-resume management (switch between profiles)
- [x] Avatar / profile photo support

### Upcoming
- [ ] Resume PDF direct parsing with layout awareness
- [ ] Match explanation engine (AI-generated reasoning)
- [ ] Confidence scoring
- [ ] Subscription billing
- [ ] True automated form-fill workflow

---

## 🔐 Security

- JWT tokens with configurable expiry
- Argon2 password hashing (bcrypt-superior)
- Secrets via environment variables only — never in code
- Admin endpoints protected by separate secret header
- Password reset tokens: 1-hour expiry, single-use, enumeration-safe
- CORS restricted to known frontend domains only
- Supabase Session Pooler for IPv4 compatibility on Render

---

<details>
<summary>🔎 Technical Deep Dive (Click to Expand)</summary>

### Embedding Pipeline
- Model: `text-embedding-3-small`
- Dimensions: 1536
- Storage: `Vector(1536)` in PostgreSQL via pgvector
- Query: `Job.embedding.l2_distance(resume.embedding)`

### Why Argon2?
Argon2 is the winner of the Password Hashing Competition. It is memory-hard, making GPU cracking infeasible. Superior to bcrypt for modern auth systems.

### Why Session Pooler?
Render free instances are IPv4-only. Supabase direct connections prefer IPv6.  
Session Pooler provides an IPv4-compatible connection string without sacrificing functionality.

### Why Remotive + Arbeitnow?
Both APIs are free, require no API keys, and provide real remote job data. They are fetched inline on every search trigger, keeping the job database fresh without a separate scheduler.

</details>

---

<details>
<summary>🛠 Production Challenges Solved (Click to Expand)</summary>

- Supabase IPv6 incompatibility with Render → fixed via Session Pooler
- CORS errors between Vercel and Render → configured allow-list
- Python runtime risk (3.14 pre-release) → pinned via `runtime.txt`
- Missing production dependencies → complete `requirements.txt`
- JWT upstream branch conflicts → resolved with `--set-upstream`
- API key exposure → rotated, moved to env vars
- Resume file stream exhaustion → fixed by reading bytes once into memory

</details>

---

## 🏆 Why This Project Stands Out

This is not a tutorial demo. It is a production-deployed, end-to-end AI application:

- A **semantic search engine** powered by pgvector
- A **live data pipeline** ingesting from multiple job APIs
- A **generative AI workflow** producing cover letters and interview prep
- A **full auth system** with secure reset flows and argon2 hashing
- A **real compliance-aware user profile** system
- A **cloud-native monorepo** deployed across Vercel + Render + Supabase

It reflects senior-level engineering practice.

---

## 👨‍💻 Author

Built as a production-ready AI system demonstrating semantic search, vector databases, generative AI pipelines, and scalable full-stack architecture.

---

## 📜 License

MIT License
