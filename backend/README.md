# 🚀 Job AI Matcher  
### Production-Grade AI Semantic Job Matching Platform

[![Python](https://img.shields.io/badge/Python-3.11-blue)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-blue)]()
[![pgvector](https://img.shields.io/badge/Vector-Search-purple)]()
[![OpenAI](https://img.shields.io/badge/OpenAI-Embeddings-black)]()
[![Next.js](https://img.shields.io/badge/Next.js-Frontend-white)]()

---

# 🌍 Live Application

Frontend:  
👉 https://job-ai-app-six.vercel.app  

Backend API Docs:  
👉 https://job-ai-app-backend.onrender.com/docs  

---

# 🧠 Executive Summary

**Job AI Matcher** is a full-stack AI-powered web application that performs semantic job matching using vector embeddings and similarity search.

Unlike traditional keyword-based systems, this platform:

- Converts resumes into vector embeddings
- Converts job descriptions into embeddings
- Uses PostgreSQL + pgvector for semantic similarity
- Ranks jobs by mathematical distance
- Deploys across modern cloud infrastructure

This project demonstrates real-world AI integration, vector database usage, and production-ready full-stack deployment.

---

# 🎯 Business Problem Solved

Traditional job boards:

- Rely on exact keyword matching
- Miss semantically similar opportunities
- Fail to understand skill equivalence

This system introduces:

✔ Semantic understanding of resume context  
✔ Embedding-based ranking  
✔ AI-driven similarity scoring  
✔ Structured filtering layer  

---

# 🏗 High-Level Architecture

```
Next.js (Vercel)
        ↓
FastAPI (Render)
        ↓
OpenAI Embeddings API
        ↓
Supabase PostgreSQL + pgvector
        ↓
Vector Similarity Search
```

---

# 🔬 Technical Deep Dive

## 1️⃣ Resume Embedding

Resume text → OpenAI API → 1536-dimension vector

Model used:
```
text-embedding-3-small
```

## 2️⃣ Job Embedding

Job title + description → embedding stored in PostgreSQL.

## 3️⃣ Vector Storage

PostgreSQL with `pgvector` extension:

```sql
create extension if not exists vector;
```

Column type:
```python
Vector(1536)
```

## 4️⃣ Semantic Search Query

SQLAlchemy L2 distance:

```python
Job.embedding.l2_distance(resume.embedding)
```

## 5️⃣ Similarity Conversion

```
similarity_score = (1 / (1 + distance)) * 100
```

Lower distance → Higher semantic similarity.

---

# 📊 Example API Response

```json
[
  {
    "job_id": 1,
    "title": "Backend Python Engineer",
    "similarity_score": 58.18
  }
]
```

---

# 📂 Monorepo Structure

```
job-ai-app/
│
├── backend/
│   ├── api/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── embedding_service.py
│   │
│   ├── requirements.txt
│   ├── runtime.txt
│   └── venv/
│
├── frontend/
│   ├── app/
│   ├── public/
│   └── ...
│
└── README.md
```

---

# 🛠 Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- pgvector
- psycopg2-binary
- python-dotenv
- OpenAI SDK

### Database
- Supabase PostgreSQL (Free Tier)
- Session Pooler (IPv4 compatible)
- pgvector extension

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Deployment
- Backend → Render (Free Tier)
- Frontend → Vercel
- Database → Supabase

---

# 🚀 Deployment Architecture

## Backend (Render)

- Root Directory → `backend`
- Python version pinned to 3.11 via `runtime.txt`
- Build → `pip install -r requirements.txt`
- Start → `python -m uvicorn api.main:app --host 0.0.0.0 --port 10000`
- Supabase Session Pooler URL required (IPv4 compatible)

## Frontend (Vercel)

- Root Directory → `frontend`
- Environment variable:
  ```
  NEXT_PUBLIC_API_URL
  ```

---

# 🔐 Security & DevOps Notes

✔ `.env` excluded from Git  
✔ API keys rotated after exposure  
✔ Environment variables managed via cloud provider  
✔ Supabase password URL-encoded  
✔ CORS configured properly  
✔ IPv4 pooling used for Render compatibility  
✔ Python runtime pinned for stability  

---

# 🧪 Production Issues Solved

During deployment, the following real-world issues were resolved:

- IPv6 database connection failure on Render
- Supabase Direct Connection incompatibility
- CORS blocking cross-origin requests
- Missing dependencies in production
- Virtual environment path corruption
- Python 3.14 compatibility risk
- Upstream Git branch conflicts

This demonstrates full-stack debugging and deployment maturity.

---

# ⚡ Performance Considerations

- Vector search offloaded to database
- OpenAI embeddings cached in DB
- Stateless backend design
- Connection pooling via Supabase
- Free-tier optimized deployment

---

# 📈 Scalability Strategy

Future improvements include:

- Indexing embeddings
- Batch embedding generation
- Background job ingestion
- Authentication layer
- Resume file parsing
- Intelligent re-ranking
- User dashboards
- SaaS billing integration

---

# 🧠 Engineering Highlights (Resume-Ready)

This project demonstrates:

- Vector database implementation using pgvector
- Embedding-based semantic similarity search
- OpenAI API integration
- Full-stack monorepo architecture
- Cloud deployment with Render & Vercel
- Environment variable security
- Production debugging workflow
- SQLAlchemy ORM integration
- API design with FastAPI
- Real-world DevOps troubleshooting

---

# 🏆 Why This Project Is Impressive

This is not a tutorial project.

It showcases:

- End-to-end AI system design
- Vector-based information retrieval
- Cloud deployment architecture
- Real debugging of production issues
- Secure secret management
- Modern frontend-backend separation

It reflects production-level thinking.

---

# 📜 License

MIT License
