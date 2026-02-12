# 🚀 Job AI Matcher  
### AI-Powered Semantic Job Matching Platform

[![Python](https://img.shields.io/badge/Python-3.13-blue)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-blue)]()
[![pgvector](https://img.shields.io/badge/Vector-Search-purple)]()
[![OpenAI](https://img.shields.io/badge/OpenAI-Embeddings-black)]()
[![Next.js](https://img.shields.io/badge/Next.js-Frontend-white)]()

---

## 🧠 Overview

**Job AI Matcher** is a full-stack AI-powered application that uses vector embeddings and semantic similarity search to intelligently match resumes with relevant job opportunities.

Instead of relying on keyword matching, this system leverages:

- OpenAI Embeddings (`text-embedding-3-small`)
- PostgreSQL + pgvector
- FastAPI backend
- Supabase (Free Tier)
- Next.js frontend

This project demonstrates production-grade AI system architecture with scalable semantic search.

---

## ✨ Key Features

✔ AI-powered semantic job matching  
✔ Resume and job embedding storage (1536-d vectors)  
✔ Vector similarity ranking using pgvector  
✔ Similarity score transformation  
✔ Cloud-hosted PostgreSQL database  
✔ Clean API architecture  
✔ Secure API key handling  
✔ Free-tier cloud deployment architecture  

---

## 🏗 System Architecture

```
Frontend (Next.js)
        ↓
FastAPI Backend
        ↓
OpenAI Embeddings API
        ↓
Supabase PostgreSQL + pgvector
        ↓
Semantic Similarity Ranking
```

---

## 🔍 How It Works

1. Resume text is converted into a 1536-dimension embedding.
2. Job title + description are embedded.
3. Vectors are stored in PostgreSQL using `pgvector`.
4. Matching is performed using L2 distance.
5. Results are converted into an intuitive similarity score.

---

## 🧮 Similarity Formula

```
similarity_score = (1 / (1 + distance)) * 100
```

Lower distance → Higher similarity.

---

## 📊 Example Output

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

## 🛠 Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- pgvector
- psycopg2
- python-dotenv

### Database
- Supabase PostgreSQL (Free Tier)
- pgvector extension enabled

### AI
- OpenAI Embeddings API
- Model: `text-embedding-3-small`
- 1536-dimension vectors

### Frontend
- Next.js (App Router)
- Tailwind CSS
- Vercel deployment ready

---

## 📂 Project Structure

```
job-ai-app/
│
├── api/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── embedding_service.py
│
├── .env
├── requirements.txt
├── .gitignore
```

---

## 🚀 Getting Started

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/job-ai-app.git
cd job-ai-app
```

### 2️⃣ Create Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 🔐 Environment Variables

Create `.env` file:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@HOST:5432/postgres
OPENAI_API_KEY=sk-xxxxxxxxxxxx
```

⚠ Never commit secrets.

---

## 🗄 Database Setup (Supabase)

Enable vector extension:

```sql
create extension if not exists vector;
```

---

## 🧪 Run Backend

```bash
python -m uvicorn api.main:app --reload
```

Access API Docs:

```
http://127.0.0.1:8000/docs
```

---

## 📌 API Endpoints

### ➤ Add Resume
```
POST /add-resume/
```

### ➤ Add Job
```
POST /add-job/
```

### ➤ Match Jobs
```
GET /match-jobs/{resume_id}
```

---

## 🔒 Security

- `.env` excluded from Git
- OpenAI billing cap enforced
- GitHub secret scanning protection enabled
- Clean commit hygiene

---

## 💡 Why This Project Stands Out

This project demonstrates:

- Real-world vector database usage
- Production-level AI integration
- Secure cloud architecture
- Full-stack system design
- Scalable SaaS-ready structure

It is not a demo script — it is an AI-backed recommendation engine.

---

## 📈 Roadmap

- Resume PDF upload & parsing
- Live job ingestion (Remotive / Adzuna APIs)
- Cover letter generator
- User authentication
- Job preference filters
- Automated job application system
- SaaS subscription model

---

## 🌍 Deployment Strategy (Free Tier)

- Frontend → Vercel
- Backend → Render (Free Web Service)
- Database → Supabase Free Tier
- AI → OpenAI (Usage capped)

---

## 👨‍💻 Author

Built as a full-stack AI engineering project showcasing semantic search, vector databases, and production-grade architecture.

---

## 📜 License

MIT License
