# ⚙️ Job AI Matcher — Backend

### FastAPI · PostgreSQL · pgvector · OpenAI · Supabase

[![Python](https://img.shields.io/badge/Python-3.11-4b5563?style=flat)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-374151?style=flat)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-475569?style=flat)](https://supabase.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o+Embeddings-1f2937?style=flat)](https://openai.com)
[![Deployed on Render](https://img.shields.io/badge/Deployed-Render-6b7280?style=flat)](https://render.com)

---

## 🌍 Live Endpoints

**API Docs (Swagger UI)**
👉 https://job-ai-app-backend.onrender.com/docs

**Frontend**
👉 https://job-ai-app-six.vercel.app

---

## 🧠 What This Backend Does

This is the core AI engine of the Job AI Matcher platform. It handles:

- **User authentication** — Register, login, JWT issuance, password reset via email
- **Resume management** — Upload (PDF/DOCX/TXT), text extraction, embedding generation, multi-resume profiles
- **Live job ingestion** — Fetches fresh jobs from Remotive and Arbeitnow APIs on demand
- **Semantic job matching** — Vector similarity search via pgvector (L2 distance)
- **Auto-apply** — GPT-4o-mini generates a tailored cover letter and tracks the application
- **Interview prep** — AI generates personalized questions + tips per application
- **Profile management** — 20+ field user profile including compliance/EEOC data
- **Saved jobs** — Bookmark and retrieve jobs across sessions
- **Recommendations** — Auto-ranked jobs based on user's latest resume embedding

---

## 🏗 Architecture

```
FastAPI
  ├── /auth/*          → JWT auth, register, login, password reset (Resend)
  ├── /upload-resume   → File parsing (PyPDF2, python-docx) + Supabase Storage
  ├── /add-resume/     → Text resume embedding
  ├── /resumes/        → List user's stored resumes
  ├── /match-jobs/     → Semantic match with structured filters
  ├── /search-and-match/ → Ingest live jobs THEN match (inline pipeline)
  ├── /auto-apply/     → GPT-4o-mini cover letter + application record
  ├── /applications/   → Application history
  ├── /interview-prep/ → AI-generated prep guide
  ├── /save-job/       → Save a job
  ├── /saved-jobs/     → List saved jobs
  ├── /recommendations/ → Top matches from latest resume
  └── /profile/        → GET + PUT full user profile
```

---

## 📂 File Structure

```
backend/
│
├── api/
│   ├── main.py              # All primary API routes
│   ├── auth.py              # Register, login, forgot/reset password
│   ├── upload.py            # Resume upload, text extraction, skill auto-extraction
│   ├── models.py            # SQLAlchemy models
│   ├── database.py          # DB session and engine setup
│   ├── embedding_service.py # OpenAI embedding wrapper
│   ├── security.py          # JWT creation + verification
│   └── supabase_client.py   # Supabase storage client
│
├── scripts/
│   └── ingest_jobs.py       # Remotive + Arbeitnow job ingestion
│
├── requirements.txt
└── runtime.txt              # python-3.11.x
```

---

## 🗄 Data Models

### `users`
Full user profile including: name, email, hashed_password (Argon2), location, headline, about, skills, job_type, experience_years, target_salary, linkedin_url, github_url, portfolio_url, current_company, highest_education, avatar_url, phone_number, gender, ethnicity, veteran_status, disability_status, work_authorization, requires_sponsorship.

### `resumes`
- `content` — Extracted plain text
- `embedding` — `Vector(1536)` from OpenAI `text-embedding-3-small`
- `file_path` — Supabase Storage path (`{user_id}/{uuid}_{filename}`)
- `file_type` — pdf / docx / txt / text

### `jobs`
- `title`, `description`, `location`, `work_mode`, `job_type`, `experience_level`
- `salary_min`, `salary_max`, `sponsorship`, `company_size`, `industry`
- `url` — Original job posting URL
- `embedding` — `Vector(1536)`

### `applications`
- Links user → job → resume
- `status`: APPLIED / INTERVIEW / REJECTED
- `cover_letter` — GPT-4o-mini generated text

### `saved_jobs`
Bookmark table linking user ↔ job with timestamp.

### `password_reset_tokens`
Secure single-use, 1-hour-expiry tokens for password resets.

---

## 🔑 Full API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | — | Register new user |
| `POST` | `/auth/login` | — | Login, returns JWT |
| `POST` | `/auth/forgot-password` | — | Send reset email via Resend |
| `POST` | `/auth/reset-password` | — | Consume token, set new password |
| `POST` | `/upload-resume` | ✅ JWT | Upload PDF/DOCX/TXT, extract text + auto-extract skills |
| `POST` | `/add-resume/` | ✅ JWT | Add resume via raw text |
| `GET` | `/resumes/` | ✅ JWT | List user's uploaded resumes |
| `GET` | `/match-jobs/{resume_id}` | ✅ JWT | Semantic match with filters |
| `POST` | `/search-and-match/{resume_id}` | ✅ JWT | Fetch live jobs + match inline |
| `POST` | `/auto-apply/` | ✅ JWT | Generate cover letter + apply |
| `GET` | `/applications/` | ✅ JWT | Application history |
| `GET` | `/interview-prep/{application_id}` | ✅ JWT | AI prep guide |
| `POST` | `/save-job/{job_id}` | ✅ JWT | Bookmark a job |
| `GET` | `/saved-jobs/` | ✅ JWT | List saved jobs |
| `GET` | `/recommendations/` | ✅ JWT | Top matches from latest resume |
| `GET` | `/profile/` | ✅ JWT | Read full user profile |
| `PUT` | `/profile/` | ✅ JWT | Update user profile |
| `POST` | `/add-job/` | 🔑 Admin Secret | Add job manually |
| `POST` | `/admin/sync-jobs/` | ✅ JWT | Trigger background job sync |

---

## 🧬 Semantic Matching Deep Dive

### Embedding Generation
```python
# OpenAI text-embedding-3-small
# 1536-dimension float vector
embedding = client.embeddings.create(
    model="text-embedding-3-small",
    input=text
).data[0].embedding
```

### Vector Search (SQLAlchemy + pgvector)
```python
query = db.query(
    Job.id, Job.title, Job.location, ...,
    Job.embedding.l2_distance(resume.embedding).label("distance")
).order_by(
    Job.embedding.l2_distance(resume.embedding)
).limit(15)
```

### Similarity Score
```python
similarity_score = round((1 / (1 + job.distance)) * 100, 2)
```

Lower L2 distance → Higher similarity percentage.

---

## 🌐 Live Job Ingestion

The `search-and-match` endpoint ingests fresh jobs **inline** before matching:

```python
fetch_remotive(db, limit=15)   # https://remotive.com/api/remote-jobs
fetch_arbeitnow(db, limit=15)  # https://arbeitnow.com/api/job-board-api
```

- No API keys required for either source
- Deduplication: skips jobs with identical title + company already in DB
- Each job is embedded with OpenAI and stored with a URL for direct application

---

## 🚀 Local Development

### 1. Create virtual environment
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Create `.env` in `/backend`
```env
DATABASE_URL=postgresql://user:password@host:port/dbname
OPENAI_API_KEY=sk-...
SECRET_KEY=your-jwt-secret
ADMIN_SECRET=your-admin-secret
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your-supabase-anon-key
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com
FRONTEND_URL=http://localhost:3000
```

### 4. Run server
```bash
python -m uvicorn api.main:app --reload
```

API available at `http://127.0.0.1:8000`
Swagger docs at `http://127.0.0.1:8000/docs`

---

## 🚀 Deployment (Render)

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Python Version | `3.11` (via `runtime.txt`) |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `python -m uvicorn api.main:app --host 0.0.0.0 --port 10000` |

**Required Environment Variables on Render:**
- `DATABASE_URL` — Supabase Session Pooler URL (IPv4 compatible)
- `OPENAI_API_KEY`
- `SECRET_KEY`
- `ADMIN_SECRET`
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `FRONTEND_URL`

> ⚠️ Use the **Session Pooler** connection string from Supabase, not the direct URL. Render free tier is IPv4-only; direct Supabase connections are IPv6.

---

## 🔐 Security Design

- **Argon2** password hashing (memory-hard, winner of PHC)
- **JWT** with `python-jose` — tokens verified on every protected route
- **Admin routes** protected by a separate `admin-secret` header
- **Password reset tokens**: single-use, 1-hour expiry, enumeration-safe response
- **CORS** restricted to `localhost:3000` and the production Vercel domain
- **Supabase file paths** include UUID prefix to prevent path guessing

---

## 🏆 Engineering Highlights

- Vector database semantic search (pgvector, L2 distance)
- Inline live data ingestion pipeline (no external scheduler needed)
- Multi-modal resume ingestion (PDF, DOCX, TXT, raw text)
- AI auto-skill extraction from resume on upload
- GPT-4o-mini generative AI for cover letters and interview prep
- Argon2 + JWT full auth system with email-based reset
- SQLAlchemy ORM with proper relationship navigation
- FastAPI router modularization (auth, upload, main)
- Supabase Storage integration for file persistence
- Production IPv4 compatibility via Session Pooler

---

## 📜 License

MIT License
