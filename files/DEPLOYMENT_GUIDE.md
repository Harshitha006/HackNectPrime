# 🚀 HackNect - Complete Setup & Deployment Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Installation Steps](#installation-steps)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [Project Structure](#project-structure)
8. [API Documentation](#api-documentation)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd hacknect

# 2. Run with Docker (Recommended)
docker-compose up -d

# 3. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# AI Service: http://localhost:8000
```

**That's it!** The application is now running with all services connected.

---

## 📦 Prerequisites

### Required Software
- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **Python** >= 3.9 ([Download](https://www.python.org/))
- **PostgreSQL** >= 14 ([Download](https://www.postgresql.org/))
- **MongoDB** >= 6 ([Download](https://www.mongodb.com/))
- **Redis** >= 7 ([Download](https://redis.io/))
- **Docker** & Docker Compose (Optional but recommended)

### Accounts Required
- **Firebase** account for authentication ([Console](https://console.firebase.google.com/))
- **SendGrid** account for emails (Optional) ([Signup](https://sendgrid.com/))
- **OpenAI** API key (Optional, for enhanced embeddings)

---

## 📥 Installation Steps

### Option 1: Docker (Recommended) ✅

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Option 2: Manual Setup

#### Step 1: Install Dependencies

```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..

# AI Service dependencies
cd ai-service
pip install -r requirements.txt
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..
```

#### Step 2: Set Up Databases

**PostgreSQL:**
```bash
# Create database
createdb hacknect

# Run schema
psql -d hacknect -f database/postgresql-schema.sql
```

**MongoDB:**
```bash
# Start MongoDB
mongod

# MongoDB collections are auto-created
```

**Redis:**
```bash
# Start Redis
redis-server
```

#### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env
```

#### Step 4: Start Services

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: AI Service
cd ai-service
uvicorn app.main:app --reload

# Terminal 3: Frontend
cd frontend
npm run dev
```

---

## 🔐 Environment Configuration

Create a `.env` file in the root directory:

```env
# ==========================================
# DATABASE CONFIGURATION
# ==========================================
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/hacknect
MONGODB_URI=mongodb://localhost:27017/hacknect
REDIS_URL=redis://localhost:6379

# ==========================================
# FIREBASE CONFIGURATION
# ==========================================
# Get these from Firebase Console → Project Settings → General
FIREBASE_API_KEY=AIza...
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123

# For backend (Service Account)
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# ==========================================
# JWT CONFIGURATION
# ==========================================
JWT_SECRET=your_super_secret_key_min_32_chars_change_in_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# ==========================================
# EMAIL CONFIGURATION (SendGrid)
# ==========================================
SENDGRID_API_KEY=SG.xyz...
FROM_EMAIL=noreply@hacknect.com
FROM_NAME=HackNect Team

# ==========================================
# AI SERVICE CONFIGURATION
# ==========================================
AI_SERVICE_URL=http://localhost:8000
OPENAI_API_KEY=sk-...  # Optional, for better embeddings

# ==========================================
# APPLICATION URLs
# ==========================================
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_AI_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ==========================================
# NODE ENVIRONMENT
# ==========================================
NODE_ENV=development
PORT=5000
```

---

## 🗄️ Database Setup

### PostgreSQL Schema

The schema includes:
- ✅ Users, Skills, Interests
- ✅ Teams, Members, Open Roles
- ✅ Events, Registrations
- ✅ Join Requests
- ✅ Match Scores
- ✅ Skill Gap Analysis
- ✅ Mentor Radar Alerts
- ✅ Reverse Projects
- ✅ Startups, Jobs, Applications

**Automatic Setup:**
```bash
# With Docker
docker-compose up postgres  # Schema auto-loads

# Manual
psql -d hacknect -f database/postgresql-schema.sql
```

### MongoDB Collections

Auto-created collections:
- `messages` - Team chat messages
- `notifications` - User notifications
- `online_status` - Real-time presence
- `activity_logs` - User actions

### Sample Data

The schema includes sample events:
- CodeFest 2025 (National, Mumbai)
- AI/ML Global Hackathon (Virtual)
- HealthTech Challenge (Bangalore)
- Web3 Summit (Virtual)
- EduTech Fair (Delhi University)

---

## 🏃 Running the Application

### Development Mode

```bash
# All services with Docker
docker-compose up

# Individual services
npm run dev          # All services
npm run dev:backend  # Backend only
npm run dev:ai       # AI service only
npm run dev:frontend # Frontend only
```

### Production Mode

```bash
# Build all services
npm run build

# Start in production
npm start

# With Docker
docker-compose -f docker-compose.prod.yml up -d
```

### Accessing Services

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main web application |
| Backend API | http://localhost:5000 | REST API endpoints |
| AI Service | http://localhost:8000 | Matching algorithms |
| API Docs | http://localhost:5000/api-docs | Swagger documentation |
| AI Docs | http://localhost:8000/docs | FastAPI documentation |

---

## 📂 Project Structure

```
hacknect/
├── README.md                          # Main documentation
├── DEPLOYMENT_GUIDE.md                # This file
├── docker-compose.yml                 # Docker configuration
├── .env.example                       # Environment template
├── package.json                       # Root package file
│
├── frontend/                          # Next.js Frontend
│   ├── app/                          # App router pages
│   │   ├── (auth)/                   # Auth pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/              # Protected pages
│   │   │   ├── dashboard/
│   │   │   ├── events/
│   │   │   ├── teams/
│   │   │   ├── profile/
│   │   │   ├── chat/
│   │   │   └── prime/
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing page
│   │
│   ├── components/                    # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── layout/                   # Layout components
│   │   ├── teams/                    # Team components
│   │   ├── events/                   # Event components
│   │   ├── chat/                     # Chat components
│   │   └── analytics/                # Analytics components
│   │
│   ├── lib/                          # Utilities
│   │   ├── api.ts                    # API client
│   │   ├── socket.ts                 # Socket.io client
│   │   ├── firebase.ts               # Firebase config
│   │   └── utils.ts                  # Helper functions
│   │
│   ├── hooks/                        # Custom React hooks
│   ├── types/                        # TypeScript types
│   ├── public/                       # Static files
│   ├── package.json
│   └── next.config.js
│
├── backend/                          # Node.js Backend
│   ├── src/
│   │   ├── controllers/              # Route controllers
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── team.controller.ts
│   │   │   ├── event.controller.ts
│   │   │   ├── request.controller.ts
│   │   │   ├── chat.controller.ts
│   │   │   ├── notification.controller.ts
│   │   │   └── prime.controller.ts
│   │   │
│   │   ├── models/                   # Database models
│   │   │   ├── user.model.ts
│   │   │   ├── team.model.ts
│   │   │   ├── event.model.ts
│   │   │   └── ...
│   │   │
│   │   ├── routes/                   # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── team.routes.ts
│   │   │   └── ...
│   │   │
│   │   ├── services/                 # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── match.service.ts
│   │   │   ├── notification.service.ts
│   │   │   └── ...
│   │   │
│   │   ├── middleware/               # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   └── error.middleware.ts
│   │   │
│   │   ├── socket/                   # Socket.io handlers
│   │   │   ├── chat.socket.ts
│   │   │   ├── notifications.socket.ts
│   │   │   └── presence.socket.ts
│   │   │
│   │   ├── utils/                    # Utilities
│   │   ├── config/                   # Configuration
│   │   └── index.ts                  # Entry point
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── ai-service/                       # Python AI Service
│   ├── app/
│   │   ├── main.py                   # FastAPI app
│   │   ├── matching/                 # Matching algorithms
│   │   │   ├── tfidf_matcher.py      # TF-IDF vectorization
│   │   │   ├── cosine_similarity.py  # Similarity calculation
│   │   │   ├── skill_matcher.py      # Skill matching
│   │   │   └── hybrid_matcher.py     # Combined approach
│   │   │
│   │   ├── analytics/                # Analytics features
│   │   │   ├── skill_gaps.py         # Skill gap heatmap
│   │   │   ├── mentor_radar.py       # Mentor radar algorithm
│   │   │   └── team_analytics.py     # Team insights
│   │   │
│   │   ├── models/                   # Data models
│   │   │   ├── user.py
│   │   │   ├── team.py
│   │   │   └── match.py
│   │   │
│   │   ├── api/                      # API routes
│   │   │   ├── match.py
│   │   │   ├── analytics.py
│   │   │   └── health.py
│   │   │
│   │   └── utils/                    # Utilities
│   │       ├── db.py                 # Database connection
│   │       ├── cache.py              # Redis cache
│   │       └── vectorizer.py         # Text vectorization
│   │
│   ├── requirements.txt
│   ├── Dockerfile
│   └── pytest.ini
│
└── database/                         # Database files
    ├── postgresql-schema.sql         # PostgreSQL schema
    ├── mongodb-schema.js             # MongoDB collections
    └── seed-data.sql                 # Sample data
```

---

## 📚 API Documentation

### Base URLs
- **Backend:** `http://localhost:5000/api`
- **AI Service:** `http://localhost:8000/api`

### Authentication Endpoints

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe",
  "userType": "participant"
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### User Endpoints

```http
GET /api/users/:id
Authorization: Bearer <token>

# Response
{
  "id": "uuid",
  "displayName": "John Doe",
  "userType": "participant",
  "skills": ["Python", "React", "ML"],
  "interests": ["AI/ML", "Web Development"]
}
```

### Team Endpoints

```http
POST /api/teams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Team Innovate",
  "description": "Building AI solutions",
  "projectIdea": "Healthcare chatbot using NLP",
  "eventId": "event-uuid",
  "maxMembers": 5,
  "techStack": ["Python", "TensorFlow", "React"]
}
```

### Matching Endpoints (AI Service)

```http
POST /api/match/user-teams
Content-Type: application/json

{
  "userId": "user-uuid",
  "limit": 10
}

# Response
{
  "matches": [
    {
      "teamId": "team-uuid",
      "teamName": "Team Innovate",
      "compatibilityScore": 0.87,
      "matchReasons": {
        "skills": ["Python", "ML"],
        "interests": ["AI/ML"],
        "experience": "intermediate"
      }
    }
  ]
}
```

### Full API Documentation

Access interactive API documentation:
- **Backend:** http://localhost:5000/api-docs (Swagger UI)
- **AI Service:** http://localhost:8000/docs (FastAPI Docs)

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Error:** `ECONNREFUSED ::1:5432`

**Solution:**
```bash
# Check if PostgreSQL is running
pg_isadmin

# Start PostgreSQL
# On Mac
brew services start postgresql

# On Linux
sudo systemctl start postgresql

# On Windows
# Start PostgreSQL service from Services app
```

#### 2. Firebase Auth Error

**Error:** `Firebase: Error (auth/invalid-api-key)`

**Solution:**
- Verify Firebase credentials in `.env`
- Ensure Firebase project is created
- Check Firebase console for correct API key

#### 3. Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Find process using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

#### 4. Node Modules Issues

**Error:** `Cannot find module...`

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or use
npm ci
```

#### 5. Docker Issues

**Error:** `Container failed to start`

**Solution:**
```bash
# Check logs
docker-compose logs backend

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Getting Help

1. Check the [GitHub Issues](https://github.com/yourusername/hacknect/issues)
2. Join our [Discord Community](https://discord.gg/hacknect)
3. Email: support@hacknect.com

---

## 🎯 Next Steps

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project
   - Enable Authentication (Email, Google, GitHub)
   - Create web app and copy credentials

2. **Set Up SendGrid** (Optional)
   - Sign up at [SendGrid](https://sendgrid.com/)
   - Create API key
   - Verify sender email

3. **Deploy to Production**
   - See [DEPLOYMENT.md](./docs/DEPLOYMENT.md)
   - Options: Vercel (Frontend), Railway (Backend), DigitalOcean (Full Stack)

4. **Customize**
   - Update branding in `frontend/app/layout.tsx`
   - Modify color scheme in `frontend/tailwind.config.ts`
   - Add custom features

---

## 📝 Additional Resources

- [Frontend Documentation](./frontend/README.md)
- [Backend API Documentation](./backend/README.md)
- [AI Service Documentation](./ai-service/README.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Security Policy](./SECURITY.md)

---

**Happy Hacking! 🚀**

If you build something cool with HackNect, we'd love to hear about it!
