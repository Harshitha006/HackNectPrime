# 🚀 HackNect - Quick Start Guide for Developers

This guide will help you get the HackNect platform running on your local machine in under 30 minutes.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js** version 18.0.0 or higher ([Download](https://nodejs.org/))
- [ ] **Python** version 3.11 or higher ([Download](https://www.python.org/))
- [ ] **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/))
- [ ] **Git** ([Download](https://git-scm.com/))
- [ ] **Code Editor** (VS Code recommended)
- [ ] **8GB RAM minimum** (16GB recommended)
- [ ] **20GB free disk space**

Verify installations:
```bash
node --version  # Should show v18.x.x or higher
python --version  # Should show 3.11.x or higher
docker --version  # Should show Docker version 24.x.x or higher
git --version  # Should show git version 2.x.x or higher
```

## 🎯 Step-by-Step Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/hacknect.git
cd hacknect
```

### Step 2: Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Open .env in your editor
code .env  # or nano .env, vim .env, etc.
```

**Minimum Required Variables for Local Development:**

```bash
# Database (leave as is for local)
DATABASE_URL=postgresql://hacknect:hackn3ct_dev_2026@localhost:5432/hacknect_db
MONGODB_URI=mongodb://hacknect:hackn3ct_dev_2026@localhost:27017/hacknect?authSource=admin
REDIS_URL=redis://:hackn3ct_dev_2026@localhost:6379
RABBITMQ_URL=amqp://hacknect:hackn3ct_dev_2026@localhost:5672/hacknect

# JWT Secret (generate a random string or use this for dev)
JWT_SECRET=dev_secret_key_change_in_production

# Firebase (REQUIRED - get from Firebase Console)
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef

# Firebase Admin (for backend)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"

# AI Services (OPTIONAL for MVP, but recommended)
OPENAI_API_KEY=sk-proj-your-key  # Get from https://platform.openai.com/
PINECONE_API_KEY=your-key  # Get from https://www.pinecone.io/

# Email (OPTIONAL - notifications won't work without this)
SENDGRID_API_KEY=SG.your-key  # Get from https://sendgrid.com/
FROM_EMAIL=noreply@hacknect.com
```

### Step 3: Get Firebase Credentials

**This is REQUIRED for authentication to work.**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication:
   - Click "Authentication" → "Get Started"
   - Enable Google and Email/Password sign-in methods
4. Get Web App Config:
   - Click Project Settings (⚙️) → "Your apps" → Web app
   - Copy the config values to your `.env` file
5. Get Admin SDK credentials:
   - Project Settings → "Service Accounts"
   - Click "Generate new private key"
   - Copy values from the JSON file to your `.env`

### Step 4: Start Infrastructure Services

```bash
# Start PostgreSQL, MongoDB, Redis, and RabbitMQ
docker-compose up -d postgres mongodb redis rabbitmq

# Check if all services are running
docker-compose ps

# You should see all 4 services with status "Up"
```

**Verify Services:**
- PostgreSQL: `docker exec -it hacknect-postgres psql -U hacknect -d hacknect_db -c "SELECT NOW();"`
- MongoDB: `docker exec -it hacknect-mongodb mongosh --eval "db.version()"`
- Redis: `docker exec -it hacknect-redis redis-cli ping` (should return PONG)
- RabbitMQ Management UI: http://localhost:15672 (user: hacknect, password: hackn3ct_dev_2026)

### Step 5: Initialize Database

```bash
# Create database tables
npm run migrate

# (Optional) Seed with sample data
npm run seed
```

If you don't have the migration scripts yet, here's a minimal SQL to run manually:

```bash
# Connect to PostgreSQL
docker exec -it hacknect-postgres psql -U hacknect -d hacknect_db

# Paste this SQL:
```

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  experience_level VARCHAR(50) DEFAULT 'beginner',
  github_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  portfolio_url VARCHAR(255),
  preferred_role VARCHAR(100),
  looking_for_team BOOLEAN DEFAULT false,
  available_as_mentor BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  proficiency_level VARCHAR(50),
  years_experience DECIMAL(3,1),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  interest_category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(50),
  domain VARCHAR(100),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  registration_deadline TIMESTAMP,
  location VARCHAR(255),
  is_virtual BOOLEAN DEFAULT false,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  organizer_name VARCHAR(255),
  organizer_email VARCHAR(255),
  event_url TEXT,
  logo_url TEXT,
  prize_pool VARCHAR(100),
  status VARCHAR(50) DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  project_idea TEXT,
  event_id UUID REFERENCES events(id),
  leader_id UUID REFERENCES users(id),
  max_members INTEGER DEFAULT 5,
  current_members INTEGER DEFAULT 1,
  looking_for_members BOOLEAN DEFAULT true,
  tech_stack TEXT[],
  team_avatar_url TEXT,
  github_repo_url VARCHAR(255),
  status VARCHAR(50) DEFAULT 'forming',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(100),
  joined_at TIMESTAMP DEFAULT NOW(),
  is_leader BOOLEAN DEFAULT false,
  UNIQUE(team_id, user_id)
);

CREATE TABLE open_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  role_title VARCHAR(100) NOT NULL,
  required_skills TEXT[],
  description TEXT,
  is_filled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  team_id UUID REFERENCES teams(id),
  request_type VARCHAR(50),
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,
  responder_id UUID REFERENCES users(id)
);

CREATE TABLE match_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  team_id UUID REFERENCES teams(id),
  compatibility_score DECIMAL(3,2),
  match_reasons JSONB,
  calculated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, team_id)
);

-- Indexes for performance
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX idx_teams_event_id ON teams(event_id);
CREATE INDEX idx_teams_leader_id ON teams(leader_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_open_roles_team_id ON open_roles(team_id);
CREATE INDEX idx_join_requests_user_id ON join_requests(user_id);
CREATE INDEX idx_join_requests_team_id ON join_requests(team_id);
CREATE INDEX idx_match_scores_user_id ON match_scores(user_id);
CREATE INDEX idx_match_scores_team_id ON match_scores(team_id);
```

### Step 6: Install Dependencies

**Backend Services (Node.js):**
```bash
# Root dependencies
npm install

# Install for each service
cd services/user-service && npm install && cd ../..
cd services/team-service && npm install && cd ../..
cd services/event-service && npm install && cd ../..
# ... repeat for other Node.js services
```

**Matchmaking Service (Python):**
```bash
cd services/matchmaking-service
pip install -r requirements.txt
cd ../..
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

### Step 7: Start All Services

**Option A: Using Docker Compose (Recommended)**
```bash
# Start everything
docker-compose up

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

**Option B: Manual Start (for development)**

Open separate terminal windows for each:

```bash
# Terminal 1 - User Service
cd services/user-service
npm run dev

# Terminal 2 - Team Service
cd services/team-service
npm run dev

# Terminal 3 - Matchmaking Service
cd services/matchmaking-service
uvicorn app.main:app --reload --port 3003

# Terminal 4 - Event Service
cd services/event-service
npm run dev

# Terminal 5 - Notification Service
cd services/notification-service
npm run dev

# Terminal 6 - Request Service
cd services/request-service
npm run dev

# Terminal 7 - Chat Service
cd services/chat-service
npm run dev

# Terminal 8 - Analytics Service
cd services/analytics-service
uvicorn app.main:app --reload --port 3008

# Terminal 9 - Reverse Service
cd services/reverse-service
npm run dev

# Terminal 10 - API Gateway
cd gateway
npm run dev

# Terminal 11 - Frontend
cd frontend
npm start
```

### Step 8: Verify Everything is Running

Open your browser and check:

1. **Frontend**: http://localhost:3000 (React app should load)
2. **API Gateway**: http://localhost:8080/health (should return JSON)
3. **User Service**: http://localhost:3001/health
4. **Team Service**: http://localhost:3002/health
5. **Matchmaking Service**: http://localhost:3003/health
6. **RabbitMQ Management**: http://localhost:15672

### Step 9: Test the Application

**Create a Test Account:**
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Register with email or Google
4. Complete onboarding (add skills, interests)
5. Browse events and teams

**Test API Endpoints:**
```bash
# Health check
curl http://localhost:8080/health

# Create user (after getting Firebase token)
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "firebase_uid": "test123",
    "email": "test@example.com",
    "display_name": "Test User",
    "experience_level": "intermediate"
  }'
```

## 🐛 Troubleshooting

### Common Issues

**Issue: "Cannot connect to database"**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker logs hacknect-postgres
```

**Issue: "Firebase authentication failed"**
- Verify Firebase credentials in `.env`
- Check if Firebase project has authentication enabled
- Ensure private key is properly escaped (newlines as `\n`)

**Issue: "Port already in use"**
```bash
# Find process using port (example: 3001)
lsof -i :3001

# Kill process
kill -9 <PID>

# Or change port in .env
USER_SERVICE_PORT=3011
```

**Issue: "Module not found"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For Python
pip install -r requirements.txt --force-reinstall
```

**Issue: "RabbitMQ connection refused"**
```bash
# Check RabbitMQ status
docker logs hacknect-rabbitmq

# Restart RabbitMQ
docker-compose restart rabbitmq

# Wait 30 seconds for RabbitMQ to fully start
```

**Issue: "Embedding model download fails"**
```bash
# The sentence-transformers model downloads on first run
# Ensure you have ~500MB free disk space
# Check internet connection
# Or set in .env: USE_LOCAL_EMBEDDINGS=false and use OpenAI API
```

### Reset Everything

If things are completely broken:

```bash
# Stop all containers
docker-compose down

# Remove all volumes (WARNING: deletes all data)
docker-compose down -v

# Remove node_modules
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

# Start fresh
docker-compose up -d postgres mongodb redis rabbitmq
npm run migrate
npm install
docker-compose up
```

## 📚 Next Steps

Now that you have HackNect running locally:

1. **Read the Documentation**
   - [Architecture Overview](docs/architecture/README.md)
   - [API Documentation](docs/api/README.md)
   - [Contributing Guide](CONTRIBUTING.md)

2. **Explore the Codebase**
   - Start with `services/user-service` (simplest service)
   - Study `services/matchmaking-service` (AI logic)
   - Check `frontend/src/pages` (user interface)

3. **Make Your First Contribution**
   - Pick an issue labeled "good first issue"
   - Create a feature branch
   - Submit a pull request

4. **Run Tests**
   ```bash
   # Unit tests
   npm test
   
   # Integration tests
   npm run test:integration
   
   # E2E tests
   npm run test:e2e
   ```

5. **Set Up Your IDE**
   - Install recommended extensions (ESLint, Prettier, TypeScript)
   - Configure debugging
   - Set up Git hooks (pre-commit, pre-push)

## 🎓 Learning Resources

### Technologies Used
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PostgreSQL Tutorials](https://www.postgresql.org/docs/)
- [MongoDB University](https://university.mongodb.com/)
- [Redis Documentation](https://redis.io/docs/)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)
- [Docker Getting Started](https://docs.docker.com/get-started/)

### AI/ML Concepts
- [Sentence Transformers](https://www.sbert.net/)
- [Cosine Similarity Explained](https://www.machinelearningplus.com/nlp/cosine-similarity/)
- [Vector Embeddings Tutorial](https://developers.google.com/machine-learning/crash-course/embeddings/video-lecture)

## 💬 Get Help

- **GitHub Issues**: [github.com/your-org/hacknect/issues](https://github.com/your-org/hacknect/issues)
- **Discord**: [discord.gg/hacknect](https://discord.gg/hacknect)
- **Email**: dev@hacknect.com

## ✅ Checklist

After completing this guide, you should be able to:

- [ ] Start all infrastructure services with Docker
- [ ] Run all 9 microservices locally
- [ ] Access the frontend at localhost:3000
- [ ] Create a user account
- [ ] View the database in PostgreSQL
- [ ] See messages in RabbitMQ
- [ ] Make API calls to services
- [ ] Run tests successfully

**Congratulations! You're ready to build HackNect!** 🎉

---

*Last updated: February 2026*
*Questions? Open an issue or ask in Discord!*
