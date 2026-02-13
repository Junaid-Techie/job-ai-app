# 🚀 Job AI Matcher  
### AI-Powered Semantic Job Intelligence Platform

---

## 🌍 Live Application

Frontend:  
👉 https://job-ai-app-six.vercel.app  

Backend API Docs:  
👉 https://job-ai-app-backend.onrender.com/docs  

---

# 🧠 Vision

**Job AI Matcher** is designed to evolve into a fully automated AI-powered job intelligence platform.

Instead of keyword-based job searching, it uses vector embeddings and semantic similarity to understand meaning — not just words.

This project is built with a long-term goal:

> Transform job search from manual filtering into intelligent, AI-driven matching and automation.

---

# 🎯 Core Problem

Traditional job platforms:

- Depend on exact keyword matching
- Miss semantically relevant opportunities
- Cannot understand transferable skills
- Require heavy manual filtering

This system introduces:

✔ Resume semantic understanding  
✔ AI-powered job similarity scoring  
✔ Structured filtering layer  
✔ Production-ready cloud deployment  

---

# 🏗 System Architecture

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

# 🔬 How It Works

### 1️⃣ Resume Intelligence
Resume text → OpenAI → 1536-dimensional embedding

### 2️⃣ Job Intelligence
Job title + description → embedding stored in PostgreSQL

### 3️⃣ Semantic Matching
PostgreSQL pgvector performs L2 distance search

### 4️⃣ Ranking
Distance converted into similarity percentage

### 5️⃣ Filtering Layer
Structured filters:
- Work mode (remote, hybrid, onsite)
- Salary range
- Job type
- Location
- Experience level
- Sponsorship
- Recency

---

# 🧮 Similarity Calculation

```
similarity_score = (1 / (1 + distance)) * 100
```

Lower vector distance → Higher semantic relevance.

---

# 🛠 Technology Stack

## Backend
- FastAPI
- SQLAlchemy ORM
- pgvector
- psycopg2
- OpenAI SDK
- Environment-based configuration

## Database
- Supabase PostgreSQL (Free Tier)
- Session Pooler (IPv4-compatible)
- Vector extension enabled

## Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Environment-aware API integration

## Deployment
- Backend → Render
- Frontend → Vercel
- Database → Supabase
- AI → OpenAI

---

# 📂 Monorepo Structure

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

# 🚀 What This Project Demonstrates

This system showcases:

- Real-world vector database integration
- Semantic search implementation
- OpenAI embedding pipeline
- Cloud-native architecture
- Full-stack monorepo design
- Cross-origin production configuration
- Environment-based secret management
- IPv4 vs IPv6 deployment debugging
- Production troubleshooting workflow

---

# 🔒 Production Challenges Solved

During deployment, the following real-world issues were resolved:

- Supabase IPv6 incompatibility with Render
- Switching to Session Pooler for IPv4 support
- CORS configuration between Vercel & Render
- Missing production dependencies
- Python runtime compatibility
- Git upstream branch conflicts
- Secret key rotation after exposure

This reflects production-grade engineering maturity.

---

# ⚡ Performance Considerations

- Vector similarity computed at database layer
- Embeddings stored for reuse
- Stateless backend design
- Cloud-based scaling
- Free-tier optimized architecture

---

# 📈 Future Roadmap

## Phase 1 – Intelligence Expansion
- Resume PDF parsing
- Skill extraction
- Match explanation engine
- Confidence scoring

## Phase 2 – Automation
- Live job ingestion APIs
- Automated job syncing
- Personalized recommendations
- Saved job tracking

## Phase 3 – Full SaaS
- User authentication
- Resume management
- Application tracking dashboard
- Cover letter generator
- Subscription billing
- Auto-apply workflow

---

# 🎯 Long-Term Vision

Evolve into:

> A fully autonomous AI job agent  
> That understands user profiles, tracks opportunities, ranks relevance, and automates the application pipeline.

---

# 🧠 Engineering Philosophy

This project is intentionally designed to:

- Separate frontend and backend cleanly
- Use environment-based configuration
- Avoid hard-coded secrets
- Handle real-world cloud networking issues
- Scale beyond MVP architecture
- Be maintainable in a production environment

---

# 🏆 Why This Project Stands Out

This is not a tutorial demo.

It is:

- A semantic search engine
- A vector database implementation
- A cloud-deployed AI system
- A full-stack monorepo architecture
- A production debugging case study

It reflects real engineering practice.

---

# 👨‍💻 Author

Built as a production-ready AI system to demonstrate semantic search, vector database integration, and scalable cloud architecture.

---

# 📜 License

MIT License
