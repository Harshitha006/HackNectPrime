# 🚀 HackNect - AI-Powered Hackathon Matchmaking Platform

> **Simple. Intelligent. Connected.** - Match with teams, mentors, and opportunities instantly.

## ✨ What is HackNect?

HackNect is an AI-driven platform that connects hackathon participants, teams, and mentors through intelligent matchmaking. Whether you're looking for teammates, seeking mentorship, or a startup hunting for talent, HackNect makes the connection seamless.

## 🎯 Core Features

### For Participants
- 🤝 **Smart Matching** - AI finds teams that match your skills (Python, ML, React, etc.)
- 📧 **Two-Way Notifications** - Get alerted when teams need YOU
- 🎓 **Event Discovery** - Browse global/national hackathons with filters
- 💬 **Team Chat** - Real-time collaboration once you join
- 📊 **Profile Showcase** - Display your skills, projects, and experience

### For Teams
- 🎯 **Post Open Roles** - "Looking for ML Engineer" → notify matching participants
- 🤖 **AI Recommendations** - Get participant matches based on your needs
- 📈 **Skill Gap Heatmap** - Visual analysis of what skills you're missing (Green = strong, Red = gap)
- 🚨 **Mentor Radar** - AI detects team struggles in chat, auto-suggests mentors
- ✅ **Request Management** - Review and accept join requests

### For Mentors
- 🎓 **Browse Teams** - See teams tagged "mentor needed"
- 🎯 **Get Matched** - AI connects you with teams needing your expertise
- 💡 **Floating Mentors** - Mentor multiple teams when demand is high
- 📊 **Impact Tracking** - See your mentorship contributions

### For Startups (Prime)
- 💼 **Talent Discovery** - Browse vetted participants and teams
- 🎯 **Smart Matching** - AI matches candidates to your job requirements
- 📢 **Post Opportunities** - Internships, jobs, collaborations
- 🤝 **Direct Outreach** - Request individuals/teams to join your startup

## 🏗️ Tech Stack

```
Frontend:  Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
Backend:   Node.js + Express + TypeScript
AI:        Python + FastAPI + TF-IDF + Cosine Similarity
Database:  PostgreSQL + MongoDB + Redis
Auth:      Firebase Authentication
Real-time: Socket.io
Storage:   Firebase Storage
```

## 📋 Quick Start

### Prerequisites

```bash
Node.js >= 18.0.0
Python >= 3.9
PostgreSQL >= 14
MongoDB >= 6
Redis >= 7
```

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd hacknect

# 2. Install dependencies
npm install
cd backend && npm install && cd ..
cd ai-service && pip install -r requirements.txt && cd ..
cd frontend && npm install && cd ..

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# 4. Set up databases
npm run db:setup

# 5. Start all services
npm run dev
```

The application will be running at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Service: http://localhost:8000

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/hacknect
MONGODB_URI=mongodb://localhost:27017/hacknect
REDIS_URL=redis://localhost:6379

# Firebase
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# JWT
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@hacknect.com

# AI Service
OPENAI_API_KEY=your_openai_key_optional

# URLs
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_AI_URL=http://localhost:8000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 📁 Project Structure

```
hacknect/
├── frontend/              # Next.js frontend application
│   ├── app/              # App router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities and helpers
│   └── public/          # Static assets
├── backend/              # Node.js Express API
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── middleware/  # Auth, validation, etc.
│   │   └── socket/      # Socket.io handlers
│   └── package.json
├── ai-service/           # Python FastAPI AI service
│   ├── app/
│   │   ├── matching/    # Matching algorithms
│   │   ├── analytics/   # Skill gaps, mentor radar
│   │   └── models/      # ML models
│   └── requirements.txt
├── database/            # Database schemas and migrations
│   ├── schema.sql      # PostgreSQL schema
│   └── mongodb.js      # MongoDB collections
└── docker-compose.yml  # Docker setup
```

## 🚀 User Journey

### Participant Flow
```
Sign Up → Complete Profile (skills, bio) → Browse Events → Join Hackathon
→ View Team Feed (highlighted matches) → Request to Join Team → Pitch Yourself
→ Team Accepts → Team Chat Unlocked → Collaborate → Submit Project
```

### Team Leader Flow
```
Create Account → Join Event → Create Team → Add Project Idea → Post Open Roles
→ Get AI Matches → Review Requests → Accept Members → Assign Mentor
→ View Skill Gap Heatmap → Collaborate in Chat → Submit Project
```

### Mentor Flow
```
Sign Up as Mentor → Add Expertise → Browse Teams → Get Matched (teams needing help)
→ Join Team → Monitor Progress (Mentor Radar alerts if stuck) → Guide Team
```

### Startup Flow (Prime)
```
Upgrade to Prime → Create Company Profile → Post Jobs/Internships
→ Browse Participants/Teams → Get AI Matches → Send Offers → Hire Talent
```

## 🤖 AI Matchmaking Algorithm

### How It Works

1. **Profile Vectorization**
   - User skills, interests, bio → TF-IDF vectors
   - Team requirements, project domain → TF-IDF vectors

2. **Cosine Similarity**
   ```python
   similarity = cosine_similarity(user_vector, team_vector)
   # Result: 0.0 (no match) to 1.0 (perfect match)
   ```

3. **Multi-Factor Scoring**
   ```python
   final_score = (
       skill_match * 0.40 +        # 40% - Skills alignment
       experience_match * 0.25 +    # 25% - Experience level
       interest_match * 0.20 +      # 20% - Domain interest
       availability * 0.15          # 15% - Availability
   )
   ```

4. **Match Threshold**
   - Score ≥ 0.60 (60%) = Recommended match
   - Score ≥ 0.80 (80%) = Excellent match

### Example

**User Profile:**
```json
{
  "skills": ["Python", "Machine Learning", "TensorFlow"],
  "interests": ["AI/ML", "HealthTech"],
  "experience": "intermediate"
}
```

**Team Needs:**
```json
{
  "open_role": "ML Engineer",
  "required_skills": ["Python", "Deep Learning", "ML"],
  "project_domain": "HealthTech"
}
```

**Result:** 87% match → "Excellent match! Team Innovate needs your ML skills"

## 📊 Smart Features

### 1. Skill Gaps Heatmap™
Visual representation of team competencies:
- **Green** - Team is strong in this skill
- **Yellow** - Moderate coverage
- **Red** - Critical gap, need to fill

```
Project Needs: Python, React, ML, DevOps, UI/UX

Team Skills:
🟢 Python    ████████████ 95%
🟢 React     ██████████── 75%
🟡 ML        ██████────── 60%
🔴 DevOps    ██────────── 20%
🔴 UI/UX     ───────────── 0%

→ Recommended: Add DevOps Engineer and UI/UX Designer
```

### 2. Mentor Radar™
AI analyzes team chat to detect struggles:

**Triggers:**
- Low activity (< 10 messages in 24h)
- Struggle keywords: "stuck", "help", "blocked", "not working", "error"
- Long message gaps (> 4 hours between messages)

**Action:**
```
🚨 Mentor Radar Alert!
Team "Innovate" appears stuck on ML model training.
Suggested Mentors:
1. Dr. Sarah Chen (ML Expert, 4.9★)
2. Prof. James Liu (AI Specialist, 4.8★)
```

## 🔔 Notification System (Two-Way)

### Participant → Team
- User requests to join → Team leader notified
- User matches team role → Team notified

### Team → Participant
- Team invites user → User notified
- New matching role posted → Relevant users notified

### Mentor ↔ Team
- Team tags "mentor needed" → Matching mentors notified
- Mentor offers help → Team notified

### Startup → Users (Prime)
- Job posted → Matching participants/teams notified
- Direct offer sent → Recipient notified

## 📱 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/google
GET    /api/auth/me
```

### Users
```
GET    /api/users/:id
PUT    /api/users/:id
GET    /api/users/search
POST   /api/users/skills
```

### Teams
```
POST   /api/teams
GET    /api/teams/:id
PUT    /api/teams/:id
GET    /api/teams/feed
POST   /api/teams/:id/roles
GET    /api/teams/:id/analytics
```

### Events
```
GET    /api/events
GET    /api/events/:id
POST   /api/events/:id/register
```

### Matching (AI)
```
POST   /api/match/user-teams
POST   /api/match/team-users
POST   /api/match/mentor-teams
POST   /api/match/startup-talent
```

### Requests
```
POST   /api/requests/join
POST   /api/requests/invite
PUT    /api/requests/:id/approve
PUT    /api/requests/:id/reject
```

### Chat (WebSocket)
```
WS     /socket.io
Events: join_room, send_message, typing, user_online
```

## 🎨 UI Design Principles

### Minimal & Soothing
- Clean layouts with ample whitespace
- Soft color palette (blues, purples, greens)
- Smooth transitions and animations
- Clear call-to-actions
- Mobile-first responsive design

### Key Pages
1. **Landing** - Hero + features + how it works
2. **Dashboard** - Personalized feed with matches
3. **Events** - Hackathon listings with filters
4. **Team Feed** - Browse teams (role matches highlighted)
5. **Profile** - User/Team/Mentor showcase
6. **Chat** - Clean messaging interface
7. **Analytics** - Skill heatmap visualization
8. **Prime Hub** - Startup features

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# AI service tests
cd ai-service && pytest
```

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📈 Performance

- **Frontend**: Code splitting, lazy loading, image optimization
- **Backend**: Redis caching, database indexing, connection pooling
- **AI**: FAISS for fast vector search, batch processing
- **Real-time**: Socket.io rooms, efficient event handling

## 🔒 Security

- JWT authentication with refresh tokens
- Firebase Auth for social login
- SQL injection prevention (parameterized queries)
- XSS protection (input sanitization)
- Rate limiting (100 req/min per user)
- HTTPS enforcement in production
- CORS configuration

## 📄 License

MIT License - Feel free to use for your hackathons!

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md first.

## 📞 Support

- Email: support@hacknect.com
- Discord: [Join Community](https://discord.gg/hacknect)
- Docs: [docs.hacknect.com](https://docs.hacknect.com)

---

**Built with ❤️ for the global hackathon community**

*Connecting brilliant minds, one match at a time.*
