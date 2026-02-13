# 🚀 Job AI Matcher – Frontend

This is the **Next.js frontend** for the Job AI Matcher platform.

It provides a modern UI for interacting with the AI-powered backend that performs semantic job matching using vector embeddings.

---

## 🌍 Live Application

Frontend:  
👉 https://job-ai-app-six.vercel.app  

Backend:  
👉 https://job-ai-app-backend.onrender.com  

---

## 🧠 What This Frontend Does

The frontend allows users to:

- Paste resume content
- Send resume text to backend
- Trigger AI-based job matching
- View ranked job results
- See similarity scores
- View job metadata (location, work mode, salary)

It connects to a production FastAPI backend deployed on Render.

---

## 🏗 Architecture

```
Next.js (Vercel)
        ↓
FastAPI (Render)
        ↓
Supabase (PostgreSQL + pgvector)
        ↓
OpenAI Embeddings
```

The frontend communicates with the backend via:

```
NEXT_PUBLIC_API_URL
```

---

## 🛠 Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Fetch API
- Vercel Deployment

---

## 📂 Folder Structure

```
frontend/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── public/
├── package.json
├── next.config.ts
└── tsconfig.json
```

---

## ⚙️ Local Development

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Create Environment File

Create:

```
frontend/.env.local
```

Add:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

If testing against production backend:

```
NEXT_PUBLIC_API_URL=https://job-ai-app-backend.onrender.com
```

---

### 3️⃣ Run Development Server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🔐 Environment Variables

This project uses:

```
NEXT_PUBLIC_API_URL
```

Because it is prefixed with `NEXT_PUBLIC_`, it is exposed to the browser.

Do NOT store secret keys here.

Secrets remain in backend only.

---

## 🚀 Production Deployment (Vercel)

### Step 1: Import GitHub Repository
- Go to https://vercel.com
- Import repository

### Step 2: Set Root Directory
```
frontend
```

### Step 3: Add Environment Variable

```
NEXT_PUBLIC_API_URL = https://job-ai-app-backend.onrender.com
```

### Step 4: Deploy

---

## 🌐 CORS Configuration

The backend allows cross-origin requests from the frontend domain.

Backend uses:

```python
CORSMiddleware
```

Configured for production deployment.

---

## 🧪 Features Implemented

- Resume submission
- AI match triggering
- Loading states
- Error handling
- Clean UI
- Responsive design
- Environment-aware API routing
- Production-safe fetch handling

---

## 🎯 UI/UX Considerations

- Clean gradient background
- Card-based layout
- Disabled buttons during loading
- Error message display
- Clear call-to-action buttons
- Mobile-responsive design
- Match score badge visualization

---

## 📈 Future Improvements

- Resume file upload (PDF parsing)
- Filter sidebar (salary, remote, hybrid)
- Dark mode toggle
- Animated transitions
- Match explanation view
- Saved jobs list
- Authentication
- Dashboard analytics

---

## 👨‍💻 Developer Notes

This frontend is part of a full-stack monorepo:

```
job-ai-app/
├── backend/
└── frontend/
```

Backend is deployed independently.

Frontend communicates via environment variables.

---

## 🏆 Why This Project Is Impressive

This frontend demonstrates:

- Real-world API integration
- Production environment configuration
- Secure architecture separation
- Cloud deployment workflow
- Clean UI engineering
- End-to-end AI system integration

---

## 📜 License

MIT License
