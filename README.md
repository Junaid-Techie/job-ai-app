# Job AI Matcher  
### AI-Powered Semantic Job Intelligence Platform

![Typing SVG](https://readme-typing-svg.herokuapp.com?size=22&duration=3000&color=6B7280&lines=Semantic+Job+Matching;Vector+Database+Powered;OpenAI+Embedding+Driven;Production+Cloud+Architecture)

[![Python](https://img.shields.io/badge/Python-3.11-4b5563?style=flat)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-374151?style=flat)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-475569?style=flat)]()
[![pgvector](https://img.shields.io/badge/Vector-Search-334155?style=flat)]()
[![OpenAI](https://img.shields.io/badge/OpenAI-Embeddings-1f2937?style=flat)]()
[![Next.js](https://img.shields.io/badge/Next.js-Frontend-111827?style=flat)]()
[![Deployment](https://img.shields.io/badge/Deployment-Render%20%7C%20Vercel-6b7280?style=flat)]()

---

## Live Application

Frontend  
https://job-ai-app-six.vercel.app  

Backend API Docs  
https://job-ai-app-backend.onrender.com/docs  

---

## Vision

Job AI Matcher is built to evolve into a fully autonomous AI-powered job intelligence platform.

Instead of keyword-based searching, it understands meaning through vector embeddings.

> Transform job search from manual filtering into intelligent, AI-driven matching and automation.

---

## The Core Problem

Traditional job platforms:

- Rely on exact keyword matching  
- Miss semantically relevant opportunities  
- Fail to understand transferable skills  
- Require heavy manual filtering  

This system introduces:

- Resume semantic understanding  
- Embedding-based similarity ranking  
- Structured filtering  
- Production-ready cloud deployment  

---

## Architecture Overview

```
┌───────────────────────────┐
│       Frontend            │
│     Next.js (Vercel)      │
└───────────────┬───────────┘
                ↓
┌───────────────────────────┐
│        Backend            │
│    FastAPI (Render)       │
└───────────────┬───────────┘
                ↓
┌───────────────────────────┐
│     OpenAI Embeddings     │
└───────────────┬───────────┘
                ↓
┌───────────────────────────┐
│ PostgreSQL + pgvector     │
│    Supabase (Cloud)       │
└───────────────────────────┘
```

---

## How It Works

### 1️⃣ Resume Intelligence  
Resume text → OpenAI → 1536-dimensional embedding

### 2️⃣ Job Intelligence  
Job title + description → embedding stored in PostgreSQL

### 3️⃣ Semantic Matching  
Vector similarity search using pgvector L2 distance

### 4️⃣ Ranking  
Distance converted into similarity percentage

### 5️⃣ Structured Filtering  
Filters include:
- Remote / Hybrid / Onsite  
- Salary range  
- Job type  
- Location  
- Experience level  
- Sponsorship  
- Recency  

---

## Similarity Formula

```
similarity_score = (1 / (1 + distance)) * 100
```

Lower distance → Higher semantic relevance.

---

## Example Match Output

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

## Execution Flow (Backend Perspective)

```bash
> Resume Uploaded
> Generating Embedding...
> Storing Vector in Database...
> Searching Vector Similarity...
> Ranking Results...
> Returning Top Matches
```

---

## Technology Stack

### Backend
- FastAPI  
- SQLAlchemy ORM  
- pgvector  
- psycopg2  
- OpenAI SDK  
- Environment-based configuration  

### Database
- Supabase PostgreSQL (Free Tier)  
- Session Pooler (IPv4-compatible)  
- Vector extension enabled  

### Frontend
- Next.js (App Router)  
- TypeScript  
- Tailwind CSS  
- Environment-aware API integration  

### Deployment
- Backend → Render  
- Frontend → Vercel  
- Database → Supabase  
- AI → OpenAI  

---

## Monorepo Structure

```
job-ai-app/
│
├── backend/
│   ├── api/
│   ├── requirements.txt
│   └── runtime.txt
│
├── frontend/
│   ├── app/
│   ├── public/
│   └── ...
│
└── README.md
```

---

## What This Project Demonstrates

- Vector database integration  
- Embedding-based semantic search  
- Production cloud deployment  
- Monorepo architecture  
- Cross-origin production configuration  
- Secure environment variable management  
- IPv4 vs IPv6 deployment debugging  
- Real-world troubleshooting workflow  

---

## Production Challenges Solved

- Supabase IPv6 incompatibility with Render  
- Switching to Session Pooler for IPv4 support  
- CORS configuration between Vercel & Render  
- Missing production dependencies  
- Python runtime compatibility  
- Git upstream conflicts  
- Secret key rotation  

This reflects production-grade engineering maturity.

---

## Performance Considerations

- Vector similarity computed at database layer  
- Embeddings cached in storage  
- Stateless backend design  
- Free-tier optimized architecture  
- Ready for horizontal scaling  

---

## Future Roadmap

### Phase 1 – Intelligence
- Resume PDF parsing  
- Skill extraction  
- Match explanation engine  
- Confidence scoring  

### Phase 2 – Automation
- Live job ingestion APIs  
- Automated job syncing  
- Personalized recommendations  
- Saved job tracking  

### Phase 3 – SaaS Platform
- User authentication  
- Resume management  
- Application tracking dashboard  
- Cover letter generator  
- Subscription billing  
- Auto-apply workflow  

---

## Long-Term Vision

> A fully autonomous AI job agent  
> That understands user profiles, tracks opportunities, ranks relevance, and automates the application pipeline.

---

## Engineering Philosophy

This project is intentionally designed to:

- Separate frontend and backend cleanly  
- Use environment-based configuration  
- Avoid hard-coded secrets  
- Handle real-world cloud networking issues  
- Scale beyond MVP architecture  
- Remain production maintainable  

---

## Why This Project Stands Out

This is not a tutorial demo.

It is:

- A semantic search engine  
- A vector database implementation  
- A cloud-deployed AI system  
- A full-stack monorepo architecture  
- A production debugging case study  

It reflects real engineering practice.

---

## Author

Built as a production-ready AI system demonstrating semantic search, vector database integration, and scalable cloud architecture.

---

## License

MIT License
