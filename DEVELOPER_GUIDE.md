# HackNect Developer Guide

## 🚀 Project Overview
HackNect is a full-stack platform designed to connect hackathon participants, form teams using AI matching, and manage hackathon events.

## 🏗️ Architecture Status
The project consists of three main microservices:

1.  **Frontend** (`/frontend`)
    *   **Tech**: Next.js 15+, TypeScript, Tailwind CSS
    *   **Port**: `3000`
    *   **Status**: Fully functional. Connects to Backend via `/api`.

2.  **Backend** (`/backend`)
    *   **Tech**: Node.js, Express, TypeScript, PostgreSQL (pg)
    *   **Port**: `4000`
    *   **Status**: Fully functional. Includes **Demo Mode** fallback (runs without DB connection).
    *   **Key Feature**: If PostgreSQL is unreachable, it automatically switches to an in-memory store so you can test team creation/matching without setting up a DB.

3.  **AI Service** (`/ai-service`)
    *   **Tech**: Python, FastAPI, scikit-learn
    *   **Port**: `8000`
    *   **Status**: functional. Provides matching logic (TF-IDF/Cosine Similarity) for users and teams.

---

## 🛠️ How to Run

### Option 1: Quick Start (Recommended)
We have a PowerShell script that installs dependencies for all services and launches them concurrently.

```powershell
# In the root directory (d:\HackNect)
.\start-dev.ps1
```

### Option 2: Run Services Individually
Use this if you need to debug a specific service. Open 3 separate terminals:

**Terminal 1: Frontend**
```bash
cd frontend
npm install  # First time only
npm run dev
# Access at http://localhost:3000
```

**Terminal 2: Backend**
```bash
cd backend
npm install  # First time only
npm run dev
# API available at http://localhost:4000
```

**Terminal 3: AI Service**
```bash
cd ai-service
# Create/Activate venv (First time only)
python -m venv venv
.\venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run Service
python main.py
# Swagger Docs at http://localhost:8000/docs
```

---

## 🗄️ Database Connection
The backend is configured to use **PostgreSQL**.

-   **Demo Mode (Default if no DB)**: If the backend cannot connect to Postgres, it logs a warning and switches to **In-Memory Mode**. You can create user/teams, but data is lost on restart.
-   **Production/Full Mode**: To persist data:
    1.  Install PostgreSQL.
    2.  Create a database named `hacknect`.
    3.  Update `backend/.env` with your credentials (see below).
    4.  Initialize tables:
        ```bash
        cd backend
        npm run init-db
        ```+
        

---

## 🔑 Environment Variables

**Backend (`backend/.env`)**
```env
PORT=4000
# Database Config
DB_USER=postgres
DB_HOST=localhost
DB_NAME=hacknect
DB_PASSWORD=yourpassword
DB_PORT=5432

# AI Integration
AI_SERVICE_URL=http://localhost:8000

# Auth
JWT_SECRET=supersecretkey_dev
```

**Frontend (`frontend/.env.local`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```
